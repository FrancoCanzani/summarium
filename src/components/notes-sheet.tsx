"use client";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Fuse from "fuse.js";
import { NotepadText } from "lucide-react";
import Link from "next/link";

import { ReactNode, useMemo, useState } from "react";

export default function NotesSheet({
  notes,
  children,
}: {
  notes: Note[];
  children?: ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: ["title", "sanitized_content"],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery) {
      // Sort notes by updated_at descending when no search query
      return [...notes].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, notes, fuse]);

  const nextNoteId = crypto.randomUUID();

  return (
    <Sheet open={open} onOpenChange={(openState) => setOpen(openState)}>
      <SheetTrigger asChild>
        {children ?? (
          <button className="hover:bg-muted group flex h-10 flex-1 items-center justify-center rounded-sm px-3 py-1.5">
            <NotepadText className="size-4.5" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[75%]" showClose={false}>
        <SheetHeader className="space-y-4 p-2">
          <div className="flex items-center justify-between pt-2">
            <SheetTitle className="text-xl font-medium">Notes</SheetTitle>
            <Link
              href={`/notes/${nextNoteId}`}
              onClick={() => setOpen(false)}
              className={cn(
                "hover:bg-muted -mx-2 block cursor-pointer rounded-sm px-3 py-2 transition-colors",
              )}
            >
              New
            </Link>
          </div>

          <Input
            type="search"
            placeholder="Search notes..."
            className="shadow-2xs h-12 w-full rounded-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredNotes.length > 0 ? (
            <ul className="space-y-1">
              {filteredNotes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "hover:bg-muted -mx-2 block cursor-pointer rounded-sm px-3 py-2 transition-colors",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-medium">
                        {note.title || "Untitled"}
                      </h3>
                      {note.updated_at && (
                        <span className="flex-shrink-0 pl-2 text-xs text-gray-500">
                          {formatDistanceToNow(new Date(note.updated_at), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                    {note.sanitized_content && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {note.sanitized_content}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? "No notes match your search."
                  : "You don't have any notes yet."}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
