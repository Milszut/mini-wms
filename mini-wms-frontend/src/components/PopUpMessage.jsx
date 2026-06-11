import { MdErrorOutline, MdCheckCircle, MdInfoOutline } from "react-icons/md";

export const PopUpMessage = ({ message, type = "info", onClose }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "popup") onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle className="text-green-400 text-5xl mb-2" />;
      case "error":
        return <MdErrorOutline className="text-red-400 text-5xl mb-2" />;
      default:
        return <MdInfoOutline className="text-blue-400 text-5xl mb-2" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "success":
        return "Sukces!";
      case "error":
        return "Błąd!";
      default:
        return "Informacja";
    }
  };

  return (
    <div
      id="popup"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
    >
      <div className="bg-[#203047] shadow-black rounded-xl p-6 w-auto min-w-sm flex flex-col items-center text-center shadow-xl">
        {getIcon()}
        <h2 className="text-white text-2xl font-semibold mb-2">{getTitle()}</h2>
        <p className="text-white text-lg mb-5 whitespace-pre-line">{message}</p>
        <button
          onClick={onClose}
          className="bg-[#CC8111] hover:bg-[#9c6410] text-white font-bold py-2 px-6 rounded-lg transition cursor-pointer"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
};