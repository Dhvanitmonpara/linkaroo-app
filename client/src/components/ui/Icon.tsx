import { iconMap } from "@/lib/constants/Icons";
import { BsFillCollectionFill } from "react-icons/bs";

function Icon({ icon }: { icon: string }) {
  const checkIconAvailability = () => {
    const Icon = iconMap[icon as keyof typeof iconMap];
    if (!Icon) {
      return <BsFillCollectionFill />; // Fallback
    }
    return <Icon />;
  };
  return (
    <>
      {checkIconAvailability()}
    </>
  )
}

export default Icon