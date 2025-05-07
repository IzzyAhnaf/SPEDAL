import { useState } from "react";

const AddbukuModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ judul: "", penulis: "", penerbit: "", stok: ""});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ judul: "", penulis: "", penerbit: "", stok: ""});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 sm:w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Tambah Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleChange}
                        placeholder="Judul"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="penulis"
                        value={formData.penulis}
                        onChange={handleChange}
                        placeholder="Penulis"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="penerbit"
                        value={formData.penerbit}
                        onChange={handleChange}
                        placeholder="Penerbit"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        name="stok"
                        value={formData.stok}
                        onChange={handleChange}
                        placeholder="Stok"
                        className="w-full border px-3 py-2 rounded"
                        onWheel={(e) => e.target.blur()}
                        required
                    />
                    <div className="flex justify-between gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddbukuModal