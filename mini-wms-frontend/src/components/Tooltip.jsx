import { useRef, useEffect } from "react"; 

export default function Tooltip({ children, className = "", forcePosition = null }) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleHover = () => {
    if (!containerRef.current || !tooltipRef.current) return;
    const el = containerRef.current.querySelector(".truncate") || containerRef.current.querySelector("[data-tooltip-content]");
    if (!el) return;
    let text = "";
    const tag = el.tagName?.toLowerCase() || "";

    if (tag === "input" || tag === "textarea") {
      text = el.value || "";
    } else {
      text = el.innerText || el.textContent || "";
    }

    tooltipRef.current.textContent = text.trim();
    const isOverflowing = el.scrollWidth > el.clientWidth;

    if (!isOverflowing) {
      tooltipRef.current.classList.remove("tooltip-active");
      return;
    } else {
      tooltipRef.current.classList.add("tooltip-active");
    }

    const rect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    tooltipRef.current.style.left = "0";
    tooltipRef.current.style.right = "auto";
    const isInput = tag === "input" || tag === "textarea";
    const baseOffset = isInput ? -12 : 4;
    let showAbove = false;
    if (forcePosition === "top") showAbove = true;
    else if (forcePosition === "bottom") showAbove = false;
    else if (spaceBelow < tooltipRect.height + 8 && spaceAbove > tooltipRect.height) showAbove = true;

    if (showAbove) {
      tooltipRef.current.style.top = "auto";
      tooltipRef.current.style.bottom = "100%";
      tooltipRef.current.style.marginTop = "0px";
      tooltipRef.current.style.marginBottom = `${Math.abs(baseOffset)}px`;
    } else {
      tooltipRef.current.style.top = "100%";
      tooltipRef.current.style.bottom = "auto";
      tooltipRef.current.style.marginTop = `${baseOffset}px`;
      tooltipRef.current.style.marginBottom = "0px";
    }
  };

  useEffect(() => {
    const node = containerRef.current;
    const hide = () => tooltipRef.current?.classList.remove("tooltip-active");
    if (node) node.addEventListener("mouseleave", hide);
    return () => node?.removeEventListener("mouseleave", hide);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleHover}
      className={`relative inline-block w-full max-w-full align-middle ${className}`}
    >
      {children}
      <div
        ref={tooltipRef}
        className={`absolute opacity-0 transition-opacity duration-100 bg-black text-white text-sm px-2 py-1.5 rounded shadow-lg pointer-events-none z-10 whitespace-normal break-words w-max max-w-[300px]`}
      ></div>
      <style>{`
        .tooltip-active {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}