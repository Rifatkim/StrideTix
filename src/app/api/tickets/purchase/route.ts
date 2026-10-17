import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ETicket, ParticipantData } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesi telah berakhir. Silakan masuk kembali." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { event, category, participant } = body as {
      event: {
        id: string;
        title: string;
        bannerImage: string;
        eventDate: string;
        startTime: string;
        locationVenue: string;
        locationCity: string;
      };
      category: {
        id: string;
        name: string;
        price: number;
      };
      participant: ParticipantData;
    };

    if (!category?.id || !event?.id) {
      return NextResponse.json(
        { error: "Data event atau kategori tiket tidak valid." },
        { status: 400 }
      );
    }

    // Use admin client with service_role to insert order and ticket safely bypassing client RLS
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 1. Insert into orders table
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: category.price,
        status: "paid",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: orderError?.message || "Gagal membuat pesanan." },
        { status: 500 }
      );
    }

    // 2. Generate unique ticket code and QR payload
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cityCode = (event.locationCity || "IDN").slice(0, 3).toUpperCase();
    const ticketCode = `STX-2026-${cityCode}-${randomSuffix}`;
    const qrHash = `STRIDETIX-TOKEN-${ticketCode}-VERIFIED`;

    // 3. Insert into tickets table
    const { data: ticket, error: ticketError } = await adminClient
      .from("tickets")
      .insert({
        order_id: order.id,
        category_id: category.id,
        user_id: user.id,
        ticket_code: ticketCode,
        qr_code_hash: qrHash,
        status: "valid",
      })
      .select()
      .single();

    if (ticketError || !ticket) {
      console.error("Ticket creation error:", ticketError);
      return NextResponse.json(
        { error: ticketError?.message || "Gagal menerbitkan tiket." },
        { status: 500 }
      );
    }

    // 4. Decrement remaining quota
    try {
      const { data: currentCat } = await adminClient
        .from("event_categories")
        .select("remaining_quota")
        .eq("id", category.id)
        .single();

      if (currentCat && currentCat.remaining_quota > 0) {
        await adminClient
          .from("event_categories")
          .update({ remaining_quota: currentCat.remaining_quota - 1 })
          .eq("id", category.id);
      }
    } catch (quotaErr) {
      console.warn("Could not decrement quota:", quotaErr);
    }

    const issuedTicket: ETicket = {
      ticketCode,
      orderId: order.id,
      eventId: event.id,
      eventTitle: event.title,
      eventBanner: event.bannerImage,
      eventDate: event.eventDate,
      startTime: event.startTime,
      venue: event.locationVenue,
      city: event.locationCity,
      categoryName: category.name as any,
      bibName: (participant.bibName || "RUNNER").toUpperCase(),
      participantName: participant.fullName,
      participantEmail: participant.email,
      status: "issued",
      qrPayload: qrHash,
      issuedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, ticket: issuedTicket });
  } catch (err: any) {
    console.error("Purchase ticket route error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
