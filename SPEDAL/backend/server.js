const fastify = require('fastify')({ logger: true });
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');
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

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spedal'
});

db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed:', err);
        setTimeout(handleDisconnect, 2000);
    } else {
        console.log('Connected to database');
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
  
      // Bungkus db.query dalam Promise agar bisa pakai await
      const result = await new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
  
      if (result.length > 0) {
        const user = result[0];
        const token = fastify.jwt.sign({ uid: user.uid, role: user.role });
  
        reply
          .setCookie('token', token, {
            httpOnly: true,
            secure: false, // set true jika di https
          })
          .code(200)
          .send({ message: 'Login success', uname: user.uname, email: user.email, notelp: user.notelp, role: user.role });
      } else {
        return reply.code(401).send({ message: 'Login failed' });
      }
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });
  

fastify.post('/register', async (request, reply) => {
    
})

fastify.get('/api/logout', async (request, reply) => {
    reply.clearCookie('token').code(200).send({ message: 'Logout success' });
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
        const query = 'SELECT * FROM buku';
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
    
})

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
// User

// Server
fastify.listen({ port: 3000, host: 'localhost' }).catch((err) => {
    fastify.log.error(err);
    process.exit(1);
});