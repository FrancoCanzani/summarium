import { Note } from "./types";

export const fetchNote = async (id: string): Promise<Note> => {
  const response = await fetch(`http://localhost:3000/api/note/${id}`, {
    cache: "force-cache",
    next: {
      tags: [`note-${id}`],
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch note");
  }
  return response.json();
};
