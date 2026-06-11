import { useState } from "react";
import { restoreItem } from "../services/items";

export default function RestoreTab({item, mobile = false, saveItem, setMessage,}) {
  const [quantity, setQuantity] = useState("");
  const [restoreNotes, setRestoreNotes] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const parsedQty = Number(quantity) || 0;
  const remaining = Math.max(item.quantity - parsedQty, 0);
  const isValid = parsedQty > 0 && parsedQty <= item.quantity;
  const isModified = quantity !== "" || restoreNotes.trim() !== "";

  const display = (v) => {
    if (v === null || v === undefined || v === "" || v === "null") {
      return "Brak...";
    }
    return v.toString();
  };

  const handleConfirm = async () => {
    if (!isValid || !isModified || loading) {
      return;
    }
    try {
      setLoading(true);
      const fullRestore = parsedQty === item.quantity;
      await restoreItem(item.id,{
        quantity: parsedQty,
        restore_notes: restoreNotes,
      });
      if (parsedQty !== item.quantity) {
        saveItem((prev) => ({
          ...prev,
          quantity: remaining,
        }));
      }
      setMessage({
        text: "Przedmiot został przywrócony",
        type: "success",
        redirectTo: fullRestore ? "/disposed" : null,
      });
      setConfirmOpen(false);
      setQuantity("");
      setRestoreNotes("");
    } catch (err) {
      setMessage({
        text: err.message || "Nie udało się przywrócić przedmiotu",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col text-white gap-4
          ${
            mobile
              ? "w-full"
              : "min-h-[572px] max-h-[572px]"
          }
        `}
      >

        <div className="flex flex-col">
          <label className="mb-1">
            Nazwa:
          </label>
          <div className="w-full p-1 px-2 rounded border-2 border-white/40 bg-white/10 text-gray-300 truncate">
            {display(item?.item_name)}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col w-full">
            <label className="mb-1">
              Aktualna ilość:
            </label>
            <div className="w-full p-1 px-2 rounded border-2 border-white/40 bg-white/10 text-gray-300">
              {item?.quantity}
            </div>
          </div>
          <div className="flex flex-col w-40 shrink-0">
            <label className="mb-1">
              Cena jednostkowa:
            </label>
            <div className="w-full p-1 px-2 rounded border-2 border-white/40 bg-white/10 text-gray-300">
              {item?.unit_price} zł
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-col w-full">
            <label className="mb-1">
              Aktualny status:
            </label>
            <div className="w-full p-1 px-2 rounded border-2 border-white/40 bg-white/10 text-gray-300">
              {display(item?.status)}
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1">
              Ilość do przywrócenia:
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d{0,8}$/.test(value)) {
                  setQuantity(value);
                }
              }}
              placeholder="np. 12"
              className="w-full p-1 px-2 rounded border-2 border-white bg-transparent text-white focus:outline-none focus:border-blue-700 hover:border-blue-700"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1">
              Pozostanie:
            </label>
            <div
              className={`w-full p-1 px-2 rounded border-2 bg-white/10
                ${
                  parsedQty >
                    item.quantity
                    ? "border-red-500 text-red-400"
                    : "border-white/40 text-gray-300"
                }
              `}
            >
              {
                parsedQty > item.quantity
                  ? "Błąd ilości"
                  : `${remaining} szt.`
              }
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1">
            Lokalizacja docelowa:
          </label>
          <div className="w-full p-1 px-2 rounded border-2 border-white/40 bg-white/10 text-gray-300">
            {display(item?.destination)}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1">
            Poprzednie uwagi:
          </label>
          <textarea
            value={display(item?.notes)}
            readOnly
            className="w-full h-16 p-2 rounded border-2 border-white/40 bg-white/10 text-gray-300 resize-none custom-scrollbar focus:outline-none"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label className="mb-1">
            Dodatkowe uwagi przy przywróceniu:
          </label>
          <textarea
            value={restoreNotes}
            onChange={(e) => setRestoreNotes(e.target.value)}
            placeholder="np. Odkupione za 45 zł/szt"
            className="w-full h-16 p-2 rounded border-2 border-white bg-transparent text-white resize-none custom-scrollbar focus:outline-none focus:border-blue-700 hover:border-blue-700"
          />
        </div>
        <div className="flex justify-center items-center mt-2">
          <button
            type="button"
            disabled={!isValid || !isModified || loading}
            onClick={() => setConfirmOpen(true)}
            className={`h-8 px-4 rounded-lg font-medium text-white transition-all
              ${
                isValid && isModified
                  ? "bg-[#9c723d] hover:bg-[#6d4d25] cursor-pointer"
                  : "bg-gray-500 opacity-60 cursor-not-allowed"
              }
            `}
          >
            {
              loading
                ? "Przywracanie..."
                : "Przywróć rekord"
            }
          </button>
        </div>
      </div>
      {confirmOpen && (
        <div
          onClick={(e) => {if (e.target.id === "popup") {setConfirmOpen(false);}}}
          id="popup"
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
        >
          <div className="bg-[#203047] shadow-black rounded-xl p-6 w-auto min-w-sm flex flex-col items-center text-center shadow-xl">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Potwierdzenie
            </h2>
            <p className="text-gray-200 leading-relaxed mb-6">
              Czy chcesz przywrócić:
              <span className="text-white font-semibold">
                {" "}
                {parsedQty} szt.
              </span>
              {" "}przedmiotu:
              <span className="text-white font-semibold">
                {" "}
                {item.item_name}
              </span>
              {" "}do głównego rekordu?
            </p>
            <div className="flex flex-row gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`text-white font-bold py-2 px-6 rounded-lg transition
                  ${
                    loading
                      ? "bg-green-800 cursor-not-allowed opacity-60"
                      : "bg-green-600 hover:bg-green-800 cursor-pointer"
                  }
                `}
              >
                {
                  loading
                    ? "Przywracanie..."
                    : "Potwierdź"
                }
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="bg-[#CC8111] hover:bg-[#9c6410] cursor-pointer text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Anuluj
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}