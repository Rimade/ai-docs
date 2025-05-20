'use client';

import { ClientSideSuspense, useInboxNotifications } from '@liveblocks/react/suspense';
import { InboxNotification, InboxNotificationList } from '@liveblocks/react-ui';
import { BellIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

export const Inbox = () => {
  return (
    <ClientSideSuspense
      fallback={
        <>
          <Button variant="ghost" size="icon" className="relative" disabled>
            <BellIcon className="size-5" />
          </Button>
          <Separator className="h-6" orientation="vertical" />
        </>
      }
    >
      <InboxMenu />
    </ClientSideSuspense>
  );
};
const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="size-5" />
            {inboxNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full text-xs text-white flex items-center justify-center bg-sky-500">
                {inboxNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          {inboxNotifications.length > 0 ? (
            <InboxNotificationList>
              {inboxNotifications.map(notification => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                />
              ))}
            </InboxNotificationList>
          ) : (
            <div className="p-2 w-[400px] text-center text-muted-foreground text-sm">
              No notifications
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator className="h-6" orientation="vertical" />
    </>
  );
};
