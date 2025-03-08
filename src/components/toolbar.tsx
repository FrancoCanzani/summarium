'use client';

import { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { BlockquoteToolbar } from '@/components/toolbars/blockquote';
import { BulletListToolbar } from '@/components/toolbars/bullet-list';
import { CodeToolbar } from '@/components/toolbars/code';
import { CodeBlockToolbar } from '@/components/toolbars/code-block';
import { HardBreakToolbar } from '@/components/toolbars/hard-break';
import { HorizontalRuleToolbar } from '@/components/toolbars/horizontal-rule';
import { OrderedListToolbar } from '@/components/toolbars/ordered-list';
import { RedoToolbar } from '@/components/toolbars/redo';
import { UndoToolbar } from './toolbars/undo';
import { ToolbarProvider } from '@/components/toolbars/toolbar-provider';
import { TranscribeToolbar } from './toolbars/transcribe';
import { Dispatch, SetStateAction } from 'react';
import { SpeechToolbar } from './toolbars/speech';
import { AssistantToolbar } from './toolbars/assistant';
import AiAssistantSheet from './ai-assistant-sheet';

export function Toolbar({
  editor,
  showAssistant,
  setShowAssistant,
  showTranscriber,
  setShowTranscriber,
  showSpeech,
  setShowSpeech,
}: {
  editor: Editor;
  showAssistant: boolean;
  setShowAssistant: Dispatch<SetStateAction<boolean>>;
  showTranscriber: boolean;
  setShowTranscriber: Dispatch<SetStateAction<boolean>>;
  showSpeech: boolean;
  setShowSpeech: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <ToolbarProvider editor={editor}>
      <div className='flex items-center justify-between gap-2 w-full overflow-x-auto'>
        <div className='flex items-center justify-start space-x-1.5'>
          <UndoToolbar />
          <RedoToolbar />
          <Separator orientation='vertical' className='h-7' />
          <BulletListToolbar />
          <OrderedListToolbar />
          <CodeToolbar />
          <CodeBlockToolbar />
          <HorizontalRuleToolbar />
          <BlockquoteToolbar />
          <HardBreakToolbar />
        </div>
        <div className='flex items-center justify-start space-x-2'>
          <TranscribeToolbar
            onClick={() => {
              setShowTranscriber(!showTranscriber);
            }}
            showTranscriber={showTranscriber}
          />
          <SpeechToolbar
            showSpeech={showSpeech}
            onClick={() => {
              setShowSpeech(!showSpeech);
            }}
          />
          <AssistantToolbar
            showAssistant={showAssistant}
            onClick={() => setShowAssistant(!showAssistant)}
          />
          <AiAssistantSheet editor={editor} />
        </div>
      </div>
    </ToolbarProvider>
  );
}
