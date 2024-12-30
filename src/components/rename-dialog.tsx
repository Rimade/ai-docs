'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
	const update = useMutation(api.documents.updateById);
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [title, setTitle] = useState(initialTitle);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsUpdating(true);
		update({ id: documentId, title: title.trim() || 'Untitled' })
			.then(() => {
				toast.success('Document renamed');
				setIsOpen(false);
			})
			.catch((error) => {
				toast.error('Failed to rename document');
				console.error(error);
			})
			.finally(() => {
				setIsUpdating(false);
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent onClick={(e) => e.stopPropagation()}>
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
						<Button
							type="button"
							variant="outline"
							disabled={isUpdating}
							onClick={(e) => {
								e.stopPropagation();
								setIsOpen(false);
							}}>
							Cancel
						</Button>
						<Button
							variant="default"
							type="submit"
							onClick={(e) => e.stopPropagation()}
							disabled={!title || isUpdating}>
							{isUpdating ? 'Saving...' : 'Save'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
