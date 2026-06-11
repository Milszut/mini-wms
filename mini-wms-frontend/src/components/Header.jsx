import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import SideMenu from "./SideMenu";
import Tooltip from "../components/Tooltip";

export default function Header({ title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="flex items-center bg-[#203047] xs:h-20 w-full p-2 justify-between">
        <div className="flex items-center flex-shrink-0 ml-4">
          <img
            src="/Mini-WMS-Icon.png"
            alt="Logo Mini WMS"
            className="w-12 xs:w-16"
          />
        </div>

        <div className="flex-1 flex justify-center min-w-0 px-2">
          {title && (
            <Tooltip>
              <p data-tooltip-content className="font-rubik font-medium text-center text-xl xs:text-3xl text-white max-w-full overflow-hidden text-ellipsis whitespace-nowrap select-none cursor-default">
                {title}
              </p>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center flex-shrink-0 mr-4">
          <FiMenu
            className="w-8 h-8 xs:w-12 xs:h-10 text-white hover:text-blue-600 cursor-pointer transition"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}