import { useEffect, useState } from "react";
import Header from "../components/Header";
import PageTemplate from "../components/PageTemplate";
import { PopUpMessage } from "../components/PopUpMessage";
import { getDashboardStats } from "../services/stats";
import LoadingSpinner from "../components/LoadingSpinner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,} from "recharts";
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForward } from "react-icons/io5";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [servicePage, setServicePage] = useState(0);
  const SERVICES_PER_PAGE = 8;

  useEffect(() => {
    loadStats();
  }, []);
  
  const pagedServices = stats?.serviceValue?.slice(servicePage * SERVICES_PER_PAGE,(servicePage + 1) * SERVICES_PER_PAGE) || [];
  const maxServicePage = Math.max(0,Math.ceil((stats?.serviceValue?.length || 0) / SERVICES_PER_PAGE) - 1);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Stats load error:", err);

      setMessage({
        text: "Nie udało się pobrać statystyk.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const CHART_COLORS = [
  "#1D4ED8",
  "#2563EB",
  "#3B82F6",
  "#0EA5E9",
  "#0284C7",
];

  const maxServiceValue = Math.max(...(stats?.serviceValue?.map((s) => s.value) || [0]));

  const renderPieLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent,}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
        <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
        >
        {(percent * 100).toFixed(0)}%
        </text>
    );
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
      <Header title="Statystyki" />
      <div className="flex flex-col font-rubik h-full bg-black/20 w-full items-center justify-start overflow-y-auto overflow-x-hidden min-h-0 scrollbar-none">
          <div className="flex flex-col w-full h-full gap-2 overflow-auto scrollbar-none p-0 md:p-2">
            <div className="hidden xl:grid xl:grid-cols-5 gap-2">
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-sm opacity-70">
                  Łączna wartość sprzętu
                </p>
                <p className="text-xl font-medium">
                  {stats?.summary?.totalValue?.toLocaleString("pl-PL")} zł
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-sm opacity-70">
                  Aktywne pozycje
                </p>
                <p className="text-xl font-medium">
                  {stats?.summary?.activeItems?.toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-sm opacity-70">
                  Łączna ilość sztuk
                </p>
                <p className="text-xl font-medium">
                  {stats?.summary?.totalQuantity?.toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-sm opacity-70">
                  Zlikwidowane pozycje
                </p>
                <p className="text-xl font-medium">
                  {stats?.summary?.disposedCount?.toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-sm opacity-70">
                  Wartość zlikwidowanego sprzętu
                </p>
                <p className="text-xl font-medium">
                  {stats?.summary?.disposedValue?.toLocaleString("pl-PL")} zł
                </p>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-2 xl:hidden">
              <div className="col-span-2 bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-xs opacity-70">
                  Łączna wartość sprzętu
                </p>
                <p className="text-xl font-medium mt-1">
                  {stats?.summary?.totalValue?.toLocaleString("pl-PL")} zł
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-xs opacity-70">
                  Aktywne pozycje
                </p>
                <p className="text-lg font-medium mt-1">
                  {stats?.summary?.activeItems?.toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-xs opacity-70">
                  Łączna ilość sztuk
                </p>
                <p className="text-lg font-medium mt-1">
                  {stats?.summary?.totalQuantity?.toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-xs opacity-70">
                  Zlikwidowane pozycje
                </p>
                <p className="text-lg font-medium mt-1">
                  {stats?.summary?.disposedCount?.toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="bg-[#203047]/55 rounded-lg p-2 text-white">
                <p className="text-xs opacity-70">
                  Wartość zlikwidowanego sprzętu
                </p>
                <p className="text-lg font-medium mt-1">
                  {stats?.summary?.disposedValue?.toLocaleString("pl-PL")} zł
                </p>
              </div>
            </div>
            <div className="hidden xl:grid xl:grid-rows-[1.3fr_1fr] gap-2 flex-1 min-h-[600px]">
                <div className="bg-[#203047]/55 rounded-lg pt-2 min-h-0 flex flex-col overflow-hidden h-full">
                    <h2 className="text-xl text-center text-white mb-1">
                        Wartość sprzętu dla poszczególnego działu
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <button
                            disabled={servicePage === 0}
                            onClick={() => setServicePage((p) => p - 1)}
                            className="px-2 py-0 rounded bg-blue-700 disabled:opacity-40"
                        >
                            <IoCaretBack className="text-2xl"/>
                        </button>
                        <span className="text-white text-sm">
                        {servicePage * SERVICES_PER_PAGE + 1}-{Math.min((servicePage + 1) * SERVICES_PER_PAGE,stats?.serviceValue?.length || 0)}
                        {" / "}
                        {stats?.serviceValue?.length || 0}
                        </span>
                        <button
                            disabled={servicePage >= maxServicePage}
                            onClick={() => setServicePage((p) => p + 1)}
                            className="px-2 py-0 rounded bg-blue-700 disabled:opacity-40"
                        >
                            <IoCaretForward className="text-2xl"/>
                        </button>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                            <BarChart
                            layout="vertical"
                            data={pagedServices}
                            margin={{top: 10, right: 40, left: 0, bottom: 10,}}
                            >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.1)"
                            />
                            <XAxis
                                type="number"
                                domain={[0, maxServiceValue]}
                                tickFormatter={(value) => Intl.NumberFormat("pl", {notation: "compact", maximumFractionDigits: 1,}).format(value)}
                                tick={{ fill: "#fff", fontSize: 12 }}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={190}
                                tick={{ fill: "#fff", fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value) => [`${Number(value).toLocaleString("pl-PL")} zł`,"Wartość",]}
                                contentStyle={{
                                    background: "#000000",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#1D4ED8"
                                radius={[0, 6, 6, 0]}
                                barSize={20}
                                maxBarSize={20}
                            />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 min-h-0">
                    <div className="bg-[#203047]/55 rounded-lg p-2 min-h-0 flex flex-col overflow-hidden">
                    <h2 className="text-xl text-white">
                        Sposoby likwidacji
                    </h2>
                    <div className="flex-1 flex items-center justify-center text-white/60">
                        <ResponsiveContainer width="90%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                            <PieChart>
                                <Pie
                                    data={stats?.disposalBreakdown || []}
                                    dataKey="count"
                                    nameKey="name"
                                    outerRadius={70}
                                    label={renderPieLabel}
                                    labelLine={false}
                                >
                                    {stats?.disposalBreakdown?.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        background: "#000000",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                />

                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                    <div className="bg-[#203047]/55 rounded-lg p-2 min-h-0 flex flex-col overflow-hidden">
                    <h2 className="text-xl text-white">
                        Stan sprzętu
                    </h2>
                    <div className="flex-1 flex items-center justify-center text-white/60">
                        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                            <PieChart>
                                <Pie
                                data={stats?.conditionBreakdown || []}
                                dataKey="count"
                                nameKey="name"
                                outerRadius={70}
                                label={renderPieLabel}
                                labelLine={false}
                                >
                                {stats?.conditionBreakdown?.map((_, index) => (
                                    <Cell
                                    key={index}
                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    />
                                ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        background: "#000000",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                    <div className="bg-[#203047]/55 rounded-lg p-2 min-h-0 flex flex-col overflow-hidden">
                        <h2 className="text-xl text-white pb-1 shrink-0">
                            Najdroższe pozycje
                        </h2>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-white text-sm">
                                <thead className="sticky top-0 bg-black/50 backdrop-blur-xs z-10">
                                <tr>
                                    <th className="text-left p-2">Przedmiot</th>
                                    <th className="text-left p-2">Dział</th>
                                    <th className="text-right p-2">Ilość</th>
                                    <th className="text-right p-2 whitespace-nowrap">Wartość</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats?.topItems?.map((item) => (
                                    <tr
                                    key={item.id}
                                    className="border-b border-white/10"
                                    >
                                    <td className="p-2">
                                        {item.item_name}
                                    </td>

                                    <td className="p-2">
                                        {item.service}
                                    </td>

                                    <td className="p-2 text-right">
                                        {item.quantity}
                                    </td>

                                    <td className="p-2 text-right whitespace-nowrap">
                                        {item.total_value.toLocaleString("pl-PL")} zł
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="xl:hidden flex flex-col gap-1 flex-1 min-h-0">
                <div className="grid grid-cols-2 gap-1 md:gap-2 mb-0 md:mb-1 md:grid-cols-4">
                    <button
                        onClick={() => setActiveTab("summary")}
                        className={`md:hidden col-span-2 rounded-lg p-2 text-white cursor-pointer ${
                        activeTab === "summary"
                            ? "bg-blue-700"
                            : "bg-[#203047]/55"
                        }`}
                    >
                        Podsumowanie
                    </button>
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`rounded-lg p-2 text-white cursor-pointer ${
                        activeTab === "services"
                            ? "bg-blue-700"
                            : "bg-[#203047]/55"
                        }`}
                    >
                        Działy
                    </button>
                    <button
                        onClick={() => setActiveTab("top")}
                        className={`rounded-lg p-2 text-white cursor-pointer ${
                        activeTab === "top"
                            ? "bg-blue-700"
                            : "bg-[#203047]/55"
                        }`}
                    >
                        Najdroższe
                    </button>
                    <button
                        onClick={() => setActiveTab("condition")}
                        className={`rounded-lg p-2 text-white cursor-pointer ${
                        activeTab === "condition"
                            ? "bg-blue-700"
                            : "bg-[#203047]/55"
                        }`}
                    >
                        Stan
                    </button>
                    <button
                        onClick={() => setActiveTab("disposed")}
                        className={`rounded-lg p-2 text-white cursor-pointer ${
                        activeTab === "disposed"
                            ? "bg-blue-700"
                            : "bg-[#203047]/55"
                        }`}
                    >
                        Likwidacje
                    </button>
                </div>
                <div className="bg-[#203047]/55 rounded-lg p-2 flex-1 flex flex-col">
                    {activeTab === "summary" && (
                    <div className="grid grid-cols-1 gap-2 h-full min-h-[420px]">
                        <div className="bg-[#203047]/55 rounded-lg p-3 text-white">
                        <p className="text-xs opacity-70">
                            Łączna wartość sprzętu
                        </p>
                        <p className="text-xl font-medium mt-1">
                            {stats?.summary?.totalValue?.toLocaleString("pl-PL")} zł
                        </p>
                        </div>
                        <div className="bg-[#203047]/55 rounded-lg p-3 text-white">
                        <p className="text-xs opacity-70">
                            Aktywne pozycje
                        </p>
                        <p className="text-lg font-medium mt-1">
                            {stats?.summary?.activeItems?.toLocaleString("pl-PL")}
                        </p>
                        </div>
                        <div className="bg-[#203047]/55 rounded-lg p-3 text-white">
                        <p className="text-xs opacity-70">
                            Łączna ilość sztuk
                        </p>
                        <p className="text-lg font-medium mt-1">
                            {stats?.summary?.totalQuantity?.toLocaleString("pl-PL")}
                        </p>
                        </div>
                        <div className="bg-[#203047]/55 rounded-lg p-3 text-white">
                        <p className="text-xs opacity-70">
                            Zlikwidowane pozycje
                        </p>
                        <p className="text-lg font-medium mt-1">
                            {stats?.summary?.disposedCount?.toLocaleString("pl-PL")}
                        </p>
                        </div>
                        <div className="bg-[#203047]/55 rounded-lg p-3 text-white">
                        <p className="text-xs opacity-70">
                            Wartość zlikwidowanego sprzętu
                        </p>
                        <p className="text-lg font-medium mt-1">
                            {stats?.summary?.disposedValue?.toLocaleString("pl-PL")} zł
                        </p>
                        </div>
                    </div>
                    )}
                    {activeTab === "services" && (
                    <>
                        <h2 className="text-base text-center text-white mb-2">
                        Wartość sprzętu dla poszczególnego działu
                        </h2>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <button
                                disabled={servicePage === 0}
                                onClick={() => setServicePage((p) => p - 1)}
                                className="px-2 py-1 rounded bg-blue-700 disabled:opacity-40"
                            >
                                <IoCaretBack className="text-xl"/>
                            </button>
                            <span className="text-white text-sm">
                            {servicePage * SERVICES_PER_PAGE + 1}-{Math.min((servicePage + 1) * SERVICES_PER_PAGE,stats?.serviceValue?.length || 0)}
                            {" / "}
                            {stats?.serviceValue?.length || 0}
                            </span>
                            <button
                                disabled={servicePage >= maxServicePage}
                                onClick={() => setServicePage((p) => p + 1)}
                                className="px-2 py-1 rounded bg-blue-700 disabled:opacity-40"
                            >
                                <IoCaretForward className="text-xl"/>
                            </button>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                                <BarChart
                                layout="vertical"
                                data={pagedServices}
                                margin={{top: 10, right: 35, left: 0, bottom: 20,}}
                                >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.1)"
                                />
                                <XAxis
                                    type="number"
                                    domain={[0, maxServiceValue]}
                                    tickFormatter={(value) => Intl.NumberFormat("pl", {notation: "compact", maximumFractionDigits: 1, }).format(value)}
                                    tick={{ fill: "#fff", fontSize: 10 }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={80}
                                    tick={{ fill: "#fff", fontSize: 10 }}
                                />
                                <Tooltip
                                    formatter={(value) => [`${Number(value).toLocaleString("pl-PL")} zł`,"Wartość",]}
                                    contentStyle={{
                                        background: "#000000",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#1D4ED8"
                                    radius={[0, 6, 6, 0]}
                                    barSize={18}
                                    maxBarSize={18}
                                />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                    )}
                    {activeTab === "top" && (
                    <>
                        <h2 className="text-base text-center text-white mb-1">
                            Najdroższe pozycje
                        </h2>
                        <div className="flex-1 overflow-auto scrollbar-none">
                            <table className="w-full text-white text-sm">
                                <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left p-1">Przedmiot</th>
                                    <th className="text-left p-1">Dział</th>
                                    <th className="text-right p-1">Ilość</th>
                                    <th className="text-right p-1 whitespace-nowrap">Wartość</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats?.topItems?.map((item) => (
                                    <tr
                                    key={item.id}
                                    className="border-b border-white/10"
                                    >
                                    <td className="p-1">
                                        {item.item_name}
                                    </td>
                                    <td className="p-1">
                                        {item.service}
                                    </td>
                                    <td className="p-1 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="p-1 text-right whitespace-nowrap">
                                        {item.total_value.toLocaleString("pl-PL")} zł
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                    </>
                    )}
                    {activeTab === "condition" && (
                    <>
                        <h2 className="text-base text-center text-white mb-4">
                        Stan sprzętu
                        </h2>
                        <div className="flex-1 flex items-center justify-center text-white/60 min-h-[280px]">
                            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                                <PieChart>
                                    <Pie
                                    data={stats?.conditionBreakdown || []}
                                    dataKey="count"
                                    nameKey="name"
                                    outerRadius={80}
                                    label={renderPieLabel}
                                    labelLine={false}
                                    >
                                    {stats?.conditionBreakdown?.map((_, index) => (
                                        <Cell
                                        key={index}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{
                                            background: "#000000",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Legend
                                        height={60}
                                        width={300}
                                        wrapperStyle={{
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                    )}
                    {activeTab === "disposed" && (
                    <>
                        <h2 className="text-base text-center text-white mb-4">
                        Sposoby likwidacji
                        </h2>
                        <div className="flex-1 flex items-center justify-center text-white/60 min-h-[280px]">
                            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height: 50 }}>
                                <PieChart>
                                    <Pie
                                        data={stats?.disposalBreakdown || []}
                                        dataKey="count"
                                        nameKey="name"
                                        outerRadius={80}
                                        label={renderPieLabel}
                                        labelLine={false}
                                    >
                                        {stats?.disposalBreakdown?.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{
                                            background: "#000000",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                   <Legend
                                        height={60}
                                        width={300}
                                        wrapperStyle={{
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                    )}
                </div>
            </div>
          </div>
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