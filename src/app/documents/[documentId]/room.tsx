'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
	LiveblocksProvider,
	RoomProvider,
	ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { FullscreenLoader } from '@/components/fullscreen-loader';
import { getUsers } from './actions';
import { toast } from 'sonner';

type User = {
	id: string;
	name: string;
	avatar: string;
};

export function Room({ children }: { children: ReactNode }) {
	const params = useParams();

	const [users, setUsers] = useState<User[]>([]);

	const fetchUsers = useMemo(
		() => async () => {
			try {
				const list = await getUsers();
				setUsers(list);
			} catch (error) {
				toast.error('Something went wrong');
			}
		},
		[]
	);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return (
		<LiveblocksProvider
			throttle={16}
			authEndpoint="/api/liveblocks-auth"
			resolveUsers={({ userIds }) =>
				userIds.map((userId) => users.find((user) => user.id === userId)) ?? []
			}
			resolveMentionSuggestions={({ text }) => {
				let filteredUsers = users;

				if (text) {
					filteredUsers = users.filter((user) =>
						user.name.toLowerCase().includes(text.toLowerCase())
					);
				}

				return filteredUsers.map((user) => user.id);
			}}
			resolveRoomsInfo={({ roomIds }) => roomIds.map((roomId) => ({ roomId }))}>
			<RoomProvider id={params.documentId as string}>
				<ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
					{children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	);
}
