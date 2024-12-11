'use client';

import { cn } from '@/lib/utils';
import { CirclePicker, SketchPicker, type ColorResult } from 'react-color';
import { type Level } from '@tiptap/extension-heading';
import {
	BoldIcon,
	ChevronDownIcon,
	HighlighterIcon,
	ItalicIcon,
	ListTodoIcon,
	LucideIcon,
	MessageSquarePlusIcon,
	PrinterIcon,
	Redo2Icon,
	RemoveFormattingIcon,
	SpellCheckIcon,
	UnderlineIcon,
	Undo2Icon,
} from 'lucide-react';
import { useEditorStore } from '@/store/use-editor-store';
import { Separator } from '@/components/ui/separator';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarButtonProps {
	onClick?: () => void;
	isActive?: boolean;
	icon: LucideIcon;
}

const HighlightColorButton = () => {
	const { editor } = useEditorStore();

	const onChange = (color: ColorResult) => {
		editor?.chain().focus().setHighlight({ color: color.hex }).run();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<HighlighterIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2.5">
				<SketchPicker onChange={onChange} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const TextColorButton = () => {
	const { editor } = useEditorStore();

	const value = editor?.getAttributes('textStyle').color || '#000000';

	const onChange = (color: ColorResult) => {
		editor
			?.chain()
			.focus()
			.extendMarkRange('textStyle')
			.setMark('textStyle', { color: color.hex })
			.run();
		// editor?.chain().focus().setColor(color.hex).run();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<span className="text-sm select-none">A</span>
					<div className="h-0.5 w-full" style={{ backgroundColor: value }} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2.5">
				<CirclePicker color={value} onChange={onChange} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const FontFamilyButton = () => {
	const { editor } = useEditorStore();

	const fonts = [
		{ label: 'Arial', value: 'Arial' },
		{ label: 'Times New Roman', value: 'Times New Roman' },
		{ label: 'Courier New', value: 'Courier New' },
		{ label: 'Comic Sans', value: 'Comic Sans' },
		{ label: 'Georgia', value: 'Georgia' },
		{ label: 'Serif', value: 'Serif' },
		{ label: 'Verdana', value: 'Verdana' },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<span className="truncate">
						{editor?.getAttributes('textStyle').fontFamily || 'Arial'}
					</span>
					<ChevronDownIcon className="ml-2 size-4 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{fonts.map(({ label, value }) => (
					<button
						key={value}
						onClick={() => editor?.chain().focus().setFontFamily(value).run()}
						className={cn(
							'flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
							editor?.getAttributes('textStyle').fontFamily === value &&
								'bg-neutral-200/80'
						)}
						style={{ fontFamily: value }}>
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const HeadingLevelButton = () => {
	const { editor } = useEditorStore();

	const headings = [
		{ label: 'Normal text', value: 0, fontSize: '16px' },
		{ label: 'Heading 1', value: 1, fontSize: '32px' },
		{ label: 'Heading 2', value: 2, fontSize: '24px' },
		{ label: 'Heading 3', value: 3, fontSize: '20px' },
		{ label: 'Heading 4', value: 4, fontSize: '18px' },
		{ label: 'Heading 5', value: 5, fontSize: '16px' },
		{ label: 'Heading 6', value: 6, fontSize: '14px' },
	];

	const getCurrentHeading = () => {
		for (let level = 1; level <= 6; level++) {
			if (editor?.isActive('heading', { level })) {
				return `Heading ${level}`;
			}
		}

		return 'Normal';
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<span className="truncate">{getCurrentHeading()}</span>
					<ChevronDownIcon className="ml-2 size-4 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{headings.map(({ label, value, fontSize }) => (
					<button
						key={value}
						onClick={() => {
							if (value === 0) {
								editor?.chain().focus().setParagraph().run();
							} else {
								editor
									?.chain()
									.focus()
									.toggleHeading({ level: value as Level })
									.run();
							}
						}}
						style={{ fontSize }}
						className={cn(
							'flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
							(value === 0 && !editor?.isActive('heading')) ||
								(editor?.isActive('heading', { level: value }) && 'bg-neutral-200/80')
						)}>
						{label}
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
	onClick,
	isActive,
	icon: Icon,
}) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80',
				isActive && 'bg-neutral-200/80'
			)}>
			<Icon className="size-4" />
		</button>
	);
};

export const Toolbar: React.FC<{ className?: string }> = ({ className }) => {
	const { editor } = useEditorStore();
	const sections: {
		label: string;
		icon: LucideIcon;
		onClick: () => void;
		isActive?: boolean;
	}[][] = [
		[
			{
				label: 'Undo',
				icon: Undo2Icon,
				onClick: () => editor?.chain().focus().undo().run(),
			},
			{
				label: 'Redo',
				icon: Redo2Icon,
				onClick: () => editor?.chain().focus().redo().run(),
			},
			{
				label: 'Print',
				icon: PrinterIcon,
				onClick: () => window.print(),
			},
			{
				label: 'Spellcheck',
				icon: SpellCheckIcon,
				onClick: () => {
					const current = editor?.view.dom.getAttribute('spellcheck');
					editor?.view.dom.setAttribute(
						'spellcheck',
						current === 'false' ? 'true' : 'false'
					);
				},
			},
		],
		[
			{
				label: 'Bold',
				icon: BoldIcon,
				onClick: () => editor?.chain().focus().toggleBold().run(),
				isActive: editor?.isActive('bold'),
			},
			{
				label: 'Italic',
				icon: ItalicIcon,
				onClick: () => editor?.chain().focus().toggleItalic().run(),
				isActive: editor?.isActive('italic'),
			},
			{
				label: 'Underline',
				icon: UnderlineIcon,
				onClick: () => editor?.chain().focus().toggleUnderline().run(),
				isActive: editor?.isActive('underline'),
			},
		],
		[
			{
				label: 'Comment',
				icon: MessageSquarePlusIcon,
				onClick: () => console.log('TODO comment'),
				isActive: false, // TODO implement
			},
			{
				label: 'List Todo',
				icon: ListTodoIcon,
				onClick: () => editor?.chain().focus().toggleTaskList().run(),
				isActive: editor?.isActive('taskList'),
			},
			{
				label: 'Remove Formatting',
				icon: RemoveFormattingIcon,
				onClick: () => editor?.chain().focus().unsetAllMarks().run(),
			},
		],
	];
	return (
		<div
			className={cn(
				'bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto',
				className
			)}>
			{sections[0].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			<FontFamilyButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			<HeadingLevelButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			{/* TODO: Font size */}
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			{sections[1].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}

			<TextColorButton />
			<HighlightColorButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			{/* TODO: Link */}
			{/* TODO: Image */}
			{/* TODO: Align */}
			{/* TODO: Line height */}
			{/* TODO: List */}
			{sections[2].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}
		</div>
	);
};
