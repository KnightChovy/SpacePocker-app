import { X, Trash2 } from 'lucide-react';

interface DeleteRoomConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomName?: string;
  isLoading?: boolean;
}

const DeleteRoomConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  roomName,
  isLoading = false,
}: DeleteRoomConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-white">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Delete Room</h2>
              <p className="text-sm text-slate-500 mt-1">
                This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="size-5" />
              </div>
              <div>
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete
                  {roomName ? (
                    <span className="font-semibold"> "{roomName}"</span>
                  ) : (
                    ' this room'
                  )}
                  ?
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  All related data may be lost.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-gray-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:pointer-events-none"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:pointer-events-none"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoomConfirmModal;
