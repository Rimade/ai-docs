'use server';

// Функция getUsers получает список пользователей из Clerk, фильтруя по организации
// из claims сессии. Она возвращает массив объектов, содержащих id, имя и аватар
// каждого пользователя

import { ConvexHttpClient } from 'convex/browser';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<'documents'>[]) {
	return convex.query(api.documents.getByIds, { ids });
}

export async function getUsers() {
	const { sessionClaims } = await auth();
	const clerk = await clerkClient();

	const { data } = await clerk.users.getUserList({
		organizationId: [sessionClaims?.org_id as string],
	});
	const users = data.map((user) => ({
		id: user.id,
		name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Anonymous',
		avatar: user.imageUrl,
	}));

	return users;
}
