import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const getDocuments = query(async ({ db }) => {
	return await db.query('documents').collect();
});

export const createDocument = mutation(
	async (
		{ db },
		{
			title,
			initialContent,
			ownerId,
			organizationId,
		}: {
			title: string;
			initialContent: string;
			ownerId: string;
			organizationId: string;
		}
	) => {
		return await db.insert('documents', {
			title,
			initialContent,
			ownerId,
			organizationId,
		});
	}
);

export const updateDocument = mutation(
	async (
		{ db },
		{
			id,
			title,
			initialContent,
			ownerId,
			organizationId,
		}: {
			id: Id<'documents'>;
			title: string;
			initialContent: string;
			ownerId: string;
			organizationId: string;
		}
	) => {
		return await db.patch(id, {
			title,
			initialContent,
			ownerId,
			organizationId,
		});
	}
);

export const deleteDocument = mutation(
	async ({ db }, { id }: { id: Id<'documents'> }) => {
		return await db.delete(id);
	}
);
