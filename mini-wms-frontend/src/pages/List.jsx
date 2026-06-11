import Header from "../components/Header";
import PageTemplate from "../components/PageTemplate";
import { useEffect, useState } from "react";
import TableTooltip from "../components/TableTooltip";
import { getItems } from "../services/items";
import { getLocations } from "../services/location";
import { getServices } from "../services/service";
import { getStatuses } from "../services/status";
import { getConditions } from "../services/condition";
import ColumnFilterDropdown from "../components/ColumnFilterDropdown";
import SortDropdown from "../components/SortDropdown";
import MobileFilterPanel from "../components/MobileFilterPanel";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function List() {
  const navigate = useNavigate();
  const STORAGE_KEY = "listState";
  const [items, setItems] = useState([]);
  const savedState = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  })();

    const [searchTerm, setSearchTerm] = useState(
    savedState?.searchTerm || ""
  );

  const [filters, setFilters] = useState(
    savedState?.filters || {
      location: [],
      service: [],
      condition: [],
      status: [],
    }
  );

  const [sort, setSort] = useState(
    savedState?.sort || {
      date: "date_desc",
      quantity: "none",
      price: "none",
    }
  );

  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [l, s, st, c] = await Promise.all([
          getLocations(),
          getServices(),
          getStatuses(),
          getConditions(),
        ]);

        setLocations(l || []);
        setServices(s || []);
        setStatuses(st || []);
        setConditions(c || []);

        const naStanie = (st || []).find((o) => o.name === "Na stanie");

        if (!savedState?.filters) {
          setFilters({
            location: (l || []).map((o) => String(o.id)),
            service: (s || []).map((o) => String(o.id)),
            condition: (c || []).map((o) => String(o.id)),
            status: naStanie ? [String(naStanie.id)] : [],
          });
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const computeSortParam = (s) => {
      if (s.quantity && s.quantity !== "none") return s.quantity;
      if (s.price && s.price !== "none") return s.price;
      return s.date || "date_desc";
    };

    const sortParam = computeSortParam(sort);

    const f = {
      search: searchTerm,
      location: filters.location.join(","),
      service: filters.service.join(","),
      condition: filters.condition.join(","),
      status: filters.status.join(","),
      sort: sortParam,
    };

    getItems(f).then(setItems).catch(console.error);
  }, [filters, searchTerm, sort]);

  const hasActiveFilters =
  searchTerm.trim() !== "" ||
  sort.date !== "date_desc" ||
  sort.quantity !== "none" ||
  sort.price !== "none" ||
  filters.location.length !== locations.length ||
  filters.service.length !== services.length ||
  filters.condition.length !== conditions.length;

  const handleResetFilters = () => {
  setSearchTerm("");

  const naStanie = statuses.find(
      (o) => o.name === "Na stanie"
    );
    setFilters({
      location: locations.map((o) => String(o.id)),
      service: services.map((o) => String(o.id)),
      condition: conditions.map((o) => String(o.id)),
      status: naStanie ? [String(naStanie.id)] : [],
    });
    setSort({
      date: "date_desc",
      quantity: "none",
      price: "none",
    });
    sessionStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        searchTerm,
        filters,
        sort,
        itemIds: items.map((i) => i.id),
      })
    );
  }, [searchTerm, filters, sort, items]);

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
      <Header title="Towary"/>

      <div className="flex flex-col w-full h-full items-center justify-start overflow-hidden">
        <div className="flex flex-row px-1 mdl:px-2 py-1 w-full items-center bg-[#18202D]">
          <input
            className="h-8 px-2 w-full mdl:w-1/3 xl:w-1/4 rounded-l-lg mdl:rounded-lg font-medium text-white border-2 border-blue-600  placeholder-gray-500
            focus:outline-none focus:border-white hover:border-white"
            type="text"
            placeholder="Szukaj..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="hidden mdl:block ml-2 h-8 px-3 rounded-lg bg-red-800 hover:bg-orange-950 text-white font-medium whitespace-nowrap"
            >
              Resetuj filtry
            </button>
          )}
          <div className="mdl:hidden rounded-r-lg p-1.5 bg-blue-600 pr-2">
            <FaFilter
              className="text-xl text-white cursor-pointer"
              onClick={() => setMobileFiltersOpen(true)}
              title="Filtry"
            />
          </div>
        </div>

        <div className="flex flex-col bg-[#203047]/15 w-full overflow-y-auto custom-scrollbar">
          <table className="hidden mdl:table w-full table-auto text-base text-left text-white bg-black/25">
            <thead className="bg-[#203047] backdrop-blur-xs sticky top-0 z-10 overflow-visible shadow-lg">
              <tr>
                <th
                  className="px-1 py-2 whitespace-nowrap w-full lg:w-100 text-left overflow-visible"
                >
                  Nazwa sprzętu
                </th>

                <th className="px-1 py-2 w-26 text-center hidden 2xl:table-cell overflow-visible relative">
                  <SortDropdown
                    label="Data"
                    value={sort.date}
                    defaultValue="date_desc"
                    onChange={(v) => setSort((s) => ({ ...s, date: v }))}
                    options={[
                      { value: "date_desc", label: "Od najnowszych" },
                      { value: "date_asc", label: "Od najstarszych" },
                    ]}
                  />
                </th>

                <th className="px-1 py-2 text-center w-full lg:w-72 hidden lg:table-cell">
                  Numer seryjny
                </th>

                <th className="px-1 py-2 text-center w-26 relative overflow-visible">
                  <SortDropdown
                    label="Ilość"
                    value={sort.quantity}
                    defaultValue="none"
                    onChange={(v) => setSort((s) => ({ ...s, quantity: v }))}
                    options={[
                      { value: "none", label: "Brak sortowania" },
                      { value: "quantity_desc", label: "Od największej" },
                      { value: "quantity_asc", label: "Od najmniejszej" },
                    ]}
                  />
                </th>

                <th className="px-1 py-2 w-36 text-center relative overflow-visible">
                  <SortDropdown
                    label="Cena"
                    value={sort.price}
                    defaultValue="none"
                    onChange={(v) => setSort((s) => ({ ...s, price: v }))}
                    options={[
                      { value: "none", label: "Brak sortowania" },
                      { value: "price_desc", label: "Od najdroższych" },
                      { value: "price_asc", label: "Od najtańszych" },
                    ]}
                  />
                </th>

                <th className="px-1 py-2 w-44 text-center relative overflow-visible">
                  <ColumnFilterDropdown
                    label="Lokalizacja"
                    options={locations}
                    selectedValues={filters.location}
                    onChange={(v) => setFilters((f) => ({ ...f, location: v }))}
                  />
                </th>

                <th className="px-1 py-2 w-50 text-center relative overflow-visible">
                  <ColumnFilterDropdown
                    label="Dział"
                    options={services}
                    selectedValues={filters.service}
                    onChange={(v) => setFilters((f) => ({ ...f, service: v }))}
                  />
                </th>

                <th className="px-1 py-2 w-26 hidden xl:table-cell text-center relative overflow-visible">
                  <ColumnFilterDropdown
                    label="Stan"
                    options={conditions}
                    selectedValues={filters.condition}
                    onChange={(v) => setFilters((f) => ({ ...f, condition: v }))}
                    noSelectAll={true}
                  />
                </th>

                <th className="px-1 py-2 w-30 text-center hidden xl:table-cell">Status</th>
                <th className="px-1 py-2 text-left hidden 2xl:table-cell">Uwagi </th>
              </tr>
            </thead>

            <tbody className="hidden mdl:table-row-group">
              {items.map((item) => (
                <tr key={item.id} onClick={() => navigate(`/itemdetails/${item.id}`)} className="hover:bg-black/40 border-b border-white/20">
                  <TableTooltip className="text-left max-w-40 tooltip-left">{item.item_name}</TableTooltip>

                  <td className="px-2 py-2 text-center hidden min-w-26 2xl:table-cell">
                    {new Date(item.entry_date).toLocaleDateString("pl-PL")}
                  </td>

                  <TableTooltip className="text-center max-w-40 hidden lg:table-cell tooltip-center">
                    {item.serial_number}
                  </TableTooltip>

                  <td className="px-2 py-2 min-w-26 text-center">{item.quantity}</td>
                  <td className="px-2 py-2 min-w-36 text-center">{item.unit_price} zł</td>

                  <TableTooltip className="text-center min-w-44 tooltip-center">{item.location}</TableTooltip>
                  <TableTooltip className="text-center min-w-50 tooltip-center">{item.service}</TableTooltip>

                  <td
                    className={`px-2 py-2 text-center min-w-26 hidden xl:table-cell text-white ${
                      item.condition_name === "Nowy" ? "bg-green-600/60" : "bg-orange-500/60"
                    }`}
                  >
                    {item.condition_name}
                  </td>

                  <td className="px-2 py-2 text-center hidden min-w-30 xl:table-cell">{item.status}</td>

                  <TableTooltip className="text-left max-w-40 hidden 2xl:table-cell tooltip-right">
                    {item.notes}
                  </TableTooltip>
                </tr>
              ))}
            </tbody>
          </table>

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/itemdetails/${item.id}`)}
              className="p-3 m-1 bg-black/50 rounded-xl border border-white/10 shadow-sm mdl:hidden"
            >
              <div className="text-xs xs:text-base text-white flex flex-wrap gap-2 items-center">
                <span>{item.service}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-semibold ${
                    item.condition_name === "Nowy" ? "bg-green-600" : "bg-orange-500"
                  }`}
                >
                  {item.condition_name}
                </span>
                <span>{item.location}</span>
              </div>

              <div className="text-xs xs:text-base text-white/70 mt-2 line-clamp-1 break-words">{item.serial_number}</div>
              <div className="text-sm xs:text-base font-semibold line-clamp-1 break-words">{item.item_name}</div>
              <div className="mt-2 text-xs xs:text-base text-white/90">
                Ilość: <b>{item.quantity}</b> • {item.unit_price} zł/szt.
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileFilterPanel
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        locations={locations}
        services={services}
        conditions={conditions}
        onReset={handleResetFilters}
      />
    </PageTemplate>
  );
}