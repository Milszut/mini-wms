export const PopUpConfirm = ({
  message,
  confirmText,
  confirmColor = "bg-red-600 hover:bg-red-800",
  onConfirm,
  onClose,
}) => {
  const handleOnClose = (e) => {
    if (e.target.id === "popup") onClose();
  };

  return (
    <div
      id="popup"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
    >
      <div className="bg-[#203047] shadow-black rounded-xl p-6 w-auto min-w-sm flex flex-col items-center text-center shadow-xl">
        <p className="text-white text-lg mb-5 whitespace-pre-line">
          {message}
        </p>

        <div className="flex flex-row gap-3">
          <button
            onClick={onConfirm}
            className={`${confirmColor} text-white font-bold py-2 px-6 rounded-lg transition cursor-pointer`}
          >
            {confirmText}
          </button>

          <button
            onClick={onClose}
            className="bg-[#CC8111] hover:bg-[#9c6410] text-white font-bold py-2 px-6 rounded-lg transition cursor-pointer"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};