"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { FuseResult } from "fuse.js";
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
import { useQueryState } from "nuqs";

export default function SearchModal({ notes }: { notes: Note[] }) {
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [searchResults, setSearchResults] = useState<FuseResult<Note>[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fuse = useMemo(() => {
    if (notes?.length) {
      return new Fuse(notes, {
        keys: ["title", "content"],
        includeScore: true,
        includeMatches: true,
        threshold: 0.4,
        ignoreLocation: true,
      });
    }
    return null;
  }, [notes]);

  useEffect(() => {
    if (searchQuery && fuse) {
      const results = fuse.search(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, fuse]);

  const handleLinkClick = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSearchQuery("");
          setSearchResults([]);
        }
      }}
    >
      <DialogTrigger
        className="hover:bg-accent rounded-sm p-1.5 text-start"
        onClick={() => setIsOpen(true)}
      >
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
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <div className="max-h-[60vh] overflow-y-auto text-sm">
          {searchResults && searchResults.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {searchResults.map((result) => (
                <Link
                  key={result.item.id}
                  href={`/notes/${result.item.id}`}
                  onClick={() => handleLinkClick()}
                  className="hover:bg-muted cursor-pointer rounded-sm p-2"
                >
                  <h3 className="font-medium">
                    {result.item.title || "Untitled"}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    {result.item.created_at && (
                      <span className="text-muted-foreground text-xs">
                        {new Date(result.item.created_at).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs font-medium">
                      Match: {Math.round((1 - (result.score || 0)) * 100)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-muted-foreground py-4 text-center">
              No results found
            </p>
          ) : (
            <p className="text-muted-foreground py-4 text-center">
              Start typing to search notes
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
