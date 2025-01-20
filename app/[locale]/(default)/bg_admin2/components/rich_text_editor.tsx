import React, { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import ResizableImage from 'tiptap-extension-resize-image'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { HexColorPicker } from 'react-colorful'
import * as Popover from '@radix-ui/react-popover'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Bold,
  Italic,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Palette,
  Highlighter,
  ArrowLeftToLine,
  ArrowRightToLine,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [color, setColor] = useState('#000000')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'link' | 'image'>('link')
  const [dialogInput, setDialogInput] = useState('')
  //const [highlights, setHighlights] = useState<string>('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-4',
        },
      }),
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Highlight,
      Color,
      Link,
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'resize-image',
        },
      }),
      Image,
      Underline,
      TextStyle,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none overflow-y-auto',
      },
    },
  })

  const openDialog = (type: 'link' | 'image', initialValue: string = 'https://') => {
    setDialogType(type)
    setDialogInput(initialValue)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setDialogInput('')
  }

  const handleDialogSubmit = () => {
    if (dialogType === 'link') {
      if (editor?.getAttributes('link').href) {
        editor?.chain().focus().extendMarkRange('link').setLink({ href: dialogInput }).run()
      } else {
        editor?.chain().focus().toggleLink({ href: dialogInput }).run()
      }
    } else if (dialogType === 'image') {
      editor?.chain().focus().setImage({ src: dialogInput }).run()
    }
    closeDialog()
  }

  const addImage = useCallback(() => {
    openDialog('image')
  }, [])

  const addLink = useCallback(() => {
    const selection = editor?.state.selection
    const selectedText = selection ? editor?.state.doc.textBetween(selection.from, selection.to) : ''
    const existingLink = editor?.getAttributes('link').href || ''
    openDialog('link', existingLink || selectedText || 'https://')
  }, [editor])

  const setTextColor = useCallback((newColor: string) => {
    editor?.chain().focus().setColor(newColor).run()
  }, [editor])

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getHTML()
      if (currentContent !== content) {
        editor.commands.setContent(content, false)
      }
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={`p-1 hover:bg-gray-100 rounded`}
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={`p-1 hover:bg-gray-100 rounded`}
        >
          <Redo className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-2" />
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'highlight' }) ? 'bg-gray-200' : ''}`}
        >
        <Highlighter className="w-4 h-4" />
        </button>
        
        <span className="w-px h-4 bg-gray-300 mx-2" />
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={`p-1 sm:p-2 hover:bg-gray-100 rounded`}
        >
            <ArrowLeftToLine className="w-4 h-4" />
        </button>

        <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={`p-1 sm:p-2 hover:bg-gray-100 rounded`}
        >
            <ArrowRightToLine className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-2" />
        
        <button
          onClick={addLink}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={addImage}
          className={`p-1 sm:p-2 hover:bg-gray-100 rounded`}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className={`p-1 sm:p-2 hover:bg-gray-100 rounded`}
              aria-label="Open color picker"
            >
              <Palette className="w-4 h-4" style={{ color: color }} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="bg-white p-2 rounded-lg shadow-lg">
              <div className="space-y-2">
                <HexColorPicker color={color} onChange={setColor} />
                <button
                  onClick={() => {
                    setTextColor(color)
                    editor.chain().focus().run()
                  }}
                  className="w-full px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply Color
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      
      <EditorContent editor={editor} className="p-5 h-70 overflow-y-auto resize-y min-h-[16rem] max-h-[40rem] h-[300px] lg:h-[450px] " />

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-5/6 max-w-lg">
            <Dialog.Title className="text-lg font-bold mb-4">
              {dialogType === 'link' ? 'Insert Link' : 'Insert Image'}
            </Dialog.Title>
            <input
              type="text"
              value={dialogInput}
              onChange={(e) => setDialogInput(e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDialogSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Insert
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}