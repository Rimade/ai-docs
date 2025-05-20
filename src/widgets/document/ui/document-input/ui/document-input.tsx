import { BsCloudCheck, BsCloudSlash } from 'react-icons/bs';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { toast } from 'sonner';
import { useStatus } from '@liveblocks/react';
import { Loader2Icon } from 'lucide-react';

interface DocumentInputProps {
  title: string;
  id: Id<'documents'>;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({ title, id }) => {
  const status = useStatus();
  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const showLoader = isPending || status === 'connecting' || status === 'reconnecting';

  const showError = status === 'disconnected';

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;

    setIsPending(true);
    mutate({ id, title: newValue })
      .then(() => toast.success('Document saved'))
      .catch(() => toast.error('Failed to save document'))
      .finally(() => setIsPending(false));
  }, 1000);

  const mutate = useMutation(api.documents.updateById);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);
    mutate({ id, title: value })
      .then(() => {
        toast.success('Document saved');
        setIsEditing(false);
      })
      .catch(() => toast.error('Failed to save document'))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">{value || ' '}</span>
          <input
            type="text"
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}

      {showError && <BsCloudSlash className="size-4" />}
      {!showError && !showLoader && <BsCloudCheck className="size-4" />}
      {showLoader && (
        <Loader2Icon className="animate-spin size-4 text-muted-foreground" />
      )}
    </div>
  );
};
