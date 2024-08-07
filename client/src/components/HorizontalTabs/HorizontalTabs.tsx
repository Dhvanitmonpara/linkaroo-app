import { MdHome } from "react-icons/md";
import { IoListSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import "./HorizontalTabs.css";

export default function HorizontalTabs() {
  return (
    <RadioGroup
      defaultValue="comfortable"
      className="flex justify-between dark:bg-zinc-800 w-full px-14 bg-zinc-200 h-full md:px-24 rounded-t-xl items-center sm:px-10 sm:w-6/12"
    >
      <RadioGroupItem value="default" id="r1" className="radio-item" />
      <label htmlFor="r1" className="menu-label text-xl">
        <IoListSharp />
      </label>
      
      <RadioGroupItem value="comfortable" id="r2" className="radio-item" />
      <label htmlFor="r2" className="menu-label text-xl">
        <MdHome />
      </label>
      
      <RadioGroupItem value="compact1" id="r3" className="radio-item" />
      <label htmlFor="r3" className="menu-label text-lg">
        <FaPlus />
      </label>
      
      <RadioGroupItem value="compact2" id="r4" className="radio-item" />
      <label htmlFor="r4" className="menu-label text-lg">
        <IoPerson />
      </label>
    </RadioGroup>
  );
}
