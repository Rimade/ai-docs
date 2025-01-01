'use client';

import { ReactNode } from 'react';
import {
	LiveblocksProvider,
	RoomProvider,
	ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { useParams } from 'next/navigation';

export function Room({ children }: { children: ReactNode }) {
	const { documentId } = useParams();

	return (
		<LiveblocksProvider
			publicApiKey={
				'pk_dev_junSROBE2VdiHIDKnjIpjEgYAk4g81_WmSsEZ4LsBLHg83envA5bncG5Gj62y3uA'
			}>
			<RoomProvider id={documentId as string}>
				<ClientSideSuspense fallback={<div>Loading…</div>}>{children}</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	);
}
