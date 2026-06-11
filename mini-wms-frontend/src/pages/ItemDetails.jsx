import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PageTemplate from "../components/PageTemplate";
import { ImagePreview } from "../components/ImagePreview";
import { PopUpMessage } from "../components/PopUpMessage";
import PreviewTab from "../components/PreviewTab";
import EditTab from "../components/EditTab";
import DisposeTab from "../components/DisposeTab";
import { getItemById } from "../services/items";
import { getLocations } from "../services/location";
import { getServices } from "../services/service";
import { getStatuses } from "../services/status";
import { getConditions } from "../services/condition";
import { IoMdArrowRoundBack } from "react-icons/io";
import { VscArrowSmallLeft } from "react-icons/vsc";
import { VscArrowSmallRight } from "react-icons/vsc";
import { IoMdArrowRoundForward } from "react-icons/io";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const listState = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("listState"));
    } catch {
      return null;
    }
  })();

  const itemIds = listState?.itemIds || [];
  const currentIndex = itemIds.findIndex((x) => String(x) === String(id));

  const previousId = currentIndex > 0
      ? itemIds[currentIndex - 1]
      : null;

  const nextId = currentIndex >= 0 && currentIndex < itemIds.length - 1
      ? itemIds[currentIndex + 1]
      : null;

  const [dropdowns, setDropdowns] = useState({locations: [], services: [], statuses: [], conditions: [],});

  useEffect(() => {
    let mounted = true;
    async function loadItem() {
      try {
        setLoading(true);
        const data = await getItemById(id);
        if (!mounted) return;
        setItem(data);
        setEditItem(data);
      } catch (err) {
        console.error("Błąd pobierania:", err);
      } finally {
        if (mounted) {
        setLoading(false);
        }
      }
    }
    loadItem();
    return () => { mounted = false;};
  }, [id]);

  useEffect(() => {
    let mounted = true;
    async function loadDropdowns() {
      try {
        const [locations, services, statuses, conditions,] = await Promise.all([
          getLocations(),
          getServices(),
          getStatuses(),
          getConditions(),
        ]);

        if (!mounted) return;
        setDropdowns({locations, services, statuses, conditions,});
      } catch (err) {
        console.error("Błąd dropdownów:", err);
      }
    }
    loadDropdowns();
    return () => {mounted = false;};
  }, []);

  if (loading || !item || !editItem) {
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
      <Header title={item.item_name} />
      <div className="flex flex-col w-full h-full items-center overflow-y-auto scrollbar-none">
        <div className="hidden sm:flex flex-col w-full items-center my-auto">
          <div className="flex flex-col w-full lg:w-4/5 2xl:w-2/4">
            <div className="flex flex-row gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/list")}
                className="flex-1 py-2 sm:py-3 rounded-t-xl transition-all duration-200 cursor-pointer font-medium text-sm sm:text-lg bg-blue-700 hover:text-white text-gray-200 hover:bg-[#203047]"
              >
                <div className="flex items-center justify-center gap-2">
                  <IoMdArrowRoundBack className="text-xl" />
                  Lista
                </div>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-2 sm:py-3 rounded-t-xl transition-all duration-200 cursor-pointer font-medium text-sm sm:text-lg
                ${
                  activeTab === "preview"
                    ? "bg-[#203047] text-white shadow-lg"
                    : "bg-blue-700 text-gray-200 hover:bg-[#203047]"
                }
                `}
              >
                Podgląd
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-2 sm:py-3 rounded-t-xl transition-all duration-200 cursor-pointer font-medium text-sm sm:text-lg
                ${
                  activeTab === "edit"
                    ? "bg-[#203047] text-white shadow-lg"
                    : "bg-blue-700 text-gray-200 hover:bg-[#203047]"
                }
                `}
              >
                Edytuj
              </button>
              <button
                onClick={() => setActiveTab("dispose")}
                className={`flex-1 py-2 sm:py-3 rounded-t-xl transition-all duration-200 cursor-pointer font-medium text-sm sm:text-lg
                ${
                  activeTab === "dispose"
                    ? "bg-[#203047] text-white shadow-lg"
                    : "bg-blue-700 text-gray-200 hover:bg-[#203047]"
                }
                `}
              >
                Likwidacja
              </button>
            </div>
            <div className="flex flex-col justify-center bg-[#203047] rounded-b-lg p-6 gap-2 text-white">
              {activeTab === "preview" && (
                <PreviewTab
                  item={item}
                  setPreviewOpen={setPreviewOpen}
                />
              )}
              {activeTab === "edit" && (
                <EditTab
                  item={editItem}
                  setItem={setEditItem}
                  saveItem={setItem}
                  dropdowns={dropdowns}
                  setMessage={setMessage}
                />
              )}
              {activeTab === "dispose" && (
                <DisposeTab
                  item={item}
                  dropdowns={dropdowns}
                  saveItem={setItem}
                  setMessage={setMessage}
                />
              )}
            </div>
            <div className="flex justify-between mt-3">
              <button
                disabled={!previousId}
                onClick={() => previousId && navigate(`/itemdetails/${previousId}`)}
                className={`flex flex-row items-center justify-center px-4 py-2 rounded-lg text-white ${
                  previousId
                    ? "bg-blue-700 hover:bg-[#203047] cursor-pointer"
                    : "bg-[#203047] opacity-35 cursor-not-allowed"
                }`}
              >
                <VscArrowSmallLeft className="text-2xl"/> Poprzedni przedmiot
              </button>
              <button
                disabled={!nextId}
                onClick={() => nextId && navigate(`/itemdetails/${nextId}`)}
                className={`flex flex-row items-center justify-center px-4 py-2 rounded-lg text-white ${
                  nextId
                    ? "bg-blue-700 hover:bg-[#203047] cursor-pointer"
                    : "bg-[#203047] opacity-35 cursor-not-allowed"
                }`}
              >
                Następny przedmiot
                <VscArrowSmallRight className="text-2xl"/>
              </button>
            </div>
          </div>
        </div>
        <div className=" sm:hidden flex flex-col w-full">
          <div className="flex flex-row gap-1 mb-1">
            <button
              onClick={() => navigate("/list")}
              className="flex-1 flex flex-row items-center justify-center py-2 rounded-br-xl bg-blue-700 hover:bg-[#203047] text-white"
            >
              <IoMdArrowRoundBack className="text-lg" />
              Lista
            </button>
            <button
              disabled={!previousId}
              onClick={() => previousId && navigate(`/itemdetails/${previousId}`)}
              className={`flex-1 flex flex-row items-center justify-center py-2 rounded-b-xl text-white ${
                previousId
                    ? "bg-blue-700 hover:bg-[#203047] cursor-pointer"
                    : "bg-[#203047] opacity-35 cursor-not-allowed"
              }`}
            >
              <IoMdArrowRoundBack className="text-lg" />
              Poprzedni
            </button>
            <button
              disabled={!nextId}
              onClick={() => nextId && navigate(`/itemdetails/${nextId}`)}
              className={`flex-1 flex flex-row items-center justify-center py-2 rounded-bl-xl text-white ${
                nextId
                    ? "bg-blue-700 hover:bg-[#203047] cursor-pointer"
                    : "bg-[#203047] opacity-35 cursor-not-allowed"
              }`}
            >
              Następny
              <IoMdArrowRoundForward className="text-lg"/>
            </button>
          </div>
          <div className="flex flex-row gap-1">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-2 rounded-tr-xl transition-all duration-200 font-medium text-sm
              ${
                activeTab === "preview"
                    ? "bg-[#203047] text-white shadow-lg"
                    : "bg-blue-700 text-gray-200 hover:bg-[#203047]"
              }
              `}
            >
              Podgląd
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 py-2 rounded-t-xl transition-all duration-200 font-medium text-sm
              ${
                activeTab === "edit"
                    ? "bg-[#203047] text-white shadow-lg"
                    : "bg-blue-700 text-gray-200 hover:bg-[#203047]"
              }
              `}
            >
              Edytuj
            </button>
            <button onClick={() => setActiveTab("dispose")}
              className={`flex-1 py-2 rounded-tl-xl transition-all duration-200 font-medium text-sm
              ${
                activeTab === "dispose"
                    ? "bg-[#203047] text-white shadow-lg"
                    : "bg-blue-700 text-gray-200 hover:bg-[#203047]"
              }
              `}
            >
              Likwidacja
            </button>
          </div>
          <div className="w-full flex flex-col bg-[#203047] p-3 text-white">
            {activeTab === "preview" && (
              <PreviewTab
                item={item}
                setPreviewOpen={setPreviewOpen}
                mobile
              />
            )}
            {activeTab === "edit" && (
              <EditTab
                item={editItem}
                setItem={setEditItem}
                saveItem={setItem}
                dropdowns={dropdowns}
                setMessage={setMessage}
                mobile
              />
            )}
            {activeTab === "dispose" && (
              <DisposeTab
                item={item}
                dropdowns={dropdowns}
                saveItem={setItem}
                setMessage={setMessage}
                mobile
              />
            )}
          </div>
        </div>
      </div>
      {previewOpen && (
        <ImagePreview
          src={item.image_url}
          alt="Zdjęcie"
          onClose={() => setPreviewOpen(false)}
        />
      )}
      {message && (
        <PopUpMessage
          message={message.text}
          type={message.type}
          onClose={() => {
            const redirectTo = message.redirectTo;
            setMessage(null);
            if (redirectTo) {navigate(redirectTo);}
          }}
        />
      )}
    </PageTemplate>
  );
}