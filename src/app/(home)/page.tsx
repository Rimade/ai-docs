'use client';

import { usePaginatedQuery } from 'convex/react';
import { Navbar } from '../../widgets/navbar';
import { TemplatesGallery } from '../../widgets/templates-gallery';
import { api } from '../../../convex/_generated/api';
import { DocumentTable } from '../../widgets/document';
import { Loader2 } from 'lucide-react';
import { useSearchParam } from '@/shared/hooks/use-search-param';

export default function Home() {
  const [search] = useSearchParam();
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search },
    {
      initialNumItems: 5
    }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        {results ? (
          <DocumentTable
            documents={results}
            loadMore={() => loadMore(10)}
            status={status}
          />
        ) : (
          <div className="flex justify-center items-center h-[calc(100vh-32rem)]">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
