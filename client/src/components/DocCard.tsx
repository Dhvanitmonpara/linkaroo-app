import { colorOptions } from "@/lib/types.tsx";

type DocCardProps = {
    text: string;
    color: colorOptions;
}

const DocCard = ({text, color}: DocCardProps) => {
  return (
    <div className={`${color} h-14 rounded-md flex justify-start items-center px-7`}>
      <h2 className="font-medium font-mono text-xl">{text}</h2>
    </div>
  );
};

export default DocCard;
