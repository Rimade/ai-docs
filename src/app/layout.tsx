import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { ConvexClientProvider } from '@/components/convex-client-provider';

import './globals.css';
import '@liveblocks/react-ui/styles.css';
import '@liveblocks/react-tiptap/styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Lazy Docs',
	description: 'Lazy Docs is a simple document editor',
	icons: {
		icon: '/icons/icon.ico',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body suppressHydrationWarning={true} className={`${inter.className} antialiased`}>
				<ConvexClientProvider>
					<NuqsAdapter>
						{children}
						<Toaster />
					</NuqsAdapter>
				</ConvexClientProvider>
			</body>
		</html>
	);
}
