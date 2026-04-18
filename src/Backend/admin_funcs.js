import { supabase } from "../../supabaseClient";

export async function createTrip(data) {
  const { data: trips, error } = await supabase
    .from("trips")
    .insert({
      origin: data.origin,
      destination: data.destination,
      fare: data.fare,
      distance: data.distance,
      departure_time: data.departure_time,
      bus_name: data.bus_name
    })
    .select()
    .single();

  if (error) {
    console.log("error moy ay: ", error);
  }
  console.log("trip created: ", trips);
  await createTripSeats(trips.id);
}

export async function getOrigins() {
  const {data, error} = await supabase
    .from("city")
    .select("*");

    if(error) {
      console.log("error:", error);
      return null;
    }
    console.log("data is: ", data);
    return data;
}

export async function createTripSeats(trip_id) {
  // generate 50 seat rows
  const seats = Array.from({ length: 50 }, (_, index) => ({
    trip_id: trip_id,
    taken: false,
    taken_at: null,
    seat_owner: null,
    seat_number: index + 1
  }));

  const { error } = await supabase.from("seats").insert(seats);

  if (error) {
    console.log("error moy ay: ", error);
  }
}

export async function deleteTripIfNoBookings(trip_id) {
  // check if any seat is already taken
  const { data: seats, error: seatError } = await supabase
    .from("seats_tbl")
    .select("id")
    .eq("trip_id", trip_id)
    .eq("taken", true);

  if (seatError) {
    console.log("error moy ay: ", seatError);
    return false;
  }

  // if any सीट is taken, block deletion
  if (seats.length > 0) {
    console.log("Cannot delete trip: seats already booked");
    return false;
  }

  // safe to delete
  const { error } = await supabase.from("trips_tbl").delete().eq("id", trip_id);

  if (error) {
    console.log("error moy ay: ", error);
    return false;
  }

  return true;
}

export async function updateTripDeparture(trip_id, departure_time) {
  const { error } = await supabase
    .from("trips")
    .update({
      departure_time: departure_time,
    })
    .eq("id", trip_id);

  if (error) {
    console.log("error moy ay: ", error);
    return false;
  }

  return true;
}

export async function canDelete(trip_id) {
  const { data, error } = await supabase
    .from("seats")
    .select("id, taken")
    .eq("trip_id", trip_id);

  if (error) {
    console.log("error", error);
    return error;
  }

  const hasTakenSeat = data.some((seat) => seat.taken === true);

  if (hasTakenSeat) {
    console.log("some seats are taken. not allowed to delete");
    return false;
  } else {
    await supabase.from("trips").delete().eq("id", trip_id);
    return !hasTakenSeat;
  }
}

export async function adminLogin(email, password) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

    if (error) {
      console.log("errorboo", error);
      return null;
    }

  return data;
}
