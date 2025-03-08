'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RefreshCw,
  Ear,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import ButtonWithTooltip from './ui/button-with-tooltip';
import { deleteAudio } from '@/lib/api/audio';

export default function AudioPlayer({
  text,
  showSpeech,
}: {
  text: string;
  showSpeech: boolean;
}) {
  const [audioUrls, setAudioUrls] = useState<string[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { id } = useParams();

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fetchAudio = async () => {
    setIsLoading(true);
    setAudioUrls(null);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setTotalDuration(0);

    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }

      const { urls } = await response.json();
      setAudioUrls(urls);
    } catch (err) {
      console.error('Error fetching audio:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to fetch audio';
      toast.error(`Failed to generate audio. Please try again. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      clearTimer();
    } else {
      audioRef.current.play();
      timerRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
        }
      }, 1000);
    }

    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (audioUrls && currentTrackIndex < audioUrls.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(false);
      setPlaybackTime(0);
    } else {
      setCurrentTrackIndex(0);
      setIsPlaying(false);
      setPlaybackTime(0);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioUrls && audioUrls.length > 0) {
      setPlaybackTime(0);
      setIsPlaying(false);
      clearTimer();
    }
  }, [audioUrls]);

  useEffect(() => {
    if (audioUrls && audioUrls.length > 0 && audioRef.current) {
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setTotalDuration((prev) => prev + audio.duration);
      };

      const handleEnded = () => {
        clearTimer();
        setIsPlaying(false);
        setPlaybackTime(0);

        if (currentTrackIndex < audioUrls.length - 1) {
          handleNextTrack();
          setTimeout(() => {
            setIsPlaying(true);
            audioRef.current?.play();
            timerRef.current = setInterval(() => {
              if (audioRef.current) {
                setPlaybackTime(audioRef.current.currentTime);
              }
            }, 1000);
          }, 200);
        } else {
          setCurrentTrackIndex(0);
        }
      };

      const handleError = (error: Event) => {
        console.error('Audio playback error:', error);
        toast.error('Error during audio playback.');
        setIsPlaying(false);
        clearTimer();
        setAudioUrls(null);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioUrls, currentTrackIndex]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (audioUrls && audioUrls.length > 0) {
        audioUrls.forEach(async (url) => {
          const filename = url.substring(url.lastIndexOf('/') + 1);
          await deleteAudio(filename);
        });
      }
    };
  }, [audioUrls]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  const currentAudioUrl = audioUrls ? audioUrls[currentTrackIndex] : null;

  return (
    <div
      className={cn(
        'space-y-2 w-80 z-50 hidden transition-all opacity-0 duration-300 bg-background border rounded-md p-2',
        showSpeech && 'block opacity-100'
      )}
    >
      <h6 className='font-medium capitalize text-sm text-gray-600'>
        Text to Speech
      </h6>
      <div className='flex items-center justify-start'>
        {audioUrls && currentAudioUrl && audioUrls.length > 0 && (
          <audio
            ref={audioRef}
            src={currentAudioUrl}
            preload='metadata'
            onEnded={handleNextTrack}
          />
        )}

        <div className='flex justify-between items-center w-full space-x-1.5'>
          <div className='flex justify-start items-center space-x-1.5'>
            <ButtonWithTooltip
              tooltipText='Generate audio'
              variant='outline'
              size='xs'
              className='text-gray-500 cursor-pointer rounded-sm'
              onClick={fetchAudio}
              disabled={isLoading || !text}
            >
              {isLoading ? (
                <RefreshCw className='size-3.5 animate-spin' />
              ) : (
                <Ear className='size-4' />
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltipText={isPlaying ? 'Pause' : 'Play'}
              variant='outline'
              size='xs'
              onClick={handlePlayPause}
              disabled={isLoading}
              className='cursor-pointer rounded-sm text-gray-500'
            >
              {isPlaying ? (
                <Pause className='size-3.5' />
              ) : (
                <Play className='size-3.5' />
              )}
            </ButtonWithTooltip>
          </div>
          <div className='flex justify-end items-center space-x-2'>
            <div className='flex justify-center items-center space-x-1.5'>
              <ButtonWithTooltip
                tooltipText='Decrease playback rate'
                variant='outline'
                size='xs'
                onClick={() => handlePlaybackRateChange(playbackRate - 0.5)}
                disabled={playbackRate == 0.5 || isLoading}
                className='cursor-pointer rounded-sm text-gray-500'
              >
                <ChevronLeft className='size-3.5' />
              </ButtonWithTooltip>
              <span className='text-xs flex items-center justify-center text-gray-500 uppercase h-6 px-2 rounded-sm border'>
                {playbackRate}x
              </span>
              <ButtonWithTooltip
                tooltipText='Increase playback rate'
                variant='outline'
                size='xs'
                onClick={() => handlePlaybackRateChange(playbackRate + 0.5)}
                disabled={playbackRate == 2.5 || isLoading}
                className='cursor-pointer rounded-sm text-gray-500'
              >
                <ChevronRight className='size-3.5' />
              </ButtonWithTooltip>
            </div>
            <span className='text-sm font-medium text-gray-500'>
              {formatTime(playbackTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
