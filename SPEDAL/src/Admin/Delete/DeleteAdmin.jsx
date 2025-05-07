const DeleteAdminModal = ({ isOpen, onClose, onDelete, adminName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 sm:w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Hapus Admin</h2>
                <p className="mb-6 text-center">
                    Yakin ingin menghapus <span className="font-semibold">{adminName}</span>?
                </p>
                <div className="flex justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onDelete}
                        className="w-full sm:w-auto px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAdminModal;
