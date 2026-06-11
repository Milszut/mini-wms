import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
import PageTemplate from "../components/PageTemplate";
import { MdAddPhotoAlternate, MdDelete, MdEdit } from "react-icons/md";
import CustomSelectForm from "../components/CustomSelectForm";
import { getLocations } from "../services/location";
import { getServices } from "../services/service";
import { getStatuses } from "../services/status";
import { getConditions } from "../services/condition";
import { addItem } from "../services/items";
import Tooltip from "../components/Tooltip";
import AutoResizeTextarea from "../components/AutoResizeTextarea";
import { PopUpMessage } from "../components/PopUpMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Add() {
  const [imagePreview, setImagePreview] = useState(null);
  const [hoverImage, setHoverImage] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [dropdowns, setDropdowns] = useState({
    locations: [],
    services: [],
    statuses: [],
    conditions: [],
  });

  const initialFormData = {
    item_name: "",
    serial_number: "",
    quantity: "",
    unit_price: "",
    location_id: null,
    service_id: null,
    condition_id: null,
    status_id: null,
    notes: "",
    image_path: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const validateForm = () => {
    const errors = [];

    if (!formData.item_name.trim()) {
      errors.push("Podaj nazwę przedmiotu!");
    } else if (formData.item_name.length > 100) {
      errors.push("Nazwa przedmiotu zbyt długa!");
    }

    if (formData.serial_number && formData.serial_number.length > 100) {
      errors.push("Numer seryjny zbyt długi!");
    }

    if (!formData.quantity) {
      errors.push("Podaj ilość!");
    } else if (!/^\d+$/.test(formData.quantity)) {
      errors.push("Ilość musi być liczbą całkowitą!");
    } else if (formData.quantity.length > 8) {
      errors.push("Ilość nie może mieć więcej niż 8 cyfr!");
    }

    if (!formData.unit_price) {
      errors.push("Podaj cenę!");
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.unit_price)) {
      errors.push("Cena jednostkowa musi być liczbą maksymalnie do 2 miejsc po przecinku!");
    }

    if (!formData.location_id) errors.push("Wybierz lokalizacje!");
    if (!formData.service_id) errors.push("Wybierz dział!");
    if (!formData.condition_id) errors.push("Wybierz stan!");
    if (!formData.status_id) errors.push("Wybierz status!");

    if (formData.notes && formData.notes.length > 2000) {
      errors.push("Uwagi nie mogą przekraczać 2000 znaków!");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({ text: errors.join("\n"), type: "error" });
      return;
    }

    try {
      await addItem(formData);
      setMessage({ text: "Przedmiot dodany pomyślnie!", type: "success" });
      setFormData(initialFormData);
      setImagePreview(null);
      setHoverImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setMessage({ text: "Wystąpił błąd podczas dodawania przedmiotu."});
    }
  };

  useEffect(() => {
    async function loadDropdowns() {
      try {
        setLoading(true);
        const [locations, services, statuses, conditions] = await Promise.all([
          getLocations(),
          getServices(),
          getStatuses(),
          getConditions(),
        ]);

        setDropdowns({
          locations,
          services,
          statuses,
          conditions,
        });
      } catch (err) {
        console.error("❌ Błąd przy ładowaniu dropdownów:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        text: "Niepoprawny format pliku!",
        type: "error",
      });
      e.target.value = "";
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setMessage({
        text: `Plik jest za duży! Maksymalny rozmiar to ${maxSizeMB}MB.`,
        type: "error",
      });
      e.target.value = "";
      return;
    }

    setFormData({ ...formData, image_path: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setHoverImage(false);
    setFormData({ ...formData, image_path: null });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeNumeric = (e, maxDigits = 8, maxDecimals = 2) => {
    const { name, value } = e.target;
    const regex = new RegExp(`^\\d{0,${maxDigits}}(\\.\\d{0,${maxDecimals}})?$`);

    if (value === "" || regex.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageClick = () => {
    if (imagePreview) {
      setHoverImage(prev => !prev);
    }
  };

  if (loading) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <Header title="Dodaj Towar" />

      <div className="hidden sm:flex flex-col h-full w-full items-center justify-start overflow-y-auto overflow-x-hidden scrollbar-none">
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col w-full items-center my-auto">
          <div className="flex flex-col justify-center w-full lg:w-4/5 2xl:w-2/4 bg-[#203047] rounded-lg p-6 gap-2 text-white">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col w-full">
                    <label className="block mb-1">Nazwa przedmiotu:</label>
                    <Tooltip>
                      <input
                        data-tooltip-content
                        type="text"
                        name="item_name"
                        value={formData.item_name}
                        onChange={handleChange}
                        placeholder="np. Mikrofon"
                        maxLength={100}
                        className="w-full p-1 px-2 min-w-40 text-white placeholder-zinc-400 rounded mb-4 border-2 border-white focus:outline-none focus:border-blue-700 hover:border-blue-700 truncate"
                      />
                    </Tooltip>

                    <label className="block mb-1">Numer seryjny:</label>
                    <Tooltip>
                      <input
                        data-tooltip-content
                        type="text"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleChange}
                        placeholder="np. SN123456"
                        maxLength={100}
                        className="w-full p-1 px-2 mb-4 min-w-40 text-white placeholder-zinc-400 rounded border-2 border-white focus:outline-none focus:border-blue-700 hover:border-blue-700 truncate"
                      />
                    </Tooltip>

                    <div className="flex flex-row gap-2">
                      <div className="flex flex-col w-full">
                        <label className="block mb-1">Ilość:</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          name="quantity"
                          value={formData.quantity}
                          onChange={(e) => handleChangeNumeric(e, 8, 0)}
                          placeholder="np. 10"
                          className="w-full p-1 px-2 min-w-40 text-white placeholder-zinc-400 rounded border-2 border-white mb-2 focus:outline-none focus:border-blue-700 hover:border-blue-700" 
                        />
                      </div>

                      <div className="flex flex-col w-full">
                        <label className="block mb-1">Cena jednostkowa:</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          name="unit_price"
                          value={formData.unit_price}
                          onChange={(e) => handleChangeNumeric(e, 8, 2)}
                          placeholder="np. 199.99"
                          className="w-full p-1 px-2 min-w-40 text-white placeholder-zinc-400 rounded border-2 border-white mb-3 focus:outline-none focus:border-blue-700 hover:border-blue-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <div
                      className="relative w-56 h-56 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden group"
                      onMouseEnter={() => setHoverImage(true)}
                      onMouseLeave={() => setHoverImage(false)}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                      />

                      {!imagePreview ? (
                        <div
                          onClick={() => fileInputRef.current.click()}
                          className="flex flex-col items-center justify-center text-center text-white w-full h-full"
                        >
                          <MdAddPhotoAlternate className="text-5xl mb-1" />
                          <p className="text-sm">Dodaj zdjęcie</p>
                        </div>
                      ) : (
                        <>
                          <img
                            src={imagePreview}
                            alt="Podgląd"
                            className={`object-cover w-full h-full transition ${
                              hoverImage ? "brightness-40" : ""
                            }`}
                          />
                          {hoverImage && (
                            <div className="absolute inset-0 flex items-center justify-center cursor-default gap-4 text-white">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="bg-yellow-500 hover:bg-yellow-700 p-2 rounded-full hover:cursor-pointer"
                              >
                                <MdEdit className="text-2xl" />
                              </button>
                              <button
                                type="button"
                                onClick={removeImage}
                                className="bg-red-600 hover:bg-red-800 p-2 rounded-full hover:cursor-pointer"
                              >
                                <MdDelete className="text-2xl" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-6">
                  <div className="flex flex-col w-56 shrink-0">
                     <CustomSelectForm
                        label="Lokalizacja"
                        placeholder="Wybierz lokalizacje"
                        options={dropdowns.locations}
                        value={formData.location_id}
                        onChange={(val) => setFormData({ ...formData, location_id: val })}
                        className="mb-3"
                      />
                      
                      <CustomSelectForm
                        label="Dział"
                        placeholder="Wybierz dział"
                        options={dropdowns.services}
                        value={formData.service_id}
                        onChange={(val) => setFormData({ ...formData, service_id: val })}
                        className="mb-3"
                      />

                      <CustomSelectForm
                        label="Stan"
                        placeholder="Wybierz stan"
                        options={dropdowns.conditions}
                        value={formData.condition_id}
                        onChange={(val) => setFormData({ ...formData, condition_id: val })}
                        className="mb-3"
                      />

                      <CustomSelectForm
                        label="Status"
                        placeholder="Wybierz status"
                        options={dropdowns.statuses}
                        value={formData.status_id}
                        onChange={(val) => setFormData({ ...formData, status_id: val })}
                      />
                  </div>

                  <div className="flex flex-col flex-grow">
                    <label className="block mb-1">Uwagi:</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="np. Lekko zarysowana obudowa..."
                      maxLength={2000}
                      className="w-full h-full min-w-40 p-2 border-2 border-white placeholder-zinc-400 rounded-md text-white resize-none focus:outline-none focus:border-blue-700 hover:border-blue-700 custom-scrollbar"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-center items-center mt-2 gap-4">
                  <button
                    type="submit"
                    className="h-8 px-4 rounded-lg font-medium text-white bg-[#9c723d] hover:bg-[#6d4d25] hover:cursor-pointer"
                  >
                    Dodaj nowy przedmiot
                  </button>
                   <button
                    type="button"
                    onClick={() => {
                      setFormData(initialFormData);
                      setImagePreview(null);
                      setHoverImage(false);
                      setMessage(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="h-8 px-4 rounded-lg font-medium text-white bg-[#CC8111] hover:bg-[#9c6410] hover:cursor-pointer"
                  >
                    Wyczyść formularz
                  </button>
                </div>
          </div>
        </form>
      </div>
      <div className="sm:hidden flex flex-col h-full w-full items-center justify-start overflow-y-auto overflow-x-hidden scrollbar-none">
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full flex flex-col sm:hidden">
          <div className="flex flex-col justify-center w-full bg-[#203047] p-2 text-white pb-3">
            <label className="text-sm mb-1">Nazwa przedmiotu:</label>
               <AutoResizeTextarea
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="np. Mikrofon"
                maxLength={100}
                minRows={1}
              />

            <label className="text-sm mb-1">Numer seryjny:</label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                placeholder="np. SN123456"
                maxLength={100}
                className="w-full p-1 mb-2 text-white placeholder-zinc-400 placeholder:text-sm rounded border-2 border-white focus:outline-none focus:border-blue-700 bg-transparent"
              />

            <div className="flex flex-row gap-1 w-full mb-2">
              <div className="flex flex-col w-full">
                <label className="text-sm mb-1">Ilość:</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) => handleChangeNumeric(e, 8, 0)}
                  placeholder="np. 10"
                  className="w-full p-1 text-white placeholder-zinc-400 placeholder:text-sm rounded border-2 border-white focus:outline-none focus:border-blue-700 hover:border-blue-700 bg-transparent"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm mb-1">Cena jednostkowa:</label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={(e) => handleChangeNumeric(e, 8, 2)}
                  placeholder="np. 199.99"
                  className="w-full p-1 text-white placeholder-zinc-400 placeholder:text-sm rounded border-2 border-white focus:outline-none focus:border-blue-700 hover:border-blue-700 bg-transparent"
                />
              </div>
            </div>

            <CustomSelectForm
              label="Lokalizacja"
              placeholder="Wybierz lokalizacje"
              options={dropdowns.locations}
              value={formData.location_id}
              onChange={(val) => setFormData({ ...formData, location_id: val })}
              className="w-full text-sm"
            />
            <CustomSelectForm
              label="Dział"
              placeholder="Wybierz dział"
              options={dropdowns.services}
              value={formData.service_id}
              onChange={(val) => setFormData({ ...formData, service_id: val })}
              className="w-full text-sm"
            />
            <CustomSelectForm
              label="Stan"
              placeholder="Wybierz stan"
              options={dropdowns.conditions}
              value={formData.condition_id}
              onChange={(val) => setFormData({ ...formData, condition_id: val })}
              className="w-full text-sm"
            />
            <CustomSelectForm
              label="Status"
              placeholder="Wybierz status"
              options={dropdowns.statuses}
              value={formData.status_id}
              onChange={(val) => setFormData({ ...formData, status_id: val })}
              className="w-full text-sm"
            />
            
            <label className="text-sm mb-1">Uwagi:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="np. Lekko zarysowana obudowa..."
              maxLength={2000}
              className="w-full h-16 p-2 mb-2 border-2 border-white placeholder-zinc-400 rounded-md text-white resize-none focus:outline-none bg-transparent"
            />
  
            <div className="flex justify-center items-center mb-2">
              <div
                className="relative w-full h-16 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden group"
                onClick={handleImageClick}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="flex flex-col items-center justify-center text-center text-white w-full h-full"
                  >
                    <MdAddPhotoAlternate className="text-3xl mb-1" />
                    <p className="text-sm">Dodaj zdjęcie</p>
                  </div>
                ) : (
                  <>
                    <img src={imagePreview} alt="Podgląd" className={`object-cover w-full h-full transition ${hoverImage ? "brightness-50" : ""}`}/>
                      {hoverImage && (
                        <div className="absolute inset-0 flex items-center justify-center cursor-default gap-4 text-white">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="bg-yellow-500 hover:bg-yellow-700 p-3 rounded-full hover:cursor-pointer"
                          >
                            <MdEdit className="text-3xl" />
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-600 hover:bg-red-800 p-3 rounded-full hover:cursor-pointer"
                          >
                            <MdDelete className="text-3xl" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-between">
              <button
                type="submit"
                className="flex-1 h-8 rounded-lg font-medium text-white bg-[#9c723d] hover:bg-[#6d4d25]"
              >
                Dodaj przedmiot
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                  setImagePreview(null);
                  setMessage(null);
                  setHoverImage(false);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="flex-1 h-8 rounded-lg font-medium text-white bg-[#CC8111] hover:bg-[#9c6410]"
              >
                Wyczyść
              </button>
            </div>
          </div>
        </form>
      </div>
      {message && (
        <PopUpMessage
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        /> 
      )}
    </PageTemplate>
  );
}