'use client';

import { ClientSideSuspense } from '@liveblocks/react';
import { AvatarStack } from './avatar-stack';

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};
