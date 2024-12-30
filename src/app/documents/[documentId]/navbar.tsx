'use client';

import Image from 'next/image';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '@/components/ui/menubar';

import {
	BoldIcon,
	FileIcon,
	FileJsonIcon,
	FilePenIcon,
	FilePlusIcon,
	FileTextIcon,
	GlobeIcon,
	ItalicIcon,
	PrinterIcon,
	Redo2Icon,
	RemoveFormattingIcon,
	StrikethroughIcon,
	TableIcon,
	TextIcon,
	Trash2Icon,
	UnderlineIcon,
	Undo2Icon,
} from 'lucide-react';
import { BsFilePdf } from 'react-icons/bs';
import { DocumentInput } from './document-input';
import { useEditorStore } from '@/store/use-editor-store';
import { Editor } from '@tiptap/react';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import {
	TooltipContent,
	TooltipTrigger,
	Tooltip,
	TooltipProvider,
} from '@/components/ui/tooltip';

interface PDFOptions {
	orientation: 'portrait' | 'landscape';
	fontSize: number;
	pageSize?: string;
	margins?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
}

export const Navbar = () => {
	const { editor } = useEditorStore();

	const insertTable = (rows: number, cols: number) => {
		editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
	};

	const handleError = (context: string, error: unknown) => {
		console.error(`${context}:`, error);
		displayError(`${context}. Please try again.`);
	};

	const validateEditor = (editor: Editor | null, message: string) => {
		if (!editor) {
			throw new Error(message);
		}
	};

	const displayError = (message: string) => {
		console.log(message); // Replace this with a non-intrusive UI notification system, e.g., a toast message.
	};

	const downloadFile = async (content: string, type: string, filename: string) => {
		try {
			validateEditor(editor, 'Content is empty or invalid.');

			const fileSizeInMB = new Blob([content]).size / (1024 * 1024);
			if (fileSizeInMB > 10) {
				throw new Error('File size exceeds 10MB limit');
			}

			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const filenameWithTimestamp = `${filename.split('.')[0]}_${timestamp}.${
				filename.split('.')[1]
			}`;

			const blob = new Blob([content], { type });
			saveAs(blob, filenameWithTimestamp);
		} catch (error) {
			handleError('Error downloading file', error);
		}
	};

	const generatePDF = async (
		content: string,
		filename: string,
		options: PDFOptions = {
			orientation: 'portrait',
			fontSize: 12,
			pageSize: 'a4',
			margins: { top: 10, right: 10, bottom: 10, left: 10 },
		}
	) => {
		try {
			validateEditor(editor!, 'Editor is not defined.');

			const doc = new jsPDF({
				orientation: options.orientation,
				unit: 'mm',
				format: options.pageSize || 'a4',
			});

			doc.setFontSize(options.fontSize);

			doc.setProperties({
				title: filename,
				subject: 'Document Export',
				author: 'Document Editor',
				keywords: 'document, export, pdf',
				creator: 'Document Editor',
			});

			await doc.html(content, {
				callback: (doc) => {
					const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
					const filenameWithTimestamp = `${filename.split('.')[0]}_${timestamp}.pdf`;
					doc.save(filenameWithTimestamp);
				},
				x: options.margins?.left || 10,
				y: options.margins?.top || 10,
				width:
					doc.internal.pageSize.getWidth() -
					((options.margins?.left || 10) + (options.margins?.right || 10)),
				windowWidth: 1024,
			});
		} catch (error) {
			handleError('Error generating PDF', error);
		}
	};

	const saveJSON = async (editor: Editor) => {
		try {
			validateEditor(editor, 'Editor is not defined.');
			const content = editor.getJSON();
			if (!content) {
				throw new Error('No content available to save.');
			}
			await downloadFile(
				JSON.stringify(content, null, 2),
				'application/json',
				'document.json'
			);
		} catch (error) {
			handleError('Error saving JSON', error);
		}
	};

	const saveHTML = async (editor: Editor) => {
		try {
			validateEditor(editor, 'Editor is not defined.');
			const content = editor.getHTML();
			if (!content) {
				throw new Error('No content available to save.');
			}

			const styledContent = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; }
						table { border-collapse: collapse; width: 100%; }
						td, th { border: 1px solid #ddd; padding: 8px; }
					</style>
				</head>
				<body>${content}</body>
				</html>
			`;

			await downloadFile(styledContent, 'text/html', 'document.html');
		} catch (error) {
			handleError('Error saving HTML', error);
		}
	};

	const savePDF = async (editor: Editor) => {
		try {
			validateEditor(editor, 'Editor is not defined.');
			const content = editor.getHTML();
			if (!content) {
				throw new Error('No content available to generate PDF.');
			}
			await generatePDF(content, 'document.pdf');
		} catch (error) {
			handleError('Error saving PDF', error);
		}
	};

	const saveText = async (editor: Editor) => {
		try {
			validateEditor(editor, 'Editor is not defined.');
			const content = editor.getText();
			if (!content) {
				throw new Error('No content available to save as text.');
			}
			await downloadFile(content, 'text/plain', 'document.txt');
		} catch (error) {
			handleError('Error saving text', error);
		}
	};

	return (
		<nav className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-200">
			<div className="flex gap-2 items-center">
				<Link href="/">
					<Image src="/icons/logo.png" alt="logo" width={36} height={36} />
				</Link>
				<div className="flex flex-col">
					<DocumentInput />
					<div className="flex">
						<Menubar className="bg-transparent shadow-none h-auto p-0 border-none">
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
									File
								</MenubarTrigger>
								<MenubarContent className="print:hidden">
									<MenubarSub>
										<MenubarSubTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
											<FileIcon className="size-4 mr-2" />
											Save
										</MenubarSubTrigger>
										<MenubarSubContent>
											<MenubarItem onClick={() => editor && saveJSON(editor)}>
												<FileJsonIcon className="size-4 mr-2" />
												JSON
											</MenubarItem>
											<MenubarItem onClick={() => editor && saveHTML(editor)}>
												<GlobeIcon className="size-4 mr-2" />
												HTML
											</MenubarItem>
											<MenubarItem onClick={() => editor && savePDF(editor)}>
												<BsFilePdf className="size-4 mr-2" />
												PDF
											</MenubarItem>
											<MenubarItem onClick={() => editor && saveText(editor)}>
												<FileTextIcon className="size-4 mr-2" />
												Text
											</MenubarItem>
										</MenubarSubContent>
									</MenubarSub>
									<MenubarItem onClick={() => editor?.commands.clearContent()}>
										<FilePlusIcon className="size-4 mr-2" />
										New Document
									</MenubarItem>
									<MenubarSeparator />
									<MenubarItem>
										<FilePenIcon className="size-4 mr-2" />
										Rename
									</MenubarItem>
									<MenubarItem>
										<Trash2Icon className="size-4 mr-2" />
										Remove
									</MenubarItem>
									<MenubarSeparator />
									<MenubarItem onClick={() => window.print()}>
										<PrinterIcon className="size-4 mr-2" />
										Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
									Edit
								</MenubarTrigger>
								<MenubarContent>
									<MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
										<Undo2Icon className="size-4 mr-2" />
										Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
									</MenubarItem>
									<MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
										<Redo2Icon className="size-4 mr-2" />
										Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
									Insert
								</MenubarTrigger>
								<MenubarContent>
									<MenubarSub>
										<MenubarSubTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
											<TableIcon className="size-4 mr-2" />
											Table
										</MenubarSubTrigger>
										<MenubarSubContent>
											<MenubarItem onClick={() => insertTable(1, 1)}>
												<FilePlusIcon className="size-4 mr-2" />1 x 1
											</MenubarItem>
											<MenubarItem onClick={() => insertTable(2, 2)}>
												<FilePlusIcon className="size-4 mr-2" />2 x 2
											</MenubarItem>
											<MenubarItem onClick={() => insertTable(3, 3)}>
												<FilePlusIcon className="size-4 mr-2" />3 x 3
											</MenubarItem>
											<MenubarItem onClick={() => insertTable(4, 4)}>
												<FilePlusIcon className="size-4 mr-2" />4 x 4
											</MenubarItem>
										</MenubarSubContent>
									</MenubarSub>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
									Format
								</MenubarTrigger>
								<MenubarContent>
									<MenubarSub>
										<MenubarSubTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
											<TextIcon className="size-4 mr-2" />
											Text
										</MenubarSubTrigger>
										<MenubarSubContent>
											<MenubarItem
												onClick={() => editor?.chain().focus().toggleBold().run()}>
												<BoldIcon className="size-4 mr-2" />
												Bold&nbsp;
												<MenubarShortcut>Ctrl+B</MenubarShortcut>
											</MenubarItem>
											<MenubarItem
												onClick={() => editor?.chain().focus().toggleItalic().run()}>
												<ItalicIcon className="size-4 mr-2" />
												Italic&nbsp;
												<MenubarShortcut>Ctrl+I</MenubarShortcut>
											</MenubarItem>
											<MenubarItem
												onClick={() => editor?.chain().focus().toggleUnderline().run()}>
												<UnderlineIcon className="size-4 mr-2" />
												Underline&nbsp;
												<MenubarShortcut>Ctrl+U</MenubarShortcut>
											</MenubarItem>
											<MenubarItem
												onClick={() => editor?.chain().focus().toggleStrike().run()}>
												<StrikethroughIcon className="size-4 mr-2" />
												Strikethrough&nbsp;&nbsp;
												<MenubarShortcut>Ctrl+Shift+X</MenubarShortcut>
											</MenubarItem>
										</MenubarSubContent>
									</MenubarSub>
									<MenubarSeparator />
									<MenubarItem
										onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
										<RemoveFormattingIcon className="size-4 mr-2" />
										Remove Format&nbsp;
										<MenubarShortcut>Ctrl+Shift+N</MenubarShortcut>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					</div>
				</div>
			</div>
			<div className="flex gap-3 items-center shrink-0 pl-6">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<OrganizationSwitcher
								afterCreateOrganizationUrl="/"
								afterLeaveOrganizationUrl="/"
								afterSelectOrganizationUrl="/"
								afterSelectPersonalUrl="/"
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>Переключить организацию</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<UserButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Профиль пользователя</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</nav>
	);
};
