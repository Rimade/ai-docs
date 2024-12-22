import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const getDocuments = query(async ({ db }) => {
	return await db.query('documents').collect();
});

export const createDocument = mutation(
	async ({ db }, { title, content }: { title: string; content: string }) => {
		return await db.insert('documents', { title, content });
	}
);

export const updateDocument = mutation(
	async (
		{ db },
		{ id, title, content }: { id: Id<'documents'>; title: string; content: string }
	) => {
		return await db.patch(id, { title, content });
	}
);
