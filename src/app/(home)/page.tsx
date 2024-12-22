'use client';

import { useQuery } from 'convex/react';
import Navbar from './navbar';
import TemplatesGallery from './templates-gallery';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import DocumentsList from './documents-list';

export default function Home() {
	const documents = useQuery(api.documents.getDocuments);

	console.log(documents);

	return (
		<div className="min-h-screen flex flex-col">
			<div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
				<Navbar />
			</div>
			<div className="mt-16">
				<TemplatesGallery />
				{documents ? (
					<DocumentsList documents={documents} />
				) : (
					<div className="flex justify-center items-center h-[calc(100vh-24rem)]">
						<p className="text-gray-500">Loading...</p>
					</div>
				)}
			</div>
		</div>
	);
}
