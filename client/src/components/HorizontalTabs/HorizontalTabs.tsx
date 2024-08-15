import { MdHome } from "react-icons/md";
import { IoListSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import "./HorizontalTabs.css";
import { useNavigate } from "react-router-dom";

export default function HorizontalTabs() {
  const navigate = useNavigate()
  return (
    <RadioGroup
      onValueChange={(value) => navigate(`/${value}`)}
      defaultValue="list"
      className="flex justify-between dark:bg-zinc-800 w-full px-14 bg-zinc-200 h-full md:px-24 md:rounded-t-xl items-center sm:px-10 sm:w-6/12"
    >
      <RadioGroupItem defaultChecked={true} value="list" id="list-tab" className="radio-item" />
      <label htmlFor="list-tab" className="menu-label text-xl">
        <IoListSharp />
      </label>

      <RadioGroupItem value="" id="home-tab" className="radio-item" />
      <label htmlFor="home-tab" className="menu-label text-xl">
        <MdHome />
      </label>

      <RadioGroupItem value="create" id="create-tab" className="radio-item" />
      <label htmlFor="create-tab" className="menu-label text-lg">
        <FaPlus />
      </label>

      <RadioGroupItem value="profile" id="profile-tab" className="radio-item" />
      <label htmlFor="profile-tab" className="menu-label text-lg">
        <IoPerson />
      </label>
    </RadioGroup>
  );
}
