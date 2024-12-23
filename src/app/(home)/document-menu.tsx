import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, FilePenIcon, MoreVertical, TrashIcon } from 'lucide-react';
import { Id } from '../../../convex/_generated/dataModel';
import { RemoveDialog } from '@/components/remove-dialog';
import { RenameDialog } from '@/components/rename-dialog';

interface DocumentMenuProps {
	documentId: Id<'documents'>;
	title: string;
	onNewTab: (id: Id<'documents'>) => void;
}

export function DocumentMenu({ documentId, title, onNewTab }: DocumentMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<MoreVertical className="size-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => onNewTab(documentId)}>
					<ExternalLinkIcon className="size-4 mr-1" />
					Open in new tab
				</DropdownMenuItem>

				<RenameDialog documentId={documentId} initialTitle={title}>
					<DropdownMenuItem
						onSelect={(e) => e.preventDefault()}
						onClick={(e) => e.stopPropagation()}>
						<FilePenIcon className="size-4 mr-1" />
						Rename
					</DropdownMenuItem>
				</RenameDialog>

				<RemoveDialog documentId={documentId}>
					<DropdownMenuItem
						onSelect={(e) => e.preventDefault()}
						onClick={(e) => e.stopPropagation()}>
						<TrashIcon className="size-4 mr-1" />
						Remove
					</DropdownMenuItem>
				</RemoveDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
