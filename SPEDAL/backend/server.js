const fastify = require('fastify')({ logger: true });
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const jwt = require('@fastify/jwt');
const cors = require('@fastify/cors');
fastify.register(require('@fastify/formbody'));

fastify.register(require('@fastify/cookie'));

fastify.register(jwt, {
    secret: 'secret'
});

fastify.register(cors, (instance) => {
    return (req, callback) => {
        const corsOptions = {
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        };
        callback(null, corsOptions);
    };
});


let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spedal'
    // host: 'db',
    // user: 'izzy',
    // password: 'izzy123',
    // database: 'spedal'
});
  
db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed:', err);
        setTimeout(handleDisconnect, 2000);
    } else {
        console.log('Connected to database');
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'waduhajaahnaf@apps.ipb.ac.id',
        pass: 'beif xjbg odpx ehyv'
    }
});

function handleDisconnect() {
    db = mysql.createConnection(db.config);
    db.connect((err) => {
        if (err) {
            console.log('Database reconnecting failed:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connected to database again');
        }
    });

    db.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting to database...');
            handleDisconnect();
        } else {
            console.error('Database error:', err);
        }
    });
}

// Auth
fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body;
  
    try {
      const query = 'SELECT * FROM user WHERE (uname = ? OR email = ? OR notelp = ?) AND pwd = ?';
      const values = [username, username, username, password];
  
      const result = await new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
  
      if (result.length > 0) {
        const user = result[0];
        const token = fastify.jwt.sign({ uid: user.uid, role: user.role });
  
        // Set cookie langsung (default maxAge 1 hari misalnya)
        reply
          .setCookie('token', token, {
            httpOnly: true,
            secure: false, // set ke true jika HTTPS
            path: '/api',
            maxAge: 60 * 60 * 24 // 1 hari dalam detik
          })
          .code(200)
          .send({
            message: 'Login success',
            uname: user.uname,
            email: user.email,
            notelp: user.notelp,
            role: user.role
          });
      } else {
        return reply.code(401).send({ message: 'Login failed' });
      }
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: 'Internal server error' });
    }
});
  
fastify.get('/api/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/api' })
    .status(200)
    .send({ message: 'Logout success' });
  });

