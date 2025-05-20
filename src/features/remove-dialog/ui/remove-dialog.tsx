'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface RemoveDialogProps {
  documentId: Id<'documents'>;
  children: React.ReactNode;
}

export function RemoveDialog({ documentId, children }: RemoveDialogProps) {
  const router = useRouter();
  const remove = useMutation(api.documents.removeById);
  const [isRemoving, setIsRemoving] = useState(false);

  const onRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsRemoving(true);
    remove({ id: documentId })
      .catch(() => {
        toast.error('Something went wrong');
      })
      .then(() => {
        toast.success('Document removed');
      })
      .finally(() => {
        router.push('/');
        setIsRemoving(false);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent onClick={e => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Document</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove this document?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={onRemove}
            disabled={isRemoving}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
