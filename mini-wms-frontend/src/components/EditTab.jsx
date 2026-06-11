import {useEffect, useRef, useState,} from "react";
import {MdAddPhotoAlternate, MdDelete, MdEdit,} from "react-icons/md";
import Tooltip from "./Tooltip";
import CustomSelectForm from "./CustomSelectForm";
import AutoResizeTextarea from "./AutoResizeTextarea";
import {updateItem, getItemById,} from "../services/items";

export default function EditTab({item, setItem, saveItem, dropdowns, setMessage, mobile = false,}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageActions, setImageActions] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const initialItemRef = useRef(null);

  useEffect(() => {
    initialItemRef.current = { ...item };
  }, []);

  const isModified = initialItemRef.current
  ? (
      item?.item_name !== initialItemRef.current?.item_name ||
      item?.serial_number !== initialItemRef.current?.serial_number ||
      item?.quantity !== initialItemRef.current?.quantity ||
      item?.unit_price !== initialItemRef.current?.unit_price ||
      item?.notes !== initialItemRef.current?.notes ||
      item?.location_id !== initialItemRef.current?.location_id ||
      item?.service_id !== initialItemRef.current?.service_id ||
      item?.condition_id !== initialItemRef.current?.condition_id ||
      item?.image_url !== initialItemRef.current?.image_url ||
      item?.remove_image !== initialItemRef.current?.remove_image ||
      !!item?.image_path
    )
  : false;
  
  const display = (v) => {
    if (v === null || v === undefined || v === "null") {
      return "";
    }
    return v.toString();
  };

  const currentImage = imagePreview || item?.image_url ||"";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericChange = (e, maxDigits = 8, maxDecimals = 2) => {
    const { name, value } = e.target;
    const regex = new RegExp(`^\\d{0,${maxDigits}}(\\.\\d{0,${maxDecimals}})?$`);
    if (value === "" || regex.test(value)) {
      setItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    setItem((prev) => ({
      ...prev,
      image_path: file,
      remove_image: false,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {setImagePreview(reader.result);};
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);

    setImageActions(false);

    setItem((prev) => ({
      ...prev,
      image_path: null,
      image_url: null,
      remove_image: true,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setItem({ ...initialItemRef.current });
    setImagePreview(null);
    setImageActions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!isModified || saving) return;
    try {
      setSaving(true);
      await updateItem(item.id, item);
      const freshItem = await getItemById(item.id);
      saveItem(freshItem);
      setItem(freshItem);
      initialItemRef.current = { ...freshItem };
      setImagePreview(null);
      setImageActions(false);
      setMessage({text: "Zmiany zostały zapisane", type: "success",});
    } catch (err) {
      console.error("Błąd zapisu:", err);
      setMessage({text: "Nie udało się zapisać zmian", type: "error",});
    } finally {
      setSaving(false);
    }
  };

  if (mobile) {
    return (
      <div className="flex flex-col text-white">
        <label className="mb-1">
          Nazwa przedmiotu:
        </label>

        <AutoResizeTextarea
          name="item_name"
          value={display(item?.item_name)}
          onChange={handleChange}
          placeholder="np. Mikrofon"
          maxLength={100}
          minRows={1}
        />

        <label className="mb-1">
          Numer seryjny:
        </label>

        <input
          type="text"
          name="serial_number"
          value={display(item?.serial_number)}
          onChange={handleChange}
          placeholder="np. SN123456"
          maxLength={100}
          className="w-full p-1 rounded mb-2 border-2 border-white bg-transparent text-white truncate focus:outline-none focus:border-blue-700"
        />

        <label className="mb-1">
          Ilość:
        </label>

        <input
          type="text"
          inputMode="numeric"
          name="quantity"
          value={display( item?.quantity)}
          onChange={(e) => handleNumericChange(e, 8, 0)}
          placeholder="np. 10"
          className="w-full p-1 rounded mb-2 border-2 border-white bg-transparent text-white focus:outline-none focus:border-blue-700"
        />

        <label className="mb-1">
          Cena jednostkowa:
        </label>

        <input
          type="text"
          inputMode="decimal"
          name="unit_price"
          value={display(item?.unit_price)}
          onChange={(e) => handleNumericChange(e, 8, 2)}
          placeholder="np. 199.99"
          className="w-full p-1 rounded mb-2 border-2 border-white bg-transparent text-white focus:outline-none focus:border-blue-700"
        />

        <CustomSelectForm
          label="Lokalizacja"
          placeholder="Wybierz lokalizacje"
          options={dropdowns?.locations || []}
          value={item?.location_id}
          onChange={(val) =>
            setItem((prev) => ({
              ...prev,
              location_id: val,
            }))
          }
          className="mb-2"
        />

        <CustomSelectForm
          label="Dział"
          placeholder="Wybierz dział"
          options={dropdowns?.services || []}
          value={item?.service_id}
          onChange={(val) =>
            setItem((prev) => ({
              ...prev,
              service_id: val,
            }))
          }
          className="mb-2"
        />

        <CustomSelectForm
          label="Stan"
          placeholder="Wybierz stan"
          options={dropdowns?.conditions || []}
          value={item?.condition_id}
          onChange={(val) =>
            setItem((prev) => ({
              ...prev,
              condition_id: val,
            }))
          }
          className="mb-2"
        />

        <div className="mb-2">
          <label className="mb-1 block">
            Status:
          </label>

          <div className="w-full p-1 border-2 border-white/40 bg-white/10 text-gray-300 cursor-not-allowed rounded">
            {
              dropdowns?.statuses?.find((s) => s.id === item?.status_id)?.name || "Brak..."
            }
          </div>
        </div>

        <label className="mb-1">
          Uwagi:
        </label>

        <textarea
          name="notes"
          value={display(item?.notes)}
          onChange={handleChange}
          placeholder="np. Lekko zarysowana obudowa..."
          maxLength={2000}
          className="w-full h-40 rounded p-2 border-2 border-white bg-transparent text-white resize-none focus:outline-none focus:border-blue-700"
        />

        <div className="relative w-full h-40 bg-white/20 rounded-lg flex items-center justify-center mt-3 overflow-hidden"
          onClick={() => {
            if (currentImage) {
              setImageActions(
                (prev) => !prev
              );
            }
          }}
        >

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />

          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={item?.item_name ||"Zdjęcie"}
                className={`w-full h-full object-cover transition
                  ${
                    imageActions
                      ? "brightness-50"
                      : ""
                  }
                `}
              />

              {imageActions && (
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-yellow-500 p-3 rounded-full"
                  >
                    <MdEdit className="text-3xl text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-600 p-3 rounded-full"
                  >
                    <MdDelete className="text-3xl text-white" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer">
              <MdAddPhotoAlternate className="text-5xl mb-1" />
              <p className="text-sm">
                Dodaj zdjęcie
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-center items-center mt-2 gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isModified || saving}
            className={`h-8 px-4 rounded-lg font-medium text-white transition-all cursor-pointer
            ${
              isModified
                ? "bg-[#9c723d] cursor-pointer"
                : "bg-gray-500 opacity-60 cursor-not-allowed"
            }
            `}
          >
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!isModified || saving}
            className={`h-8 px-4 rounded-lg font-medium text-white transition-all
            ${
              isModified
                ? "bg-[#CC8111] cursor-pointer"
                : "bg-gray-500 opacity-60 cursor-not-allowed"
            }
            `}
          >
            Przywróć zmiany
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-white h-full">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-full min-w-0">
          <label className="block mb-1">
            Nazwa przedmiotu:
          </label>
          <Tooltip>
            <input
              data-tooltip-content
              type="text"
              name="item_name"
              value={display(item?.item_name)}
              onChange={handleChange}
              placeholder="np. Mikrofon"
              maxLength={100}
              className="w-full p-1 px-2 rounded mb-4 border-2 border-white bg-transparent text-white truncate focus:outline-none focus:border-blue-700 hover:border-blue-700"
            />
          </Tooltip>

          <label className="block mb-1">
            Numer seryjny:
          </label>
          <Tooltip>
            <input
              data-tooltip-content
              type="text"
              name="serial_number"
              value={display(item?.serial_number)}
              onChange={handleChange}
              placeholder="np. SN123456"
              maxLength={100}
              className="w-full p-1 px-2 rounded mb-4 border-2 border-white bg-transparent text-white truncate focus:outline-none focus:border-blue-700 hover:border-blue-700"
            />
          </Tooltip>

          <div className="flex flex-row gap-2">
            <div className="flex flex-col w-full">
              <label className="block mb-1">
                Ilość:
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="quantity"
                value={display(item?.quantity)}
                onChange={(e) => handleNumericChange(e, 8, 0)}
                placeholder="np. 10"
                className="w-full p-1 px-2 rounded border-2 border-white bg-transparent text-white focus:outline-none focus:border-blue-700 hover:border-blue-700"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="block mb-1">
                Cena jednostkowa:
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="unit_price"
                value={display(item?.unit_price)}
                onChange={(e) => handleNumericChange(e, 8, 2)}
                placeholder="np. 199.99"
                className="w-full p-1 px-2 rounded border-2 border-white bg-transparent text-white focus:outline-none focus:border-blue-700 hover:border-blue-700"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-start">
          <div className="relative w-56 h-56 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
            onMouseEnter={() => setImageActions(true)}
            onMouseLeave={() => setImageActions(false)}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            {currentImage ? (
              <>
                <img
                  src={currentImage}
                  alt={item?.item_name || "Zdjęcie"}
                  className={`object-cover w-full h-full transition
                  ${
                    imageActions
                      ? "brightness-40"
                      : ""
                  }
                  `}
                />

                {imageActions && (
                  <div className="absolute inset-0 flex items-center justify-center gap-4">
                    <button
                     type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-yellow-500 hover:bg-yellow-700 p-2 rounded-full"
                    >
                      <MdEdit className="text-2xl text-white" />
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-600 hover:bg-red-800 p-2 rounded-full"
                    >
                      <MdDelete className="text-2xl text-white" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                onClick={() =>fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center text-center text-white cursor-pointer"
              >
                <MdAddPhotoAlternate className="text-5xl mb-1" />
                <p className="text-sm">
                  Dodaj zdjęcie
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-6">
        <div className="flex flex-col w-56 shrink-0">
          <CustomSelectForm
            label="Lokalizacja"
            placeholder="Wybierz lokalizacje"
            options={dropdowns?.locations || []}
            value={item?.location_id}
            onChange={(val) =>
              setItem((prev) => ({
                ...prev,
                location_id: val,
              }))
            }
            className="mb-3"
          />

          <CustomSelectForm
            label="Dział"
            placeholder="Wybierz dział"
            options={dropdowns?.services || []}
            value={item?.service_id}
            onChange={(val) =>
              setItem((prev) => ({
                ...prev,
                service_id: val,
              }))
            }
            className="mb-3"
          />

          <CustomSelectForm
            label="Stan"
            placeholder="Wybierz stan"
            options={dropdowns?.conditions || []}
            value={item?.condition_id}
            onChange={(val) =>
              setItem((prev) => ({
                ...prev,
                condition_id: val,
              }))
            }
            className="mb-3"
          />

          <label className="block mb-1">
            Status:
          </label>
          <div className=" w-full p-1 px-2 rounded border-2 border-white/40 bg-white/10 text-gray-300 cursor-not-allowed truncate">
          {
            dropdowns?.statuses?.find((s) => s.id === item?.status_id)?.name || "Brak..."
          }
          </div>
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          <label className="block mb-1">
            Uwagi:
          </label>
          <textarea
            name="notes"
            value={display(item?.notes)}
            onChange={handleChange}
            placeholder="np. Lekko zarysowana obudowa..."
            maxLength={2000}
            className="w-full h-full p-2 border-2 border-white rounded bg-transparent text-white resize-none custom-scrollbar focus:outline-none focus:border-blue-700 hover:border-blue-700"
          />
        </div>
      </div>

      <div className="flex flex-row justify-center items-center mt-2 gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isModified || saving}
          className={`h-8 px-4 rounded-lg font-medium text-white transition-all
          ${
            isModified
              ? "bg-[#9c723d] hover:bg-[#6d4d25] cursor-pointer"
              : "bg-gray-500 opacity-60 cursor-not-allowed"
          }
          `}
        >
          {saving ? "Zapisywanie..." : "Zapisz zmiany"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!isModified || saving}
          className={`h-8 px-4 rounded-lg font-medium text-white transition-all
          ${
            isModified
              ? "bg-[#CC8111] hover:bg-[#9c6410] cursor-pointer"
              : "bg-gray-500 opacity-60 cursor-not-allowed"
          }
          `}
        >
          Przywróć zmiany
        </button>
      </div>
    </div>
  );
}