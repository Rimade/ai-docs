import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

export const getByIds = query({
	args: { ids: v.array(v.id('documents')) },
	handler: async (ctx, { ids }) => {
		const documents = [];

		for (const id of ids) {
			const document = await ctx.db.get(id);

			if (document) {
				documents.push({
					id: document._id,
					name: document.title,
				});
			} else {
				documents.push({ id, name: '[Removed]' });
			}
		}

		return documents;
	},
});

export const get = query({
	args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
	handler: async (ctx, { search, paginationOpts }) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) throw new ConvexError('Unauthorized');

		const organizationId = (user.organization_id ?? undefined) as string | undefined;

		// Search documents in organization
		if (search && organizationId) {
			return await ctx.db
				.query('documents')
				.withSearchIndex('search_title', (q) =>
					q.search('title', search).eq('organizationId', organizationId)
				)
				.paginate(paginationOpts);
		}

		// Search documents in personal
		if (search) {
			return await ctx.db
				.query('documents')
				.withSearchIndex('search_title', (q) =>
					q.search('title', search).eq('ownerId', user.subject)
				)
				.paginate(paginationOpts);
		}

		// Get documents in organization
		if (organizationId) {
			return await ctx.db
				.query('documents')
				.withIndex('by_organization_id', (q) => q.eq('organizationId', organizationId))
				.paginate(paginationOpts);
		}

		// Get documents in personal
		return await ctx.db
			.query('documents')
			.withIndex('by_owner_id', (q) => q.eq('ownerId', user.subject))
			.paginate(paginationOpts);
	},
});

export const create = mutation({
	args: {
		title: v.optional(v.string()),
		initialContent: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) throw new Error('User not found');

		const organizationId = (user.organization_id ?? undefined) as string | undefined;

		return await ctx.db.insert('documents', {
			title: args.title ?? 'Untitled Document',
			initialContent: args.initialContent,
			ownerId: user.subject,
			organizationId,
		});
	},
});

export const updateById = mutation({
	args: {
		id: v.id('documents'),
		title: v.string(),
	},
	handler: async ({ db, auth }, { id, title }) => {
		const user = await auth.getUserIdentity();
		if (!user) throw new ConvexError('Unauthorized');

		const organizationId = (user.organization_id ?? undefined) as string | undefined;

		const document = await db.get(id);

		if (!document) throw new ConvexError('Document not found');

		const isOwner = document.ownerId === user.subject;
		const isOrganizationMember = Boolean(
			document.organizationId && document.organizationId === organizationId
		);

		if (!isOwner && !isOrganizationMember) throw new ConvexError('Unauthorized');

		return await db.patch(id, {
			title,
		});
	},
});

export const removeById = mutation({
	args: {
		id: v.id('documents'),
	},
	handler: async ({ db, auth }, { id }) => {
		const user = await auth.getUserIdentity();
		if (!user) throw new ConvexError('Unauthorized');

		const organizationId = (user.organization_id ?? undefined) as string | undefined;

		const document = await db.get(id);

		if (!document) throw new ConvexError('Document not found');

		const isOwner = document.ownerId === user.subject;
		const isOrganizationMember = Boolean(
			document.organizationId && document.organizationId === organizationId
		);

		if (!isOwner && !isOrganizationMember) throw new ConvexError('Unauthorized');
		return await db.delete(id);
	},
});

export const getById = query({
	args: {
		id: v.id('documents'),
	},
	handler: async ({ db }, { id }) => {
		const document = await db.get(id);

		if (!document) throw new ConvexError('Document not found');

		return document;
	},
});
