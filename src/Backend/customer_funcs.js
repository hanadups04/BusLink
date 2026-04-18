import { supabase } from "../../supabaseClient";

export async function createUser(data) {
  const { error } = await supabase.from("users").insert({
    email: data.Email,
    password: data.password,
    username: data.username,
  });

  if (error) {
    console.log("error moy ay: ", error);
    return error;
  }

  return 1;
}

export async function loginUser(email, password) {
  const { data: userdata, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error) {
    console.log("error mo ay: ", error);
    return null;
  }

  console.log("userdata: ", userdata);
  return userdata;
}

export async function getTrips() {
  const { data, error } = await supabase.from("trips").select(`
      id,
      fare,
      distance,
      departure_time,
      bus_name,
      origin:city!trips_origin_fkey (city_name),
      destination:city!trips_destination_fkey (city_name)
    `);

  if (error) {
    console.log("error moy ay: ", error);
    return [];
  }
  console.log("trip datas: ", data);
  return data;
}

export async function createPayment(data) {
  const { error } = await supabase.from("payments").insert({
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

export async function createBooking({
  trip_id,
  seat_id,
  // payment_id,
  owner_id,
  name,
  passenger_type,
  fare,
}) {
  const { error } = await supabase.from("bookings").insert({
    trip_id: trip_id,
    seat_id: seat_id,
    // payment_id: payment_id,
    owner_id: owner_id,
    name: name,
    passenger_type: passenger_type,
    fare: fare,
  });

  if (error) {
    console.log("error moy ay: ", error);
  }
  return 1;
}

export async function takeSeat({ seat_id, user_id }) {
  const { data, error } = await supabase
    .from("seats")
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
    return error;
  }
  console.log("take seat", data);
  return data;
}

export async function getUserBookings(user_id) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      trip:trips!bookings_trip_id_fkey (
        origin:city!trips_origin_fkey (city_name),
        destination:city!trips_destination_fkey(city_name),
        *
      ),
      seat:seats!bookings_seat_id_fkey (*)
    `,
    )
    .eq("owner_id", user_id); // filter by user

  if (error) {
    console.log("error moy ay: ", error);
    return [];
  }

  const formattedData = (data || []).map((booking) => ({
    ...booking,
    trip: booking.trip
      ? {
          ...booking.trip,
          departure_time: booking.trip.departure_time
            ? formatDateTime(booking.trip.departure_time)
            : booking.trip.departure_time,
        }
      : booking.trip,
  }));

  return formattedData;
}

export async function getTripById(trip_id) {
  const { data, error } = await supabase
    .from("trips")
    .select(
      `
      id,
      fare,
      distance,
      bus_name,
      departure_time,
      origin:city!trips_origin_fkey (city_name),
      destination:city!trips_destination_fkey (city_name),
      seats:seats (
        id,
        seat_number,
        taken
      )
    `,
    )
    .eq("id", trip_id)
    .single();

  if (error) {
    console.log("error moy ay: ", error);
    return null;
  }

  const formattedData = {
    ...data,
    departure_time: formatDateTime(data.departure_time),
  };
  console.log("data is: ", formattedData);
  return formattedData;
}

function parseTimestamp(ts) {
  return new Date(ts.replace(" ", "T"));
}

function formatDateTime(ts) {
  const date = parseTimestamp(ts);

  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila", // important for PH apps
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
