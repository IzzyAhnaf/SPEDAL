import { useState, useEffect } from 'react';
import API from '../Functions/API';
import lodash from 'lodash';
import Swal from 'sweetalert2';


const Buatpesanan = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [formData, setFormData] = useState({
        namaPelanggan: '',
        kontak: '',
        bukuId: '',
        email: '',
        nik: '',
        bataswkt: '',
    });

    const fetchBooks = lodash.debounce(async () => {
        try {
            const response = await API.get('/api/listbuku');
            setBooks(response.data);
        } catch (err) {
            console.error('Gagal memuat buku:', err);
        }
    }, 200);

    useEffect(() => {

        fetchBooks();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBooks([]);
        } else {
            const filtered = books.filter((buku) =>
                buku.nama.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    }, [searchTerm, books]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBookSelect = (buku) => {
        setFormData({ ...formData, uid_buku: buku.uid });
        setSearchTerm(`${buku.nama} - ${buku.penulis}`);
        setFilteredBooks([]);
    };

    const handleSubmit = lodash.debounce(async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/pinjam', formData);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data peminjaman berhasil disimpan.',
                confirmButtonText: 'OK'
              });
            setFormData({
                namaPelanggan: '',
                kontak: '',
                uid_buku: '',
                email: '',
                nik: '',
                bataswkt: '',
            });
            setSearchTerm('');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat menyimpan data.',
            });
        }
    }, 500);

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Buat Pesanan Peminjaman</h1>
            <form onSubmit={handleSubmit} className="space-y-4 relative">
                <div>
                    <p>Buku</p>
                    <input
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari judul buku"
                        className="w-full border px-3 py-2 rounded"
                        autoComplete="off"
                        required
                    />
                    {filteredBooks.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow">
                            {filteredBooks.map((buku) => (
                                <li
                                    key={buku.uid}
                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => handleBookSelect(buku)}
                                >
                                    {buku.nama} - {buku.penulis}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <p>Nama Pelanggan</p>
                    <input
                        type="text"
                        name="namaPelanggan"
                        value={formData.namaPelanggan}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <p>Kontak</p>
                    <input
                        type="number"
                        name="kontak"
                        value={formData.kontak}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <p>Email</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <p>NIK</p>
                    <input
                        type="number"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <p>Tanggal Pengembalian</p>
                    <input
                        type="date"
                        name="bataswkt"
                        value={formData.bataswkt}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Buat Pesanan
                </button>
            </form>
        </div>
    );
};

export default Buatpesanan;
