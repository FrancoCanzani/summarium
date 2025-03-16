import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
} from 'lucide-react';

import { Extension, Editor } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

// Define Range type that was missing
interface Range {
  from: number;
  to: number;
}

export const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

// Types
interface CommandItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

interface CommandListProps {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
  range: Range;
}

// Command Item Component
const CommandItem: React.FC<{
  item: CommandItemProps;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ item, isSelected, onSelect }) => (
  <button
    className={`flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm text-stone-900 hover:bg-gray-100 ${
      isSelected ? 'bg-gray-100 text-stone-900' : ''
    }`}
    onClick={onSelect}
  >
    <div className='flex h-10 w-10 items-center justify-center rounded-sm border border-stone-200 bg-gray-50'>
      {item.icon}
    </div>
    <div>
      <p className='font-medium'>{item.title}</p>
      <p className='text-xs text-stone-500'>{item.description}</p>
    </div>
  </button>
);

// Command List Component
const CommandList: React.FC<CommandListProps> = ({
  items,
  command,
  editor,
  range,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        } else if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
        } else if (e.key === 'Enter') {
          selectItem(selectedIndex);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;
    const item = container?.children[selectedIndex] as HTMLElement;
    if (item && container) {
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.offsetHeight;

      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.offsetHeight;
      }
    }
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id='slash-command'
      ref={commandListContainer}
      className='z-50 bg-white no-scrollbar h-auto max-h-[330px] w-72 overflow-y-auto rounded-sm border border-stone-200 px-1 py-2 shadow-md transition-all'
    >
      {items.map((item: CommandItemProps, index: number) => (
        <CommandItem
          key={index}
          item={item}
          isSelected={index === selectedIndex}
          onSelect={() => selectItem(index)}
        />
      ))}
    </div>
  ) : null;
};

// Render Items Function
export const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: () => DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props: {
          ...props,
          command: (item: CommandItemProps) => {
            if (item) {
              item.command({ editor: props.editor, range: props.range });
              popup?.[0].hide();
            }
          },
        },
        editor: props.editor,
      });

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component?.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: () => DOMRect }) => {
      component?.updateProps({
        ...props,
        command: (item: CommandItemProps) => {
          if (item) {
            item.command({ editor: props.editor, range: props.range });
            popup?.[0].hide();
          }
        },
      });

      popup?.[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();
        return true;
      }

      return component?.ref?.onKeyDown?.(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

// Suggestion Items
export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Text',
      description: 'Start typing with plain text.',
      icon: <Text size={18} />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .run();
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      icon: <List size={18} />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    }
    return true;
  });
};
