import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

export const get = query({
	args: { paginationOpts: paginationOptsValidator },
	handler: async (ctx, args) => {
		return await ctx.db.query('documents').paginate(args.paginationOpts);
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

		return await ctx.db.insert('documents', {
			title: args.title ?? 'Untitled Document',
			initialContent: args.initialContent,
			ownerId: user.subject,
		});
	},
});

export const update = mutation({
	args: {
		id: v.id('documents'),
		title: v.string(),
		initialContent: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.id, {
			title: args.title,
			initialContent: args.initialContent,
		});
	},
});

export const remove = mutation({
	args: {
		id: v.id('documents'),
	},
	handler: async (ctx, args) => {
		return await ctx.db.delete(args.id);
	},
});
