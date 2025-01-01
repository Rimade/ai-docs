import { Editor } from './editor';
import { Navbar } from './navbar';
import { Room } from './room';
import { Toolbar } from './toolbar';

interface DocumentPageProps {
	params: { documentId: string };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	const { documentId } = await params;

	console.log(documentId);

	return (
		<div className="min-h-screen bg-[#FAFBFD]">
			<div className="flex flex-col px-4 pt-2 gap-y-2 sticky top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
				<Navbar />
				<Toolbar />
			</div>
			<div className="print:pt-0 mt-1">
				<Room>
					<Editor />
				</Room>
			</div>
		</div>
	);
}
