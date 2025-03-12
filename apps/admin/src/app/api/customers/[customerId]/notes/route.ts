import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const { data: notes, error } = await supabase
      .from("customer_notes")
      .select("*")
      .eq("customer_id", params.customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching customer notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { note } = body;

    if (!note || typeof note !== "string") {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const { data: customerNote, error } = await supabase
      .from("customer_notes")
      .insert({
        customer_id: params.customerId,
        note,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(customerNote);
  } catch (error) {
    console.error("Error creating customer note:", error);
    return NextResponse.json(
      { error: "Failed to create customer note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const noteId = url.searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("customer_notes")
      .delete()
      .eq("id", noteId)
      .eq("customer_id", params.customerId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer note:", error);
    return NextResponse.json(
      { error: "Failed to delete customer note" },
      { status: 500 }
    );
  }
} 