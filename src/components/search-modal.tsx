"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Note } from "@/lib/types";
import Link from "next/link";

interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  notes: Note[];
}

export default function SearchModal({
  isOpen,
  onClose,
  notes,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Fuse.FuseResult<Note>[]>(
    [],
  );

  const fuse = new Fuse(notes, {
    keys: ["title", "content"],
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    ignoreLocation: true,
  });

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery) {
      const results = fuse.search(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  // Helper function to determine if indices represent a full word match
  const isFullWordMatch = (text: string, start: number, end: number) => {
    const isStartOfWord = start === 0 || /\s/.test(text[start - 1]);
    const isEndOfWord = end === text.length - 1 || /\s/.test(text[end + 1]);
    return isStartOfWord && isEndOfWord;
  };

  // Merge adjacent or overlapping indices
  const mergeIndices = (indices: readonly [number, number][]) => {
    if (!indices.length) return [];

    const sorted = [...indices].sort((a, b) => a[0] - b[0]);
    const result: [number, number][] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = result[result.length - 1];

      // If current start is adjacent to or overlaps with previous end
      if (current[0] <= previous[1] + 1) {
        // Merge them by extending the end of the previous range
        previous[1] = Math.max(previous[1], current[1]);
      } else {
        // Otherwise add as a new range
        result.push(current);
      }
    }

    return result;
  };

  const highlightText = (
    text: string,
    matches?: readonly Fuse.FuseResultMatch[],
  ) => {
    if (!matches || !matches.length) return text;

    // Get the search terms to check for full word matches
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

    // Create a copy of the text to work with
    const result = [];
    const lastIndex = 0;

    // Get all matches for this field
    const fieldMatches = matches.filter(
      (match) => match.key === "title" || match.key === "content",
    );

    if (fieldMatches.length === 0) return text;

    // Process the text word by word
    const words = text.split(/(\s+)/);
    let position = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isWhitespace = /^\s+$/.test(word);

      if (isWhitespace) {
        // Just add whitespace as-is
        result.push(word);
        position += word.length;
      } else {
        // Check if this word should be highlighted (exact match with a search term)
        const shouldHighlight = searchTerms.some(
          (term) =>
            word.toLowerCase() === term ||
            // Also match words with punctuation attached
            word.toLowerCase().replace(/[.,;:!?]$/, "") === term,
        );

        if (shouldHighlight) {
          result.push(
            <span
              key={i}
              className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
            >
              {word}
            </span>,
          );
        } else {
          result.push(word);
        }

        position += word.length;
      }
    }

    return <>{result}</>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open}>
      <DialogTrigger className="p-2 hover:bg-accent font-medium text-xl h-12 border-b">
        Search
      </DialogTrigger>
      <DialogContent className="rounded-sm">
        <DialogHeader>
          <DialogTitle>Search Notes</DialogTitle>
        </DialogHeader>
        <Input
          type="search"
          placeholder="Type to search..."
          className="rounded-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        <div className="mt-2 max-h-[60vh] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((result) => (
                <Link
                  key={result.item.id}
                  href={`notes/${result.item.id}`}
                  className="p-2 rounded-sm hover:bg-muted cursor-pointer"
                >
                  <h3 className="font-medium">
                    {highlightText(result.item.title, result.matches)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {highlightText(result.item.content, result.matches)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-muted-foreground/20">
                      Match: {Math.round((1 - (result.score || 0)) * 100)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-center py-4 text-muted-foreground">
              No results found
            </p>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Start typing to search notes
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
