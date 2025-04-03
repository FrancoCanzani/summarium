import { Note } from "./types";

export const fetchNote = async (id: string): Promise<Note> => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "";

  const response = await fetch(`${baseUrl}/api/note/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch note");
  }
  return response.json();
};
