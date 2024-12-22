import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import './globals.css';
import { ConvexClientProvider } from '@/components/convex-client-provider';

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
					<NuqsAdapter>{children}</NuqsAdapter>
				</ConvexClientProvider>
			</body>
		</html>
	);
}
