import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import SPnjmModal from './add/Selesaipinjaman';
import API from '../Functions/API';

const Riwayat = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [riwayat, setRiwayat] = useState([]);

    // Fetch data riwayat dari server
    useEffect(() => {
        fetchRiwayat();
    }, []);

    const fetchRiwayat = async () => {
        try {
        const res = await axios.get('/api/riwayat');
        setRiwayat(res.data);
        console.log(res.data);
        } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Gagal memuat data riwayat', 'error');
        }
    };

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Riwayat Peminjaman</h1>
      
      <SPnjmModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirm}
            data={selectedData}
        />

      {riwayat.length === 0 ? (
        <p>Tidak ada data riwayat.</p>
      ) : (
        <table className="w-full border">
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
            {riwayat.map((item, index) => (
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Riwayat;
