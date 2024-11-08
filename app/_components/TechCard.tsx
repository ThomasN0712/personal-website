import Image from "next/image";

const TechCard = ({
  cardInfo,
}: {
  cardInfo: {
    name: string;
    imageUrl: string;
    darkModeInvert: boolean;
  };
}) => {
  const { name, imageUrl, darkModeInvert } = cardInfo;

  return (
    <div className="flex flex-col items-center gap-1">
      <Image
        src={imageUrl}
        width={40}
        height={40}
        alt={`${name} logo`}
        className={`size-8 ${darkModeInvert ? "dark:invert" : ""}`}
      />
      <p className="text-sm text-center font-medium">{name}</p>
    </div>
  );
};

export default TechCard;
