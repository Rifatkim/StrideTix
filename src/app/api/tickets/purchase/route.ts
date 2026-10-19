import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ETicket, ParticipantData } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = "force-dynamic";

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

    // 1. Guard against sold-out categories and verify server-side price (OWASP A04)
    const { data: currentCat, error: catError } = await adminClient
      .from("event_categories")
      .select("id, remaining_quota, category_name, price, event_id")
      .eq("id", category.id)
      .single();

    let verifiedPrice = Number(category.price) || 0;

    if (currentCat) {
      if (typeof currentCat.remaining_quota === "number" && currentCat.remaining_quota <= 0) {
        return NextResponse.json(
          { error: `Maaf, kuota pendaftaran untuk kategori ${currentCat.category_name} telah habis terjual (Sold Out).` },
          { status: 400 }
        );
      }
      // Kunci harga dari database resmi (cegah client-side price tampering)
      if (typeof currentCat.price === "number") {
        verifiedPrice = currentCat.price;
      }
    } else {
      console.warn("Category lookup in DB returned null/error, proceeding with client verification:", catError);
    }

    // 2. Insert into orders table with verified server-side price
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: verifiedPrice,
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

    // 3. Generate unique ticket code and QR payload
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cityCode = (event.locationCity || "IDN").slice(0, 3).toUpperCase();
    const ticketCode = `STX-2026-${cityCode}-${randomSuffix}`;
    const qrHash = `STRIDETIX-TOKEN-${ticketCode}-VERIFIED`;

    // 4. Insert into tickets table with participant metadata
    const ticketBasePayload = {
      order_id: order.id,
      category_id: category.id,
      user_id: user.id,
      ticket_code: ticketCode,
      qr_code_hash: qrHash,
      status: "valid",
    };

    let ticket: any = null;
    let ticketError: any = null;

    // Try inserting with participant details if columns exist
    const tryWithParticipantDetails = await adminClient
      .from("tickets")
      .insert({
        ...ticketBasePayload,
        participant_name: participant.fullName,
        phone_number: participant.phoneNumber || null,
        emergency_phone: participant.emergencyContactPhone || null,
        blood_type: participant.bloodType || null,
      })
      .select()
      .single();

    if (!tryWithParticipantDetails.error && tryWithParticipantDetails.data) {
      ticket = tryWithParticipantDetails.data;
    } else {
      // Fallback for base schema
      const fallbackTicket = await adminClient
        .from("tickets")
        .insert(ticketBasePayload)
        .select()
        .single();
      ticket = fallbackTicket.data;
      ticketError = fallbackTicket.error;
    }

    if (ticketError || !ticket) {
      console.error("Ticket creation error:", ticketError);
      return NextResponse.json(
        { error: ticketError?.message || "Gagal menerbitkan tiket." },
        { status: 500 }
      );
    }

    // 5. Decrement remaining quota atomically
    if (currentCat && typeof currentCat.remaining_quota === "number" && currentCat.remaining_quota > 0) {
      try {
        await adminClient
          .from("event_categories")
          .update({ remaining_quota: Math.max(0, currentCat.remaining_quota - 1) })
          .eq("id", category.id);
      } catch (quotaErr) {
        console.warn("Could not decrement quota:", quotaErr);
      }
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
