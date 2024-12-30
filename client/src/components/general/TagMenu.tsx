import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@radix-ui/react-label";
import "../components.css"

type TagMenuProps = {
  setTagValue: (value: string) => void;
  tagOptions: string[];
};

const TagMenu = ({ setTagValue, tagOptions }: TagMenuProps) => {
  return (
    <RadioGroup
      defaultValue="comfortable"
      onValueChange={(value) => {
        setTagValue(value);
      }}
      className="menu-bar !w-full font-medium menu-bar flex flex-col gap-2 p-2 rounded-lg"
    >
      {tagOptions?.map((tag) => (
        <div className="menu-item w-full">
          <RadioGroupItem value={tag} id={tag} className="radio-item" />
          <Label
            htmlFor={tag}
            className="menu-label cursor-pointer !w-full px-4 py-2 rounded-md hover:underline transition-colors"
          >
            {tag}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default TagMenu;