// OnHook
fastify.addHook('onRequest', async (request, reply) => {
    // Global
    if (request.url === '/api/getprofile'){
        try{
            const token = request.cookies.token;
            const decoded = fastify.jwt.verify(token);
            const uid = decoded.uid;
            const role = decoded.role;
            const query = 'SELECT uname, email, notelp FROM user WHERE uid = ?';
            const values = [uid];
            const result = await new Promise((resolve, reject) => {
                db.query(query, values, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            if (result.length > 0) {
                const user = result[0];
                reply.send({ uname: user.uname, email: user.email, notelp: user.notelp, role: role });
            } else {
                return reply.code(401).send({ message: 'Login failed' });
            }
        }catch(err){
            console.log(err)
        }
    }
    else if (request.url === '/api/checkrole'){
        try{
            const Headerrole = request.headers.authorization;    
            const token = request.cookies.token;
            const decoded = fastify.jwt.verify(token);
            const role = decoded.role;
            if (role === Headerrole){
                return reply.status(200).send({ message: 'OK' });
            }
            else{
                return reply.status(401).send({ message: 'Unauthorized' });
            }
        }catch(err){
            console.log(err)
        }
    }
    // Admin  
    // Pekerja
    // User
})

// Admin
fastify.post('/api/adminubahprofil', async (request, reply) => {
    const { uname, notelp, status } = request.body
    try {
        const token = request.cookies.token;
        const decoded = fastify.jwt.verify(token);
        const uid = decoded.uid;

        const updates = [];
        const values = [];
        let finaldata = '';
    
        if (status == 'uname') {
          updates.push('uname = ?');
          values.push(uname);
          finaldata = uname
        }
    
        if (status == 'notelp') {
          updates.push('notelp = ?');
          values.push(notelp);
          finaldata = notelp
        }
        
        values.push(uid);
    
        const query = `UPDATE user SET ${updates.join(', ')} WHERE uid = ?`;
        await new Promise((resolve, reject) => {
          db.query(query, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
    
        reply.status(200).send({ message: 'OK' , finaldata });
      } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
      }

})

// Admin - Admin Prob
fastify.get('/api/listadmin', async (request, reply) => {
    try {
        const query = 'SELECT uid, email, uname, notelp FROM user WHERE role = "admin"';
        const result = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        reply.send(result);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

fastify.post('/api/addadmin', async (request, reply) => {
    const { uname, email, password, notelp } = request.body;
    const uid = uuidv4();
    try {
        const query = 'INSERT INTO user (uid, uname, email, pwd, notelp, role) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [uid, uname, email, password, notelp, 'admin'];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

fastify.post('/api/deleteadmin', async (request, reply) => {    
    const {uid} = request.body;
    try {
        const query = 'DELETE FROM user WHERE uid = ?';
        const values = [uid];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

// Admin - Pekerja Prob
fastify.get('/api/listpekerja', async (request, reply) => {
    try {
        const query = 'SELECT uid, email, uname, notelp FROM user WHERE role = "pekerja"';
        const result = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        reply.send(result);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

fastify.post('/api/addpekerja', async (request, reply) => {
    const { uname, email, password, notelp } = request.body;
    const uid = uuidv4();
    try {
        const query = 'INSERT INTO user (uid, uname, email, pwd, notelp, role) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [uid, uname, email, password, notelp, 'pekerja'];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

fastify.post('/api/deletepekerja', async (request, reply) => {
    const {uid} = request.body;
    try {
        const query = 'DELETE FROM user WHERE uid = ?';
        const values = [uid];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})


// Admin - User Prob
fastify.get('/api/listuser', async (request, reply) => {
    try {
        const query = 'SELECT email, uname, notelp FROM user WHERE role = "user"';
        const result = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        reply.send(result);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

// Pekerja  
fastify.post('/api/pekerjaubahprofil', async (request, reply) => {
    const { uname, notelp, status } = request.body
    try {
        const token = request.cookies.token;
        const decoded = fastify.jwt.verify(token);
        const uid = decoded.uid;

        const updates = [];
        const values = [];
        let finaldata = '';
    
        if (status == 'uname') {
          updates.push('uname = ?');
          values.push(uname);
          finaldata = uname
        }
    
        if (status == 'notelp') {
          updates.push('notelp = ?');
          values.push(notelp);
          finaldata = notelp
        }
        
        values.push(uid);
    
        const query = `UPDATE user SET ${updates.join(', ')} WHERE uid = ?`;
        await new Promise((resolve, reject) => {
          db.query(query, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
    
        reply.status(200).send({ message: 'OK' , finaldata });
      } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
      }

})

fastify.get('/api/listbuku', async (request, reply) => {
    try {
        const query = `
            SELECT 
                b.*,
                IFNULL(j.jumlah_dipinjam, 0) AS jumlah_dipinjam,
                (b.stok - IFNULL(j.jumlah_dipinjam, 0)) AS stok_tersedia
            FROM buku b
            LEFT JOIN (
                SELECT 
                    uid_buku,
                    COUNT(*) AS jumlah_dipinjam
                FROM peminjaman
                WHERE status IN ('2', '3')
                GROUP BY uid_buku
            ) j ON b.uid = j.uid_buku
        `;

        const result = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        reply.send(result);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
});


fastify.post('/api/addbuku', async (request, reply) => {
    const { judul, penulis, penerbit, stok } = request.body;
    const uid = uuidv4();
    try {
        const query = 'INSERT INTO buku (uid, nama, penulis, penerbit, stok) VALUES (?, ?, ?, ?, ?)';
        const values = [uid, judul, penulis, penerbit, stok];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

fastify.post('/api/editbuku', async (request, reply) => {
    const { id, nama, penulis, penerbit, stok } = request.body;

    if (!id || !nama || !penulis || !penerbit || stok === undefined) {
        return reply.code(400).send({ message: 'Semua field harus diisi!' });
    }

    try {
        const query = 'UPDATE buku SET nama = ?, penulis = ?, penerbit = ?, stok = ? WHERE uid = ?';
        const values = [nama, penulis, penerbit, stok, id];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.code(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.code(500).send({ message: 'Terjadi kesalahan saat mengedit buku.' });
    }
});


fastify.post('/api/deletebuku', async (request, reply) => {
    const {uid} = request.body;
    try {
        const query = 'DELETE FROM buku WHERE uid = ?';
        const values = [uid];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})

fastify.post('/api/pinjam', async (request, reply) => {
    const { uid_buku, namaPelanggan, nik, email, kontak, bataswkt } = request.body;
  
    try {
      const query = 'INSERT INTO peminjaman (uid_buku, nm_plgn, nik, email, kontak, status, tanggal_pnjm, bataswkt) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)';
      const values = [uid_buku, namaPelanggan, nik, email, kontak, '2', bataswkt];
  
      await new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
  
      const mailOptions = {
        from: 'waduhajaahnaf@apps.ipb.ac.id',
        to: email,
        subject: 'Perpustakaan Digital - Konfirmasi Peminjaman',
        text:   `Halo ${namaPelanggan},
                
                Peminjaman buku Anda telah berhasil dilakukan pada tanggal ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}.
                Mohon mengembalikan buku paling lambat pada tanggal ${bataswkt} untuk menghindari denda keterlambatan.
                
                Terima kasih,
                Tim Perpustakaan`
      };
  
      await transporter.sendMail(mailOptions);
  
      reply.send({ message: 'Peminjaman berhasil dan email terkirim' });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ message: 'Gagal memproses peminjaman', error: err.message });
    }
});

fastify.get('/api/riwayat', async (req, reply) => {
    try {
      const query =`
        SELECT 
          p.id, p.nm_plgn, p.kontak, p.email, p.nik, p.tanggal_pnjm, p.bataswkt, p.status,
          b.nama AS nama_buku, b.penulis, b.penerbit
        FROM peminjaman p
        JOIN buku b ON p.uid_buku = b.uid
        ORDER BY p.id DESC
      `
      const result = await new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: 'Gagal mengambil data peminjaman' });
    }
});

fastify.post('/api/kembalikan', async (request, reply) => {
    const { uid } = request.body;
    try {
        const query = 'UPDATE peminjaman SET status = ? WHERE id = ?';
        const values = ['1', uid];
        await new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        reply.status(200).send({ message: 'OK' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ message: 'Gagal memproses permintaan' });
    }
})


// Server
fastify.listen({ port: 3000, host: '0.0.0.0' }).catch((err) => {
    fastify.log.error(err);
    process.exit(1);
});