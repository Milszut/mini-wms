import Tooltip from "./Tooltip";

export default function PreviewTab({item, setPreviewOpen, mobile = false,}) {
  const display = (v) => {
    if (v === null || v === undefined || v === "" || v === "null") {
      return "Brak...";
    }
    return v.toString().trim();
  };
  const color = (v) => {
    if (v === null || v === undefined || v === "" || v === "null") {
      return "text-gray-500 font-medium";
    }
    return "text-white";
  };

  if (mobile) {
    return (
      <>
        <label className="mb-1">
          Nazwa przedmiotu:
        </label>

        <div className={`p-1 mb-2 rounded border-2 border-white bg-transparent truncate select-none ${color(item.item_name)}`}>
          {display(item.item_name)}
        </div>

        <label className="mb-1">
          Numer seryjny:
        </label>

        <div className={`p-1 mb-2 rounded border-2 border-white bg-transparent truncate select-none ${color(item.serial_number)}`}>
          {display(item.serial_number)}
        </div>

        <label className="mb-1">
          Ilość:
        </label>

        <div className={`p-1 mb-2 rounded border-2 border-white bg-transparent truncate select-none ${color(item.quantity)}`}>
          {display(item.quantity)}
        </div>

        <label className="mb-1">
          Cena jednostkowa:
        </label>

        <div className={`p-1 mb-2 rounded border-2 border-white bg-transparent truncate select-none ${color(item.unit_price)}`}>
          {item.unit_price ? item.unit_price + " zł" : "Brak..."}
        </div>

        <label className="mb-1">
          Lokalizacja:
        </label>

        <div className={`mb-2 p-1 rounded px-2 border-2 border-white bg-transparent truncate select-none ${color(item.location)}`}>
          {display(item.location)}
        </div>

        <label className="mb-1">
          Dział:
        </label>

        <div className={`mb-2 p-1 rounded px-2 border-2 border-white bg-transparent truncate select-none ${color(item.service)}`}>
          {display(item.service)}
        </div>

        <label className="mb-1">
          Stan:
        </label>

        <div className={`mb-2 p-1 rounded px-2 border-2 border-white bg-transparent truncate select-none ${color(item.condition_name)}`}>
          {display(item.condition_name)}
        </div>

        <label className="mb-1">
          Status:
        </label>

        <div className={`mb-2 p-1 rounded px-2 border-2 border-white bg-transparent truncate select-none ${color(item.status)}`}>
          {display(item.status)}
        </div>

        <label className="mb-1">
          Uwagi:
        </label>

        <div
          className={`p-2 h-40 rounded border-2 border-white rounded bg-transparent select-none ${color(item.notes)}`}
          style={{
            whiteSpace: "pre-wrap",
            overflowY: "auto",
            overflowX: "hidden",
            wordBreak: "break-word"
          }}
        >
          {display(item.notes)}
        </div>

        <div className="w-full h-40 bg-white/20 rounded-lg flex items-center justify-center mt-3 overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.item_name || "Zdjęcie przedmiotu"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setPreviewOpen(true)}
            />
          ) : (
            <div className="font-medium text-white">
              Brak zdjęcia
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
    <div className="flex flex-col gap-2 text-white h-full">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full min-w-0">
              <label className="block mb-1">
                Nazwa przedmiotu:
              </label>
              <Tooltip>
                <div data-tooltip-content className={`w-full p-1 px-2 rounded mb-4 border-2 border-white bg-transparent truncate select-none ${color(item.item_name)}`}>
                  {display(item.item_name)}
                </div>
              </Tooltip>
              <label className="block mb-1">
                Numer seryjny:
              </label>
              <Tooltip>
                <div data-tooltip-content className={`w-full p-1 px-2 rounded mb-4 border-2 border-white bg-transparent truncate select-none ${color(item.serial_number)}`}>
                  {display(item.serial_number)}
                </div>
              </Tooltip>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col w-full min-w-0">
                  <label className="block mb-1">
                    Ilość:
                  </label>
                  <div className={`w-full p-1 px-2 rounded border-2 border-white bg-transparent truncate select-none ${color(item.quantity)}`}>
                    {display(item.quantity)}
                  </div>
                </div>
                <div className="flex flex-col w-full min-w-0">
                  <label className="block mb-1">
                    Cena jednostkowa:
                  </label>
                  <div className={`w-full p-1 px-2 rounded border-2 border-white bg-transparent truncate select-none ${color(item.unit_price)}`}>
                    {item.unit_price ? item.unit_price + " zł" : "Brak..."}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-start">
              <div className="relative w-56 h-56 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.item_name || "Zdjęcie przedmiotu"}
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => setPreviewOpen(true)}
                  />
                ) : (
                  <div className="font-medium text-white">
                    Brak zdjęcia
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col w-56 shrink-0">
              <label className="block mb-1">
                Lokalizacja:
              </label>
              <div className={`mb-3 p-1 px-2 border-2 border-white rounded bg-transparent truncate select-none ${color(item.location)}`}>
                {display(item.location)}
              </div>
              <label className="block mb-1">
                Dział:
              </label>
              <div className={`mb-3 p-1 px-2 border-2 border-white rounded bg-transparent truncate select-none ${color(item.service)}`}>
                {display(item.service)}
              </div>
              <label className="block mb-1">
                Stan:
              </label>
              <div className={`mb-3 p-1 px-2 border-2 border-white rounded bg-transparent truncate select-none ${color(item.condition_name)}`}>
                {display(item.condition_name)}
              </div>
              <label className="block mb-1">
                Status:
              </label>
              <div className={`p-1 px-2 border-2 border-white rounded bg-transparent truncate select-none ${color(item.status)}`}>
                {display(item.status)}
              </div>
            </div>
            <div className="flex flex-col flex-grow min-w-0">
              <label className="block mb-1">
                Uwagi:
              </label>
              <div
                className={`w-full h-66 p-2 border-2 custom-scrollbar border-white rounded bg-transparent select-none ${color(item.notes)}`}
                style={{
                  whiteSpace: "pre-wrap",
                  overflowY: "auto",
                  overflowX: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {display(item.notes)}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center mt-2 gap-4 opacity-0 pointer-events-none">
            <button
              type="button"
              className="h-8 px-4 rounded-lg font-medium text-white bg-[#9c723d]"
            >
              Zapisz zmiany
            </button>
            <button
              type="button"
              className="h-8 px-4 rounded-lg font-medium text-white bg-[#CC8111]"
            >
              Przywróć zmiany
            </button>
          </div>
    </div>
    </>
  );
}