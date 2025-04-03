import Editor from "@/components/editor";
import { Note } from "@/lib/types";
import { validateUUID } from "@/lib/utils";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const result = validateUUID(rawId);
  
  if(!result.success) {
    return Response.json("Invalid UUID format", {status: 400} )
}

  const id = result.data

  try {
    const response = await fetch(`https://symmetrical-broccoli-55w66qrx956cj5w-3000.app.github.dev/note/${id}`, { 
    /* If the Server Component makes a fetch call to a Route Handler, it doesn ‘t know to attach the original request ‘s headers and cookies.
    Browser → Server Component → Route Handler */
      headers: await headers(),
      cache: 'force-cache',
      next: { tags: [`note-${id}`] } 
    })


    const note = await response.json()

    const initialNote: Note = note ?? {
      id,
      title: "New note",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return <Editor initialNote={initialNote} />;
  } catch {
    notFound();
  }
}
