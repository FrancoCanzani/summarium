import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Ear } from 'lucide-react';

export function SpeechToolbar({
  onClick,
  showSpeech,
}: {
  onClick?: (e: React.MouseEvent) => void;
  showSpeech: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn('h-8 w-8', showSpeech && 'bg-accent')}
          onClick={(e) => {
            onClick?.(e);
          }}
        >
          <Ear className='size-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Text to speech</span>
        <span className='ml-1 text-xs text-gray-11'>(cmd + s)</span>
      </TooltipContent>
    </Tooltip>
  );
}
