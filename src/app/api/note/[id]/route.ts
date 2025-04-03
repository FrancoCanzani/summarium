export const dynamic = 'force-static'

import { createClient } from "@/lib/supabase/server"
import { verifySessionAndGetUserId } from "@/lib/api/notes"
import { validateUUID } from "@/lib/utils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id: rawId } = await params;
    const result = validateUUID(rawId);

    if(!result.success) {
        return Response.json("Invalid UUID format", {status: 400} )
    }

    const id = result.data

    const userId = await verifySessionAndGetUserId()

    const supabase = await createClient();

    const { data: note, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

    if (error) {
        
        if (error.code === 'PGRST116') { 
            return Response.json(null); 
        } else {
            console.error("Error fetching note:", error);
            return Response.json({ error: "Failed to fetch note" }, { status: 500 });
        }
    }

    return Response.json(note);
}