'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface RenameDialogProps {
	children: React.ReactNode;
	documentId: Id<'documents'>;
	initialTitle: string;
}

export function RenameDialog({ children, documentId, initialTitle }: RenameDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [title, setTitle] = useState(initialTitle || '');
	const update = useMutation(api.documents.updateById);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdating(true);
		await update({ id: documentId, title });
		setIsUpdating(false);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename document</DialogTitle>
					<DialogDescription>Enter a new title for your document.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						placeholder="Document title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<DialogFooter className="flex justify-end">
						<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!title || isUpdating}>
							{isUpdating ? 'Updating...' : 'Rename'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
