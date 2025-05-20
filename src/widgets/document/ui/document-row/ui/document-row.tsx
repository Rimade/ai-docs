'use client';

import { TableCell, TableRow } from '@/shared/ui/table';
import { SiGoogledocs } from 'react-icons/si';
import type { Doc } from '@/../convex/_generated/dataModel';
import { Building2Icon, CircleUserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DocumentMenu } from '../../..';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';

interface DocumentRowProps {
  document: Doc<'documents'>;
}

export default function DocumentRow({ document }: DocumentRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    try {
      router.push(`/documents/${document._id}`);
    } catch (error) {
      console.error('Ошибка при переходе на страницу документа:', error);
    }
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="w-[50px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <SiGoogledocs className="size-6 fill-blue-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Google Docs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      <TableCell className="font-medium md:w-[45%] truncate">{document.title}</TableCell>

      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {document.organizationId ? (
                <Building2Icon className="size-4" />
              ) : (
                <CircleUserIcon className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{document.organizationId ? 'Организация' : 'Личное'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {document.organizationId ? 'Organization' : 'Personal'}
      </TableCell>

      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(document._creationTime, 'MMM dd, yyyy')}
      </TableCell>

      <TableCell className="flex justify-end">
        <DocumentMenu
          documentId={document._id}
          title={document.title}
          onNewTab={() => window.open(`/documents/${document._id}`, '_blank')}
        />
      </TableCell>
    </TableRow>
  );
}
