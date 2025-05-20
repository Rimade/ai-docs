import { preloadQuery } from 'convex/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Id } from '../../../../convex/_generated/dataModel';
import { Document } from '../../../widgets/document/ui';
import { api } from '../../../../convex/_generated/api';

interface DocumentPageProps {
  params: Promise<{ documentId: Id<'documents'> }>;
}

/**
 * Компонент страницы документа.
 *
 * Получает id документа из параметров маршрута.
 * Берет токен аутентификации из Clerk.
 * Если токен не получен, выбрасывает ошибку Unauthorized.
 * Использует preloadQuery для предзагрузки документа из Convex.
 * Рендерит компонент Document с предзагруженным документом.
 */
export default async function DocumentPage({ params }: DocumentPageProps) {
  const { documentId } = await params;

  const { getToken } = await auth();
  const token = (await getToken({ template: 'convex' })) ?? undefined;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token }
  );

  return <Document preloadedDocument={preloadedDocument} />;
}
