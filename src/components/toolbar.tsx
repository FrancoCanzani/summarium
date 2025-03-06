'use client';

import { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { BlockquoteToolbar } from '@/components/toolbars/blockquote';
import { BoldToolbar } from '@/components/toolbars/bold';
import { BulletListToolbar } from '@/components/toolbars/bullet-list';
import { CodeToolbar } from '@/components/toolbars/code';
import { CodeBlockToolbar } from '@/components/toolbars/code-block';
import { HardBreakToolbar } from '@/components/toolbars/hard-break';
import { HorizontalRuleToolbar } from '@/components/toolbars/horizontal-rule';
import { ItalicToolbar } from '@/components/toolbars/italic';
import { OrderedListToolbar } from '@/components/toolbars/ordered-list';
import { RedoToolbar } from '@/components/toolbars/redo';
import { UndoToolbar } from './toolbars/undo';
import { UnderlineToolbar } from './toolbars/underline';
import { HighlightToolbar } from './toolbars/highlight';
import { StrikeThroughToolbar } from '@/components/toolbars/strikethrough';
import { ToolbarProvider } from '@/components/toolbars/toolbar-provider';
import { TranscribeToolbar } from './toolbars/transcribe';

import AudioTranscriber from './audio-transcriber';

import { useState } from 'react';

export function Toolbar({ editor }: { editor: Editor }) {
  const [showTranscriber, setShowTranscriber] = useState(false);

  return (
    <ToolbarProvider editor={editor}>
      <div className='flex mt-[1.25em] thin-scrollbar items-center justify-between gap-2 w-full overflow-x-scroll'>
        <div className='flex items-center justify-start space-x-2'>
          <UndoToolbar />
          <RedoToolbar />
          <Separator orientation='vertical' className='h-7' />
          <BoldToolbar />
          <ItalicToolbar />
          <StrikeThroughToolbar />
          <UnderlineToolbar />
          <HighlightToolbar />
          <BulletListToolbar />
          <OrderedListToolbar />
          <CodeToolbar />
          <CodeBlockToolbar />
          <HorizontalRuleToolbar />
          <BlockquoteToolbar />
          <HardBreakToolbar />
        </div>
        <div>
          <TranscribeToolbar
            onClick={() => setShowTranscriber(!showTranscriber)}
            showTranscriber={showTranscriber}
          />
          <AudioTranscriber
            editor={editor}
            showTranscriber={showTranscriber}
            setShowTranscriber={setShowTranscriber}
          />
        </div>
      </div>
    </ToolbarProvider>
  );
}
