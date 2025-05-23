/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react" 
import API from "@functions/API"
import lodash from 'lodash'
import AddPekerjaModal from "@components/Modal/Admin/AddPekerja";
import DeletePekerjaModal from "@components/Modal/Admin/DeletePekerja";
import Swal from "sweetalert2";

const Vpekerja = () => {
    const [usersdata, setUsersdata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedPekerja, setSelectedPekerja] = useState(null);
    const [selectedPekerjaid, setSelectedPekerjaid] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const getData = lodash.debounce(async () => {
        const resp = await API.get('/api/listpekerja');
        setUsersdata(resp.data);
    }, 100);

    useEffect(() => {
        getData();
    }, []);

    const handleAddPekerja = async (data) => {
        try {
            await API.post('/api/addpekerja', data);
            Swal.fire('Berhasil', 'Pekerja berhasil ditambahkan.', 'success');
            getData(); 
        } catch (err) {
            console.error("Gagal menambah pekerja:", err);
        }
    };

    const handleDeletePekerja = async () => {
        try {
            await API.post('/api/deletepekerja', { uid: selectedPekerjaid });
            Swal.fire('Berhasil', 'Pekerja berhasil dihapus.', 'success');
            getData(); 
            setOpenDelete(false);
        } catch (err) {
            console.error("Gagal menambah pekerja:", err);
        }
    };

    const filteredUsers = usersdata.filter(user =>
        user.uname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-[url("/g_perpus.jpg")] h-full flex items-center justify-center'>
            <div className="bg-white w-[98%] mx-auto p-5 h-[95%] rounded-md">
                <AddPekerjaModal
                    isOpen={openAdd}
                    onClose={() => setOpenAdd(false)}
                    onSubmit={handleAddPekerja}
                />
                <DeletePekerjaModal
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    onDelete={handleDeletePekerja}
                    pekerjaName={selectedPekerja}
                />
                <h1 className="text-3xl font-bold mb-5 text-center">List Pekerja</h1>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                    {/* Tombol Tambah */}
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 sm:mb-0"
                        onClick={() => setOpenAdd(true)}
                    >
                        Tambah Pekerja
                    </button>

                    {/* Kolom Pencarian */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            className="border px-4 py-2 rounded w-full sm:w-64 text-sm"
                            placeholder="Cari pekerja..."
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
                                <th className="border px-2 py-1">No</th>
                                <th className="border px-2 py-1">Nama</th>
                                <th className="border px-2 py-1">Email</th>
                                <th className="border px-2 py-1">No. Telp</th>
                                <th className="border px-2 py-1">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.uid}>
                                        <td className="border px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border px-2 py-1">{user.uname}</td>
                                        <td className="border px-2 py-1">{user.email}</td>
                                        <td className="border px-2 py-1">{user.notelp}</td>
                                        <td className="border px-2 py-1 text-center">
                                            <button 
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                                onClick={() => {
                                                    setOpenDelete(true);
                                                    setSelectedPekerja(user.uname);
                                                    setSelectedPekerjaid(user.uid);
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border px-2 py-1 text-center">
                                        Tidak ada data pekerja
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

export default Vpekerja;
