import { useEffect, useState } from 'react';
import lodash from 'lodash';
import API from '@functions/API';
import EditbukuModal from '@components/Modal/Pekerja/Editbuku';
import AddbukuModal from '@components/Modal/Pekerja/Addbuku';
import DeletebukuModal from '@components/Modal/Pekerja/Deletebuku';
import Swal from 'sweetalert2';
const Daftarbuku = () => {
    const [booksdata, setBooksdata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedBookid, setSelectedBookid] = useState(null);

    const getData = lodash.debounce(async () => {
        const resp = await API.get('/api/listbuku');
        setBooksdata(resp.data);
    }, 100);

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddBook = async (data) => {
        try {
            await API.post('/api/addbuku', data); 
            Swal.fire('Berhasil', 'Buku berhasil ditambahkan.', 'success');
            getData(); 
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            Swal.fire('Error', 'Gagal menambahkan buku.', 'error');
        }
    };

    const handleEditBook = async (data) => {
        try{
            await API.post('/api/editbuku', data);
            Swal.fire('Berhasil', 'Buku berhasil diedit.', 'success');
            getData(); 
            setOpenEdit(false);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            Swal.fire('Error', 'Gagal mengedit buku.', 'error');
        } 
    }

    const handleDeleteBook = async () => {
        try {
            await API.post('/api/deletebuku', { uid: selectedBookid });
            Swal.fire('Berhasil', 'Buku berhasil dihapus.', 'success');
            getData(); 
            setOpenDelete(false);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            Swal.fire('Error', 'Gagal menghapus buku.', 'error');
        }
    };

    const filteredBooks = booksdata.filter(book =>
        book.nama .toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-[url("/g_perpus.jpg")] h-full flex items-center justify-center'>
            <div className="bg-white w-[98%] mx-auto p-5 h-[95%] rounded-md">
                <AddbukuModal
                isOpen={openAdd}
                onClose={() => setOpenAdd(false)}
                onSubmit={handleAddBook}
                />
                <EditbukuModal
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    onSubmit={handleEditBook}
                    book={selectedBook}
                />
                <DeletebukuModal
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    onDelete={handleDeleteBook}
                    bookName={selectedBook}
                />
                <h1 className="text-3xl font-bold mb-5 text-center">List Buku</h1>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                    {/* Tombol Tambah */}
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 sm:mb-0"
                        onClick={() => setOpenAdd(true)}
                    >
                        Tambah Buku
                    </button>
                    {/* Kolom Pencarian */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            className="border px-4 py-2 rounded w-full sm:w-64 text-sm"
                            placeholder="Cari buku..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabel List Pekerja */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1 text-center">No</th>
                                <th className="border px-2 py-1">Judul</th>
                                <th className="border px-2 py-1">Penulis</th>
                                <th className="border px-2 py-1">Penerbit</th>
                                <th className="border px-2 py-1">Stok</th>
                                <th className="border px-2 py-1">Stok tersedia</th>
                                <th className='border px-2 py-1'>Pinjam</th>
                                <th className="border px-2 py-1">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book, index) => (
                                    <tr key={book.uid}>
                                        <td className="border px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border px-2 py-1">{book.nama}</td>
                                        <td className="border px-2 py-1">{book.penulis}</td>
                                        <td className="border px-2 py-1">{book.penerbit}</td>
                                        <td className="border px-2 py-1">{book.stok}</td>
                                        <td className="border px-2 py-1">{book.stok_tersedia}</td>
                                        <td className="border px-2 py-1">{book.jumlah_dipinjam}</td>
                                        <td className="border px-2 py-1 text-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedBook(book);
                                                    setSelectedBookid(book.uid);
                                                    setOpenEdit(true);
                                                }}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedBook(book.nama);
                                                    setSelectedBookid(book.uid);
                                                    setOpenDelete(true);
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="border px-2 py-1 text-center">
                                        Tidak ada data user
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Daftarbuku;