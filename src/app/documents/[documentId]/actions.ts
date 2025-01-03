'use server';

// Функция getUsers получает список пользователей из Clerk, фильтруя по организации
// из claims сессии. Она возвращает массив объектов, содержащих id, имя и аватар
// каждого пользователя

import { auth, clerkClient } from '@clerk/nextjs/server';

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
