import Editor from "@/components/editor";
import { Note } from "@/lib/types";
import { validateUUID } from "@/lib/utils";
import { headers } from "next/headers";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const result = validateUUID(rawId);

  if (!result.success) {
    return null
  }

  const id = result.data;
  
  try {
    const headersList = new Headers(headers())
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
    const response = await fetch(`${protocol}://${host}/api/note/${id}`, {
      headers: headersList,
      cache: 'force-cache',
      next: { tags: [`note-${id}`] }
    });

    if (!response.ok) {
      if (response.status === 404) {
        const initialNote: Note = {
          id,
          title: "New note",
          content: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return <Editor initialNote={initialNote} />;
      }
      
      console.error("Error fetching note:", response.status, response.statusText);
      return <div>Error loading note. Status: {response.status} {response.statusText}</div>;
    }

    const note = await response.json();
    return <Editor initialNote={note} />;
  } catch (error) {
    console.error("Error during fetch or JSON parsing:", error);
    return <div>Error loading note: {String(error)}</div>;
  }
}