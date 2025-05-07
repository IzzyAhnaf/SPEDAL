import { useEffect, useState } from "react" 
import API from "../Functions/API"
import lodash from 'lodash'

const Vuser = () => {
    const [usersdata, setUsersdata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const getData = lodash.debounce(async () => {
        const resp = await API.get('/api/listuser');
        setUsersdata(resp.data);
    }, 100);

    useEffect(() => {
        getData();
    }, []);

    const filteredUsers = usersdata.filter(user =>
        user.uname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold mb-5 text-center">List User</h1>
            <div className="flex flex-col sm:flex-row justify-end items-center mb-5">
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
                            <th className="border px-2 py-1 text-center">No</th>
                            <th className="border px-2 py-1">Nama</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">No. Telp</th>
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="border px-2 py-1 text-center">
                                    Tidak ada data user
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Vuser;
