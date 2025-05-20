const AVATAR_SIZE = 36;

interface AvatarProps {
  src: string;
  name: string;
}

export const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      className="flex group -ml-2 shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400"
    >
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-gray-900 whitespace-nowrap transition-opacity">
        {name}
      </div>
      <img src={src} alt={name} className="rounded-full size-full" />
    </div>
  );
};

export type { AvatarProps };
