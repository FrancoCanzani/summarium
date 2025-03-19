"use client";

import { useState, useEffect } from "react";
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

  const fuse = new Fuse(notes, {
    keys: ["title", "content"],
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    ignoreLocation: true,
  });

  useEffect(() => {
    if (searchQuery) {
      const results = fuse.search(searchQuery);
      console.log(results);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSearchQuery("");
          setSearchResults([]);
        }
      }}
    >
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
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        <div className="max-h-[60vh] overflow-y-auto text-sm">
          {searchResults && searchResults.length > 0 ? (
            <div className="space-y-2 flex flex-col">
              {searchResults.map((result) => (
                <Link
                  key={result.item.id}
                  href={`notes/${result.item.id}`}
                  className="p-2 rounded-sm hover:bg-muted cursor-pointer"
                >
                  <h3 className="font-medium">{result.item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    {result.item.created_at && (
                      <span className="text-xs text-muted-foreground">
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
