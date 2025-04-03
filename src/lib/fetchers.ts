import { Note } from "./types";

export const fetchNote = async (id: string): Promise<Note> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/note/${id}`,
    {
      cache: "force-cache",
      next: {
        tags: [`note-${id}`],
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch note");
  }
  return response.json();
};
