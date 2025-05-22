import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SPnjmModal from './add/Selesaipinjaman';
import API from '../Functions/API';

const Riwayat = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const [riwayatsdata, setRiwayatdata] = useState([]);

    const fetchRiwayat = async () => {
      try {
      const res = await API.get('/api/riwayat');
      setRiwayatdata(Array.isArray(res.data) ? res.data : res.data.data || []);
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

    const filteredriwayat = riwayatsdata.filter(riwayat =>
      riwayat.nama_buku .toLowerCase().includes(searchQuery.toLowerCase())
    );

        const belumDikembalikan = filteredriwayat.filter(
      item => item.status === '2' || item.status === '3'
    );

    const sudahDikembalikan = filteredriwayat.filter(
      item => item.status !== '2' && item.status !== '3'
    );

  return (
    <div className='bg-[url("/g_perpus.jpg")] h-full flex items-center justify-center'>
      <div className="bg-white w-[98%] mx-auto p-5 h-[95%] rounded-md">        
        <SPnjmModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleConfirm}
              data={selectedData}
          />

          
        <div className='w-full h-full flex flex-col'>

          {/* Daftar yang belum dikembalikan */}
          <div className='w-full flex flex-col h-full'>
            <h2 className="text-xl font-bold mb-4 text-center">Peminjaman belum dikembalikan</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              className="border px-4 py-2 rounded w-full sm:w-64 text-sm"
              placeholder="Cari Peminjam..."
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
                {belumDikembalikan.length > 0 ? (
                  belumDikembalikan.map((item, index) => (
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

          {/* Daftar yang telah dikembalikan */}
          <div className='w-full flex flex-col h-full mt-auto'>
            <h2 className="text-xl font-bold mb-4 text-center">Peminjaman telah dikembalikan</h2>
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
                  </tr>
                </thead>
                <tbody>
                {sudahDikembalikan.length > 0 ? (
                  sudahDikembalikan.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{item.nm_plgn}</td>
                      <td className="border p-2">{item.nama_buku}</td>
                      <td className="border p-2">{formatDate(item.tanggal_pnjm)}</td>
                      <td className="border p-2">{formatDate(item.bataswkt)}</td>
                      <td className="border p-2">{getStatusLabel(item.status)}</td>
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

        </div>
      </div>
    </div>
  );
};

export default Riwayat;
