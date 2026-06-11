import { useEffect, useState } from "react";
import Header from "../components/Header";
import LocationServiceItem from "../components/LocationServiceItem";
import PageTemplate from "../components/PageTemplate";
import { PopUpAdd } from "../components/PopUpAdd";
import { PopUpEdit } from "../components/PopUpEdit";
import { PopUpDelete } from "../components/PopUpDelete";
import { PopUpMessage } from "../components/PopUpMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { getLocations, addLocation, updateLocation, deleteLocation, } from "../services/location";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      console.error("Błąd pobierania lokalizacji:", err);
      setMessage({
        text: "Wystąpił błąd podczas pobierania lokalizacji.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLocation(name) {
    try {
      await addLocation({ name });
      await fetchLocations();
      setShowAddPopup(false);
      setMessage({
        text: "Dodano nową lokalizajce!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.message,
        type: "error",
      });
    }
  }

  async function handleEditLocation(name) {
    try {
      await updateLocation(selectedLocation.id, { name });
      await fetchLocations();
      setShowEditPopup(false);
      setSelectedLocation(null);
      setMessage({
        text: "Lokalizacja zaktualizowana!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.message,
        type: "error",
      });
    }
  }

  async function handleDeleteLocation() {
    try {
      await deleteLocation(selectedLocation.id);
      await fetchLocations();
      setShowDeletePopup(false);
      setSelectedLocation(null);
      setMessage({
        text: "Lokalizacja została usunięta!",
        type: "success",
      });
    } catch (err) {
      setShowDeletePopup(false);
      const isUsedError = err.message.includes("posiada przypisane przedmioty");
      setMessage({
        text: err.message,
        type: isUsedError ? "info" : "error",
      });
    }
  }

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
      <Header title="Lokalizacje" />
      <div className="flex flex-col font-rubik h-full w-full items-center justify-end mdl:justify-center overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="flex flex-col w-full md:w-3/4 xl:w-1/3 lg:w-1/2 h-[97%] md:h-4/5 rounded-t-md text-white bg-[#203047]">
          <div className="flex flex-row h-18 w-full items-center justify-center rounded-t-lg p-3 border-b-1 border-neutral-400">
            <p className="text-white text-xl text-nowrap">
              Nazwa Lokalizacji
            </p>
            <div className="w-full"></div>
            <button
              onClick={() => setShowAddPopup(true)}
              className="text-white font-medium text-nowrap h-10 p-2 rounded-lg bg-blue-700 hover:bg-blue-950 cursor-pointer"
            >
              Dodaj Lokalizacje
            </button>
          </div>
          <div className="flex flex-col w-full h-full overflow-auto custom-scrollbar">
            {locations.map((location) => (
                <LocationServiceItem
                  key={location.id}
                  name={location.name}
                  onEdit={() => {
                    setSelectedLocation(location);
                    setShowEditPopup(true);
                  }}
                  onDelete={() => {
                    setSelectedLocation(location);
                    setShowDeletePopup(true);
                  }}
                />
              ))
            }
          </div>
        </div>
      </div>
      {showAddPopup && (
        <PopUpAdd
          title="Dodaj lokalizację"
          placeholder="Podaj nazwę lokalizacji"
          submitText="Dodaj"
          onSubmit={handleAddLocation}
          onClose={() => setShowAddPopup(false)}
        />
      )}
      {showEditPopup && selectedLocation && (
        <PopUpEdit
          title="Edytuj lokalizację"
          initialValue={selectedLocation.name}
          submitText="Zapisz"
          onSubmit={handleEditLocation}
          onClose={() => {
            setShowEditPopup(false);
            setSelectedLocation(null);
          }}
        />
      )}
      {showDeletePopup && selectedLocation && (
        <PopUpDelete
          name={selectedLocation.name}
          onConfirm={handleDeleteLocation}
          onClose={() => {
            setShowDeletePopup(false);
            setSelectedLocation(null);
          }}
        />
      )}
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