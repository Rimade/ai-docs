'use client';

import { useQuery } from 'convex/react';
import Navbar from './navbar';
import TemplatesGallery from './templates-gallery';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';

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
				<div className="flex flex-col gap-4 p-4">
					{documents?.map((document) => (
						<div
							key={document._id}
							className="p-4 flex justify-between items-center bg-gray-100 rounded-md">
							<div className="flex flex-col gap-2">
								<p className="text-sm font-medium">{document.title}</p>
								<p className="text-xs text-gray-500">{document.content}</p>
							</div>
							<div className="flex justify-end gap-2">
								<Button
									className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
									variant="outline">
									Edit
								</Button>
								<Button
									className="bg-pink-700 text-white hover:bg-pink-800 hover:text-white"
									variant="destructive">
									Delete
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
