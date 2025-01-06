'use client';
// Import Dependencies
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CirclePicker, SketchPicker, type ColorResult } from 'react-color';
import { type Level } from '@tiptap/extension-heading';
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	ChevronDownIcon,
	HighlighterIcon,
	ImageIcon,
	ItalicIcon,
	Link2Icon,
	ListCollapseIcon,
	ListIcon,
	ListOrderedIcon,
	ListTodoIcon,
	LucideIcon,
	MessageSquarePlusIcon,
	MinusIcon,
	PlusIcon,
	PrinterIcon,
	Redo2Icon,
	RemoveFormattingIcon,
	SearchIcon,
	SpellCheckIcon,
	UnderlineIcon,
	Undo2Icon,
	UploadIcon,
} from 'lucide-react';
import { useEditorStore } from '@/store/use-editor-store';
import { Separator } from '@/components/ui/separator';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

// Types
interface ToolbarButtonProps {
	onClick?: () => void;
	isActive?: boolean;
	icon: LucideIcon;
}

// Components

const FontSizeButton = () => {
	const { editor } = useEditorStore();

	const currentFontSize =
		editor?.getAttributes('textStyle').fontSize?.replace('px', '') || '16';

	const [fontSize, setFontSize] = useState<string>(currentFontSize);
	const [inputValue, setInputValue] = useState<string>(fontSize);
	const [isEditind, setIsEditind] = useState(false);

	const clampFontSize = (size: number) => Math.min(72, Math.max(8, size));

	const updateFontSize = (newSize: string) => {
		const size = parseInt(newSize);

		if (!isNaN(size)) {
			editor?.chain().focus().setFontSize(`${size}px`).run();
			setFontSize(newSize);
			setInputValue(newSize);
			setIsEditind(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleInputBlur = () => {
		updateFontSize(inputValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			updateFontSize(inputValue);
			editor?.commands.focus();
		}
	};

	const increment = () => {
		const newSize = clampFontSize(parseInt(currentFontSize) + 1);
		updateFontSize(newSize.toString());
	};

	const decrement = () => {
		const newSize = clampFontSize(parseInt(currentFontSize) - 1);
		updateFontSize(newSize.toString());
	};

	return (
		<div className="flex items-center gap-x-0.5">
			<button
				className="w-7 h-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
				onClick={decrement}
				disabled={parseInt(fontSize) <= 8}>
				<MinusIcon className="size-4" />
			</button>
			{isEditind ? (
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					onKeyDown={handleKeyDown}
					className={`w-10 h-7 text-sm text-center border ${
						isNaN(parseInt(inputValue)) ||
						parseInt(inputValue) < 8 ||
						parseInt(inputValue) > 72
							? 'border-red-500'
							: 'border-neutral-400'
					} rounded-sm bg-transparent focus:outline-none focus:ring-0`}
				/>
			) : (
				<button
					className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm hover:bg-neutral-200/80"
					onClick={() => {
						setIsEditind(true);
						setFontSize(currentFontSize);
					}}>
					{currentFontSize}
				</button>
			)}

			<button
				className="w-7 h-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
				onClick={increment}
				disabled={parseInt(fontSize) >= 72}>
				<PlusIcon className="size-4" />
			</button>
		</div>
	);
};

const LineHeightButton = () => {
	const { editor } = useEditorStore();

	const lineHeights = [
		{ label: 'Default', value: 'normal' },
		{ label: 'Single', value: '1' },
		{ label: '1.15', value: '1.15' },
		{ label: '1.5', value: '1.5' },
		{ label: 'Double', value: '2' },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<ListCollapseIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{lineHeights.map(({ label, value }) => (
					<button
						key={value}
						onClick={() => editor?.chain().focus().setLineHeight(value).run()}
						className={cn(
							'flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
							{
								'bg-neutral-200/80':
									editor?.getAttributes('textStyle').lineHeight === value,
							}
						)}>
						<span className="truncate">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ListButton = () => {
	const { editor } = useEditorStore();

	const lists = [
		{
			label: 'Bullet List',
			icon: ListIcon,
			isActive: () => editor?.isActive('bulletList'),
			onClick: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			label: 'Ordered List',
			icon: ListOrderedIcon,
			isActive: () => editor?.isActive('orderedList'),
			onClick: () => editor?.chain().focus().toggleOrderedList().run(),
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<ListIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{lists.map(({ label, icon: Icon, isActive, onClick }) => (
					<button
						key={label}
						className={cn(
							'flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
							isActive() && 'bg-neutral-200/80'
						)}
						onClick={onClick}>
						<Icon className="size-4" />
						<span>{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const AlignButton = () => {
	const { editor } = useEditorStore();

	const alignments = [
		{
			label: 'Align Left',
			value: 'left',
			icon: AlignLeftIcon,
		},
		{
			label: 'Align Center',
			value: 'center',
			icon: AlignCenterIcon,
		},
		{
			label: 'Align Right',
			value: 'right',
			icon: AlignRightIcon,
		},
		{
			label: 'Align Justify',
			value: 'justify',
			icon: AlignJustifyIcon,
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<AlignLeftIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{alignments.map(({ label, value, icon: Icon }) => (
					<button
						key={value}
						onClick={() => editor?.chain().focus().setTextAlign(value).run()}
						className={cn(
							'flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
							editor?.isActive({ textAlign: value }) && 'bg-neutral-200/80'
						)}>
						<Icon className="size-4" />
						<span className="truncate text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const LinkButton = () => {
	const { editor } = useEditorStore();

	const [value, setValue] = useState('');

	const onChange = (href: string) => {
		editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
		setValue('');
	};

	return (
		<DropdownMenu
			onOpenChange={(open) => open && setValue(editor?.getAttributes('link').href || '')}>
			<DropdownMenuTrigger asChild>
				<button className="text-sm h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
					<Link2Icon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
				<Input
					placeholder="https://example.com"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button onClick={() => onChange(value)}>Apply</Button>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ImageButton = () => {
	const { editor } = useEditorStore();

	const [imageUrl, setImageUrl] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const onChange = (src: string) => {
		editor?.chain().focus().setImage({ src }).run();
	};

	const onUpload = () => {
		// Create an input element to select a file
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';

		// Handle the file selection
		input.onchange = (event) => {
			const file = (event.target as HTMLInputElement)?.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				if (result) {
					editor?.chain().focus().setImage({ src: result }).run();
				}
			};
			reader.readAsDataURL(file);
		};

		// Trigger the file input dialog
		input.click();
	};

	const handleImageUrlSubmit = () => {
		if (imageUrl) {
			onChange(imageUrl);
			setImageUrl('');
			setIsDialogOpen(false);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="text-sm h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden">
						<ImageIcon className="size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={onUpload}>
						<UploadIcon className="mr-2 size-4" />
						Upload
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
						<SearchIcon className="mr-2 size-4" />
						Paste URL
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent aria-description="Insert image URL" aria-describedby={undefined}>
					<DialogHeader>
						<DialogTitle>Insert Image URL</DialogTitle>
					</DialogHeader>
					<Input
						placeholder="Insert image URL"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleImageUrlSubmit()}
					/>

					<DialogFooter>
						<Button onClick={handleImageUrlSubmit}>Insert</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

const HighlightColorButton = () => {
	const { editor } = useEditorStore();

	const value = editor?.getAttributes('highlight').color || '#FFFFFF';

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
			<DropdownMenuContent className="p-0">
				<SketchPicker color={value} onChange={onChange} />
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
				onClick: () => editor?.chain().focus().addPendingComment().run(),
				isActive: editor?.isActive('liveblocksCommentMark'),
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
			<FontSizeButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			{sections[1].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}

			<TextColorButton />
			<HighlightColorButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			<LinkButton />
			<ImageButton />
			<AlignButton />
			<LineHeightButton />
			<ListButton />
			{sections[2].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}
		</div>
	);
};
