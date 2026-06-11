import { useEffect, useState } from "react";
import Header from "../components/Header";
import LocationServiceItem from "../components/LocationServiceItem";
import PageTemplate from "../components/PageTemplate";
import { PopUpAdd } from "../components/PopUpAdd";
import { PopUpEdit } from "../components/PopUpEdit";
import { PopUpDelete } from "../components/PopUpDelete";
import { PopUpMessage } from "../components/PopUpMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import {getServices, addService, updateService, deleteService,} from "../services/service";

export default function Services() {
  const [services, setServices] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setMessage({
        text: "Wystąpił błąd podczas pobierania działów.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddService(name) {
    try {
      await addService({ name });
      await fetchServices();
      setShowAddPopup(false);
      setMessage({
        text: "Dodano nowy dział!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.message,
        type: "error",
      });
    }
  }

  async function handleEditService(name) {
    try {
      await updateService(selectedService.id, { name });
      await fetchServices();
      setShowEditPopup(false);
      setSelectedService(null);
      setMessage({
        text: "Dział zaktualizowany!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.message,
        type: "error",
      });
    }
  }

  async function handleDeleteService() {
    try {
      await deleteService(selectedService.id);
      await fetchServices();
      setShowDeletePopup(false);
      setSelectedService(null);
      setMessage({
        text: "Dział został usunięty!",
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
      <Header title="Działy" />
      <div className="flex flex-col font-rubik h-full w-full items-center justify-end mdl:justify-center overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="flex flex-col w-full md:w-3/4 xl:w-1/3 lg:w-1/2 h-[97%] md:h-4/5 bg-[#203047] rounded-t-md text-white">
          <div className="flex flex-row h-18 w-full items-center justify-center rounded-t-lg p-3 border-b-1 border-neutral-400">
            <p className="text-white text-xl text-nowrap">
              Nazwa Działu
            </p>
            <div className="w-full"></div>
            <button
              onClick={() => setShowAddPopup(true)}
              className="text-white font-medium text-nowrap h-10 p-2 rounded-lg bg-blue-700 hover:bg-blue-950 cursor-pointer"
            >
              Dodaj Dział
            </button>
          </div>
          <div className="flex flex-col w-full h-full overflow-auto custom-scrollbar">
            {services.map((service) => (
              <LocationServiceItem
                key={service.id}
                name={service.name}
                onEdit={() => {
                  setSelectedService(service);
                  setShowEditPopup(true);
                }}
                onDelete={() => {
                  setSelectedService(service);
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
          title="Dodaj dział"
          placeholder="Podaj nazwę działu"
          submitText="Dodaj"
          onSubmit={handleAddService}
          onClose={() => setShowAddPopup(false)}
        />
      )}
      {showEditPopup && selectedService && (
        <PopUpEdit
          title="Edytuj nazwę działu"
          initialValue={selectedService.name}
          submitText="Zapisz"
          onSubmit={handleEditService}
          onClose={() => {
            setShowEditPopup(false);
            setSelectedService(null);
          }}
        />
      )}
      {showDeletePopup && selectedService && (
        <PopUpDelete
          name={selectedService.name}
          onConfirm={handleDeleteService}
          onClose={() => {
            setShowDeletePopup(false);
            setSelectedService(null);
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