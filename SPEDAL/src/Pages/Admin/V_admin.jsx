/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import API from "@functions/API";
import AddAdminModal from "@components/Modal/Admin/AddAdmin";
import lodash from 'lodash';
import DeleteAdminModal from "@components/Modal/Admin/DeleteAdmin";
import Swal from "sweetalert2";

const Vadmin = () => {
    const [usersdata, setUsersdata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selectedAdminid, setSelectedAdminid] = useState(null);

    // Fetch data from API
    const getData = lodash.debounce(async () => {
        try {
            const resp = await API.get('/api/listadmin');
            setUsersdata(resp.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 100);

    useEffect(() => {
        getData();
    }, []);

    const handleAddAdmin = async (data) => {
        try {
            await API.post('/api/addadmin', data);
            Swal.fire('Berhasil', 'Admin berhasil ditambahkan.', 'success');
            getData();
        } catch (err) {
            Swal.fire('Error', 'Gagal menambahkan admin.', 'error');
        }
    };

    const handleDeleteAdmin = async () => {
        try {
            await API.post('/api/deleteadmin', { uid: selectedAdminid });
            Swal.fire('Berhasil', 'Admin berhasil dihapus.', 'success');
            getData();
            setOpenDelete(false);
        } catch (err) {
            Swal.fire('Error', 'Gagal menghapus admin.', 'error');
        }
    };

    const filteredUsers = usersdata.filter(user =>
        user.uname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-[url("/g_perpus.jpg")] h-full flex items-center justify-center'>
            <div className="bg-white w-[98%] mx-auto p-5 h-[95%] rounded-md">
                <AddAdminModal
                    isOpen={openAdd}
                    onClose={() => setOpenAdd(false)}
                    onSubmit={handleAddAdmin}
                />
                <DeleteAdminModal
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    onDelete={handleDeleteAdmin}
                    adminName={selectedAdmin}
                />
                <h1 className="text-3xl font-bold mb-5 text-center">List Admin</h1>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                    {/* Tombol Tambah */}
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 sm:mb-0"
                        onClick={() => setOpenAdd(true)}
                    >
                        Tambah Admin
                    </button>

                    {/* Kolom Pencarian */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            className="border px-4 py-2 rounded w-full sm:w-64 text-sm"
                            placeholder="Cari admin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabel List Admin */}
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
                                                onClick={() => {
                                                    setSelectedAdmin(user.uname);
                                                    setSelectedAdminid(user.uid);
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
                                    <td colSpan="5" className="border px-2 py-1 text-center">
                                        Tidak ada data admin
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

export default Vadmin;
