import { Avatar } from '@/shared/ui/avatar/avatar';
import { Separator } from '@/shared/ui/separator';
import { useOthers, useSelf } from '@liveblocks/react/suspense';

export const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();

  if (!users.length) return null;

  return (
    <>
      <div className="flex items-center">
        {currentUser && (
          <div className="relative ml-2">
            <Avatar src={currentUser.info.avatar} name="You" />
          </div>
        )}

        {users.map(({ connectionId, info }) => {
          return <Avatar key={connectionId} src={info.avatar} name={info.name} />;
        })}
      </div>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};
