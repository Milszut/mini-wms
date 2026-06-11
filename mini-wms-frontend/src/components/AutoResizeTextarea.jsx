import { useRef, useEffect } from "react";

export default function AutoResizeTextarea({name, value, onChange, placeholder = "", maxLength, className = "", minRows = 1, ...rest}) {
  const ref = useRef(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={minRows}
      spellCheck={false}
      onChange={(e) => {onChange(e); requestAnimationFrame(resize);}}
      className={`w-full p-1 mb-2 min-h-9 text-white placeholder-zinc-400 placeholder:text-sm rounded border-2 border-white focus:outline-none focus:border-blue-700 bg-transparent resize-none overflow-hidden leading-normal       
        ${className}
      `}
      style={{boxSizing: "border-box",}}
      {...rest}
    />
  );
}