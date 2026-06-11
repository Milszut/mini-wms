import { useRef } from "react";

export default function TableTooltip({ children, className = "" }) {
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);

    const handleHover = () => {
        if (!containerRef.current || !tooltipRef.current) return;
        const textSpan = containerRef.current.querySelector("[data-cell-text]");
        if (!textSpan) return;
        const isOverflowing = textSpan.scrollWidth > textSpan.clientWidth;
        if (!isOverflowing) {
            tooltipRef.current.classList.remove("tooltip-active");
            return;
        }
        tooltipRef.current.classList.add("tooltip-active");
        const rect = containerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        tooltipRef.current.style.top = "100%";
        tooltipRef.current.style.bottom = "auto";
        tooltipRef.current.style.marginTop = "4px";
        tooltipRef.current.style.marginBottom = "0px";
        if (spaceBelow < tooltipRect.height + 8 && spaceAbove > tooltipRect.height) {
            tooltipRef.current.style.top = "auto";
            tooltipRef.current.style.bottom = "100%";
            tooltipRef.current.style.marginTop = "0px";
            tooltipRef.current.style.marginBottom = "4px";
        }
    };

    const hideTooltip = () => {
        tooltipRef.current?.classList.remove("tooltip-active");
    };

    return (
        <td
            ref={containerRef}
            onMouseEnter={handleHover}
            onMouseLeave={hideTooltip}
            className={`relative px-2 py-2 whitespace-nowrap ${className}`}
        >
            <span data-cell-text className="inline-block w-full overflow-hidden text-ellipsis align-middle"
            >
                {children}
            </span>

            <span
                ref={tooltipRef}
                className={`absolute opacity-0 transition-opacity duration-100 bg-black text-white text-sm px-2 py-1.5 rounded shadow-lg pointer-events-none z-50 whitespace-normal break-words w-max max-w-[300px]
                    ${
                        className.includes("tooltip-center")
                            ? "left-1/2 -translate-x-1/2"
                            : ""
                    }
                    ${
                        className.includes("tooltip-right")
                            ? "right-0"
                            : ""
                    }
                    ${
                        className.includes("tooltip-left")
                            ? "left-0"
                            : ""
                    }
                `}
            >
                {children}
            </span>

            <style>
                {`
                    .tooltip-active {
                        opacity: 1 !important;
                    }
                `}
            </style>
        </td>
    );
}