import { supabase } from "../../supabaseClient";

export async function createUser(data) {
  const { error } = await supabase.from("users_tbl").insert({
    email: data.Email,
    password: data.password,
    username: data.username,
  });

  if (error) {
    console.log("error moy ay: ", error);
  }
}

export async function loginUser(email, password) {
  const { data: userdata, error } = await supabase
    .from("users_tbl")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error) {
    console.log("error mo ay: ", error);
    return null;
  }

  return data;
}

export async function createPayment(data) {
  const { error } = await supabase.from("payments_tbl").insert({
    trip_id: data.trip_id,
    seat_id: data.seat_id,
    status: data.status,
    paid_amount: data.paid_amount,
    payee_id: data.payee_id,
  });

  if (error) {
    console.log("error moy ay: ", error);
  }
}

export async function createBooking(data) {
  const { error } = await supabase.from("bookings_tbl").insert({
    trip_id: data.trip_id,
    seat_id: data.seat_id,
    payment_id: data.payment_id,
  });

  if (error) {
    console.log("error moy ay: ", error);
  }
}

export async function getTrips() {
  const { data, error } = await supabase.from("trips_tbl").select(`
      id,
      fare,
      distance,
      origin:cities_tbl!trips_tbl_origin_fkey (id, name),
      destination:cities_tbl!trips_tbl_destination_fkey (id, name)
    `);

  if (error) {
    console.log("error moy ay: ", error);
    return [];
  }

  return data;
}

export async function getUserBookings(user_id) {
  const { data, error } = await supabase
    .from("bookings_tbl")
    .select(
      `
      id,
      trip_id,
      seat_id,
      payment:payments_tbl!bookings_tbl_payment_id_fkey (
        id,
        status,
        paid_amount,
        payee_id
      ),
      trip:trips_tbl!bookings_tbl_trip_id_fkey (
        id,
        fare,
        distance
      ),
      seat:seats_tbl!bookings_tbl_seat_id_fkey (
        id,
        taken,
        paid
      )
    `,
    )
    .eq("payments_tbl.payee_id", user_id); // filter by user

  if (error) {
    console.log("error moy ay: ", error);
    return [];
  }

  return data;
}

export async function takeSeat({ seat_id, user_id }) {
  const { data, error } = await supabase
    .from("seats_tbl")
    .update({
      taken: true,
      taken_at: new Date().toISOString(),
      seat_owner: user_id,
    })
    .eq("id", seat_id)
    .eq("taken", false)
    .select();

  if (error) {
    console.log("error moy ay: ", error);
    return null;
  }

  if (!data || data.length === 0) {
    console.log("Seat already taken");
    return null;
  }

  return data[0];
}

export async function getTripById(trip_id) {
  const { data, error } = await supabase
    .from("trips_tbl")
    .select(
      `
      id,
      fare,
      distance,
      origin:cities_tbl!trips_tbl_origin_fkey (id, name),
      destination:cities_tbl!trips_tbl_destination_fkey (id, name),
      seats:seats_tbl (
        id,
        taken,
        paid,
        seat_owner,
        taken_at
      )
    `,
    )
    .eq("id", trip_id)
    .single();

  if (error) {
    console.log("error moy ay: ", error);
    return null;
  }

  return data;
}
