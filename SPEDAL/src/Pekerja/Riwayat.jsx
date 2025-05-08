import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import SPnjmModal from './add/Selesaipinjaman';
import API from '../Functions/API';

const Riwayat = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const [riwayatsdata, setRiwayatdata] = useState([]);

    const fetchRiwayat = async () => {
      try {
      const res = await axios.get('/api/riwayat');
      setRiwayatdata(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
      Swal.fire('Error', 'Gagal memuat data riwayat', 'error');
      }
    };
    
    // Fetch data riwayat dari server
    useEffect(() => {
        fetchRiwayat();
    }, []);



    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        });
    };
    
    // Fungsi styling status
    const getStatusLabel = (status) => {
        switch (status) {
        case '1':
            return <span className="text-green-600 font-semibold">Telah Dikembalikan</span>;
        case '2':
            return <span className="text-yellow-600 font-semibold">Sedang Dipinjam</span>;
        case '3':
            return <span className="text-red-600 font-semibold">Terlambat Mengembalikan</span>;
        default:
            return <span className="text-gray-500">Status Tidak Diketahui</span>;
        }
    };

  
    const handleOpenModal = (item) => {
        setSelectedData(item);
        setModalOpen(true);
    };

    const filteredriwayat = riwayatsdata.filter(riwayat =>
      riwayat.nama_buku .toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfirm = async () => {
        try {
            await API.post(`/api/kembalikan`, { uid: selectedData.id });
            setModalOpen(false);
            // refresh data
            fetchRiwayat();
            Swal.fire('Berhasil', 'Buku berhasil dikembalikan.', 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Gagal mengembalikan buku.', 'error');
        }
    };

  return (
    <div className="container mx-auto p-5">
      
      <SPnjmModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirm}
            data={selectedData}
        />
      <h1 className="text-3xl font-bold mb-5 text-center">List Buku</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        {/* Kolom Pencarian */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            className="border px-4 py-2 rounded w-full sm:w-64 text-sm"
            placeholder="Cari Buku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


  
        <div className="overflow-x-auto"> 
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">No</th>
                <th className="border p-2">Nama Peminjam</th>
                <th className="border p-2">Buku</th>
                <th className="border p-2">Tanggal Pinjam</th>
                <th className='border p-2'>Tanggal Pengembalian</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
            {filteredriwayat.length > 0 ? (
              filteredriwayat.map((item, index) => (
                <tr key={item.id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.nm_plgn}</td>
                  <td className="border p-2">{item.nama_buku}</td>
                  <td className="border p-2">{formatDate(item.tanggal_pnjm)}</td>
                  <td className="border p-2">{formatDate(item.bataswkt)}</td>
                  <td className="border p-2">{getStatusLabel(item.status)}</td>
                  <td className="border p-2 text-center">
                      {(item.status == '2' || item.status == '3') ? (
                          <button
                              onClick={() => handleOpenModal(item)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                              Kembalikan
                          </button>
                      ) : (
                          <>
                          <p className='p-2'>-</p>
                          </>
                      )}
                  </td>
                </tr>
              ))): (
                <tr>
                  <td colSpan="7" className="border px-2 py-1 text-center">
                      Tidak ada data buku
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default Riwayat;
