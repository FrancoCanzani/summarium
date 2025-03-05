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
import { StrikeThroughToolbar } from '@/components/toolbars/strikethrough';
import { ToolbarProvider } from '@/components/toolbars/toolbar-provider';
import AudioTranscriber from './audio-transcriber';

import { useState } from 'react';

export function Toolbar({ editor }: { editor: Editor }) {
  const [showTranscriber, setShowTranscriber] = useState(false);

  return (
    <ToolbarProvider editor={editor}>
      <div className='flex items-center justify-start gap-2 max-w-3xl mx-auto'>
        <RedoToolbar />
        <Separator orientation='vertical' className='h-7' />
        <BoldToolbar />
        <ItalicToolbar />
        <StrikeThroughToolbar />
        <BulletListToolbar />
        <OrderedListToolbar />
        <CodeToolbar />
        <CodeBlockToolbar />
        <HorizontalRuleToolbar />
        <BlockquoteToolbar />
        <HardBreakToolbar />
        <button onClick={() => setShowTranscriber(!showTranscriber)}>
          Transcriber
        </button>
        <AudioTranscriber
          editor={editor}
          showTranscriber={showTranscriber}
          setShowTranscriber={setShowTranscriber}
        />
      </div>
    </ToolbarProvider>
  );
}
