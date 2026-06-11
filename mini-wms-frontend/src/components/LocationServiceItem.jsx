import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function LocationServiceItem({name,onEdit,onDelete,})

{
  return(
    <div className="group flex flex-row h-16 w-full items-center justify-center hover:bg-black/50 p-3 gap-3">
      <p className="text-white text-lg text-nowrap">
        {name}
      </p>
      <div className="w-full"></div>
      <button
        onClick={onEdit}
        className="text-green-500 text-2xl opacity-100 md:text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 md:hover:text-green-500 cursor-pointer"
      >
      <MdEdit/>
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 text-xl opacity-100 md:text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 md:hover:text-red-600 cursor-pointer"
      >
      <FaTrash/>
      </button>
    </div>
  );
}