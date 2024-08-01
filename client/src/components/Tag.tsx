type TagProps = {text: string}

const Tag = ({ text }: TagProps) => {
    return (
      <span className="px-4 py-1 bg-[#00000017] hover:bg-[#00000010] cursor-pointer rounded-full">
        {text}
      </span>
    );
  };
  
  export default Tag;