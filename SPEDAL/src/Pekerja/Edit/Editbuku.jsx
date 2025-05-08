import { useState, useEffect } from "react";

const EditbukuModal = ({ isOpen, onClose, onSubmit, book }) => {
    const [formData, setFormData] = useState({
        nama: "",
        penulis: "",
        penerbit: "",
        stok: "",
    });

    useEffect(() => {
        if (book) {
            setFormData({
                nama: book.nama || "",
                penulis: book.penulis || "",
                penerbit: book.penerbit || "",
                stok: book.stok || "",
            });
        }
    }, [book]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, id: book.uid });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Edit Buku</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Judul Buku"
                        className="w-full border px-3 py-2 rounded" required />
                    <input type="text" name="penulis" value={formData.penulis} onChange={handleChange} placeholder="Penulis"
                        className="w-full border px-3 py-2 rounded" required />
                    <input type="text" name="penerbit" value={formData.penerbit} onChange={handleChange} placeholder="Penerbit"
                        className="w-full border px-3 py-2 rounded" required />
                    <input type="number" name="stok" value={formData.stok} onChange={handleChange} placeholder="Stok"
                        className="w-full border px-3 py-2 rounded" required />
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
                        <button type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditbukuModal;
