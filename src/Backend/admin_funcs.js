import { supabase } from "../../supabaseClient";

export async function createTrip(data) {
  const { TripData: trips, error } = await supabase
    .from("trips_tbl")
    .insert({
      origin: data.origin,
      destination: data.destination,
      fare: data.fare,
      distance: data.distance,
    })
    .select()
    .single();

  if (error) {
    console.log("error moy ay: ", error);
  }

  await createTripSeats(TripData);
}

export async function createTripSeats(trip_id) {
  // generate 50 seat rows
  const seats = Array.from({ length: 50 }, () => ({
    trip_id: trip_id,
    taken: false,
    paid: false,
    taken_at: null,
    seat_owner: null,
  }));

  const { error } = await supabase.from("seats_tbl").insert(seats);

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
    .from("trips_tbl")
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
