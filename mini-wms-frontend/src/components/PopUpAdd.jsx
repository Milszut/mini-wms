import { useState } from "react";

export const PopUpAdd = ({title = "Dodaj", placeholder = "Podaj nazwę", submitText = "Dodaj", onSubmit, onClose,}) => {
  const [value, setValue] = useState("");
  const handleOnClose = (e) => {if (e.target.id === "popup") onClose();};
  const isDisabled = !value.trim();
  const handleSubmit = () => {if (isDisabled) return; onSubmit(value.trim());};
  return (
    <div
      id="popup"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
    >
      <div className="bg-[#203047] shadow-black rounded-xl p-6 w-auto min-w-sm flex flex-col items-center text-center shadow-xl">
        <h2 className="text-white text-2xl font-semibold mb-4">
          {title}
        </h2>
        <input
          type="text"
          value={value}
          maxLength={100}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 mb-5 text-white placeholder-gray-500 rounded border border-2  bg-[#18202D] border-white focus:outline-none focus:border-blue-700 hover:border-blue-700"
        />
        <div className="flex flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`text-white font-bold py-2 px-6 rounded-lg transition
              ${
                isDisabled
                  ? "bg-green-800 cursor-not-allowed opacity-60"
                  : "bg-green-600 hover:bg-green-800 cursor-pointer"
              }`}
          >
            {submitText}
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