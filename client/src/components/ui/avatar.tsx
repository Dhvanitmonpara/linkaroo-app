type AvatarProps = {
    width: string,
    imgSrc: string,
}

const Avatar = ({width, imgSrc}: AvatarProps) => {
  return (
    <div className="avatar border-[0.7px]">
      <div className={`${width} rounded-full overflow-hidden`}>
        <img src={imgSrc} className="m-1" />
      </div>
    </div>
  );
};

export default Avatar;
