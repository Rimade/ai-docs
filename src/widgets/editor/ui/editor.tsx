'use client';

import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import ImageResize from 'tiptap-extension-resize-image';
import { useEditor, EditorContent } from '@tiptap/react';
import { useStorage } from '@liveblocks/react/suspense';
import { useLiveblocksExtension } from '@liveblocks/react-tiptap';
import { useEditorStore } from '@/shared/models/stores/use-editor-store';
import { FontSizeExtension } from '@/shared/lib/extensions/font-size';
import { LineHeightExtension } from '@/shared/lib/extensions/line-height';
import { Ruler } from '@/app/documents/[documentId]/ruler';
import { Threads } from '@/app/documents/[documentId]/threads';
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/shared/lib/constants';

interface EditorProps {
  initialContent?: string | undefined;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const leftMargin = useStorage(root => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage(root => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;

  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true
  });
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    onCreate: ({ editor }) => setEditor(editor),
    onDestroy: () => setEditor(null),
    onUpdate: ({ editor }) => setEditor(editor),
    onSelectionUpdate: ({ editor }) => setEditor(editor),
    onTransaction: ({ editor }) => setEditor(editor),
    onFocus: ({ editor }) => setEditor(editor),
    onBlur: ({ editor }) => setEditor(editor),
    onContentError: ({ editor }) => setEditor(editor),

    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text'
      }
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        // The Liveblocks extension comes with its own history handling
        history: false
      }),
      FontSizeExtension,
      LineHeightExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https://example.com'
      }),
      FontFamily,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'right', 'center', 'justify']
      }),
      Highlight.configure({ multicolor: true }),
      Color.configure({
        types: ['textStyle']
      }),
      Underline,
      Table,
      TableCell,
      ImageResize,
      TableHeader,
      TableRow,
      TaskItem.configure({
        nested: true
      }),
      TaskList
    ],
    autofocus: true,
    immediatelyRender: false,
    content: ''
  });

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
      <Threads editor={editor} />
    </div>
  );
};
