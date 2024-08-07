type TagProps = { text: string, isBlackEnable: boolean };

const Tag = ({ text, isBlackEnable }: TagProps) => {
  return (
    <span className={`px-4 py-1 ${isBlackEnable ? "!bg-[#292929] hover:!bg-[#1c1c1c]" : "bg-[#00000017] hover:bg-[#00000023]"} cursor-pointer rounded-full`}>
      {text}
    </span>
  );
};

export default Tag;
