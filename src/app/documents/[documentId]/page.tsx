import { Editor } from './editor';

interface DocumentPageProps {
	params: Promise<{ documentId: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	const { documentId } = await params;

	return (
		<div className="min-h-screen bg-[#FAFBFD]">
			<Editor />
		</div>
	);
}
