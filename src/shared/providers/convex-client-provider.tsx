'use client';

import { ReactNode } from 'react';
import { ClerkProvider, useAuth, SignIn } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import {
  ConvexReactClient,
  AuthLoading,
  Authenticated,
  Unauthenticated
} from 'convex/react';
import { FullscreenLoader } from '@/shared/ui/full-screen-loader';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>
          <div className="flex flex-col min-h-screen items-center justify-center">
            <SignIn routing="hash" />
          </div>
        </Unauthenticated>
        <AuthLoading>
          <FullscreenLoader label="Auth loading..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
