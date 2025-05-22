const SPnjmModal = ({ isOpen, onClose, onConfirm, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Konfirmasi Pengembalian</h2>
                <p className="mb-4">
                    Apakah Anda yakin ingin menandai buku <strong>{data?.judul}</strong> sebagai telah dikembalikan?
                </p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                        Batal
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        Ya, Kembalikan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SPnjmModal;