import { useState } from "react";
import CustomSelectForm from "./CustomSelectForm";
import {disposeItem,} from "../services/items";

export default function DisposeTab({item, dropdowns, mobile = false, saveItem, setMessage,}) {
  const [quantity, setQuantity] = useState("");
  const [statusId, setStatusId] = useState("");
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const parsedQty = Number(quantity) || 0;
  const remaining = Math.max(item.quantity - parsedQty, 0);
  const availableStatuses = dropdowns?.statuses?.filter((s) => s.name?.toLowerCase() !== "na stanie") || [];
  const selectedStatus = availableStatuses.find((s) => Number(s.id) === Number(statusId));
  const actionName = selectedStatus?.name || "operację";
  const isValid = parsedQty > 0 && parsedQty <= item.quantity && statusId !== "" && destination.trim() !== "";
  const isModified = quantity !== "" || statusId !== "" || destination.trim() !== "" || notes.trim() !== "";

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
      const fullDispose = parsedQty === item.quantity;
      await disposeItem(item.id,{quantity: parsedQty, status_id: Number(statusId), destination, notes,});
      saveItem((prev) => ({
        ...prev,
        quantity:
          remaining,
      }));
      setMessage({
        text: "Operacja została wykonana",
        type: "success",
        redirectTo: fullDispose ? "/list" : null,
      });
      setConfirmOpen(false);
      setQuantity("");
      setStatusId("");
      setDestination("");
      setNotes("");
    } catch (err) {
      console.error("Dispose error:", err);

      setMessage({
        text: err.message || "Nie udało się wykonać operacji", 
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
          <div className="w-full">
            <CustomSelectForm
              label="Nowy status"
              placeholder="Wybierz status"
              options={availableStatuses}
              value={statusId}
              onChange={setStatusId}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1">
              Ilość do operacji:
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

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="np. Firma X"
            className="w-full p-1 px-2 rounded border-2 border-white bg-transparent text-white focus:outline-none focus:border-blue-700 hover:border-blue-700"
          />
        </div>

        <div className="flex flex-col flex-grow">
          <label className="mb-1">
            Uwagi:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="np. Sprzedane po 40 zł/szt"
            className="w-full h-40 p-2 rounded border-2 border-white bg-transparent text-white resize-none custom-scrollbar focus:outline-none focus:border-blue-700 hover:border-blue-700"
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
                ? "Wykonywanie..."
                : "Wykonaj operację"
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
              Czy chcesz potwierdzić operację:
              <span className="text-white font-semibold">
                {" "}
                {actionName}
              </span>
              {" "}dla:
              <span className="text-white font-semibold">
                {" "}
                {parsedQty} szt.
              </span>
              {" "}przedmiotu:
              <span className="text-white font-semibold">
                {" "}
                {item.item_name}
              </span>
              ?
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
                    ? "Wykonywanie..."
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