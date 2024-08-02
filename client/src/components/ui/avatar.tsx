type AvatarProps = {
    width: string,
    imgSrc: string,
}

const Avatar = ({width, imgSrc}: AvatarProps) => {
  return (
    <div className="avatar border-[0.7px]">
      <div className={`${width} rounded-full`}>
        <img src={imgSrc} />
      </div>
    </div>
  );
};

export default Avatar;
