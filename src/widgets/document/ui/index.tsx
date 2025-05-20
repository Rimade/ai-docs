'use client';

import type { Preloaded} from 'convex/react';
import { usePreloadedQuery } from 'convex/react';
import { Editor } from '../../editor';
import { Room } from '../../../entities/room/ui/room';
import { Toolbar } from '../../toolbar';
import type { api } from '../../../../convex/_generated/api';
import { DocumentNavbar } from '..';

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export function Document({ preloadedDocument }: DocumentProps) {
  const document = usePreloadedQuery(preloadedDocument);

  return (
    <Room>
      <div className="min-h-screen bg-[#FAFBFD]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 sticky top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <DocumentNavbar data={document} />
          <Toolbar />
        </div>
        <div className="print:pt-0 mt-1">
          <Editor initialContent={document.initialContent} />
        </div>
      </div>
    </Room>
  );
}
