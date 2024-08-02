import Avatar from "./avatar";

type AvatarGroupProps = {
  width: string;
  height: string;
  imgSrcArray: string[];
};

const AvatarGroup = ({
  width,
  height,
  imgSrcArray,
}: AvatarGroupProps) => {
  return (
    <div className={`avatar-group -space-x-4 ${height} rtl:space-x-reverse`}>
      {imgSrcArray.map((imgSrc, index) => (
        <Avatar key={index} imgSrc={imgSrc} width={width} />
      ))}
    </div>
  );
};

export default AvatarGroup;
