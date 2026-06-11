export default function PageTemplate({ children }) {
  return (
    <div className="flex flex-col h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full bg-[url('/background-blur.png')] bg-cover bg-center bg-no-repeat relative text-white">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 font-rubik flex flex-col h-full items-center justify-center overflow-auto">
        {children}
      </div>
    </div>
  );
}