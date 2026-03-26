import { supabase } from '@/lib/supabase';

export async function migrateFromLocalStorage(tripId: string) {
  if (!supabase) return;

  const raw = localStorage.getItem('family-trip-storage');
  if (!raw) return;

  const migrated = localStorage.getItem('migration-completed');
  if (migrated) return;

  try {
    const { state } = JSON.parse(raw);

    // Migrate flights
    if (state.flights?.length > 0) {
      const flights = state.flights.map((f: Record<string, unknown>) => ({
        trip_id: tripId,
        type: f.type,
        airline: f.airline,
        flight_number: f.flightNumber,
        pnr: f.pnr,
        origin: f.origin,
        origin_code: f.originCode,
        destination: f.destination,
        destination_code: f.destinationCode,
        seats: f.seats,
        baggage: f.baggage,
        status: f.status,
        notes: f.notes,
        boarding_pass: f.boardingPass,
        check_in_available: f.checkInAvailable,
        duration: f.duration,
      }));
      await supabase.from('flights').insert(flights);
    }

    // Migrate hotel
    if (state.hotel?.name) {
      await supabase.from('accommodations').insert({
        trip_id: tripId,
        name: state.hotel.name,
        address: state.hotel.address,
        maps_url: state.hotel.mapsUrl,
        reservation_code: state.hotel.reservationCode,
        contact_phone: state.hotel.contactPhone,
        contact_email: state.hotel.contactEmail,
        room_type: state.hotel.roomType,
        parking: state.hotel.parking,
        breakfast: state.hotel.breakfast,
        wifi: state.hotel.wifi,
        pool: state.hotel.pool,
        shuttle: state.hotel.shuttle,
        crib: state.hotel.crib,
        cancellation_policy: state.hotel.cancellationPolicy,
        distance_to_parks: state.hotel.distanceToParks,
        notes: state.hotel.notes,
      });
    }

    // Migrate car rental
    if (state.carRental?.company) {
      await supabase.from('car_rentals').insert({
        trip_id: tripId,
        company: state.carRental.company,
        vehicle_category: state.carRental.vehicleCategory,
        reservation_code: state.carRental.reservationCode,
        pickup_location: state.carRental.pickupLocation,
        return_location: state.carRental.returnLocation,
        insurance: state.carRental.insurance,
        child_seat: state.carRental.childSeat,
        gps: state.carRental.gps,
        fuel_policy: state.carRental.fuelPolicy,
        total_price: state.carRental.totalPrice,
        payment_method: state.carRental.paymentMethod,
        notes: state.carRental.notes,
      });
    }

    // Migrate events
    if (state.events?.length > 0) {
      const events = state.events.map((e: Record<string, unknown>) => ({
        trip_id: tripId,
        title: e.title,
        description: e.description,
        type: e.type,
        event_date: e.date,
        start_time: e.time,
        end_time: e.endTime,
        completed: e.completed ?? false,
      }));
      await supabase.from('events').insert(events);
    }

    // Migrate expenses
    if (state.expenses?.length > 0) {
      const expenses = state.expenses.map((e: Record<string, unknown>) => ({
        trip_id: tripId,
        amount: e.amount,
        currency: e.currency || 'BRL',
        category: e.category,
        description: e.description,
        expense_date: e.date,
      }));
      await supabase.from('expenses').insert(expenses);
    }

    // Migrate budget categories
    if (state.budgetCategories?.length > 0) {
      const categories = state.budgetCategories.map((c: Record<string, unknown>, i: number) => ({
        trip_id: tripId,
        slug: c.id,
        name: c.name,
        icon: c.icon,
        planned_brl: c.plannedBRL ?? 0,
        planned_usd: c.plannedUSD ?? 0,
        sort_order: i,
      }));
      await supabase.from('budget_categories').insert(categories);
    }

    // Migrate documents
    if (state.documents?.length > 0) {
      const docs = state.documents.map((d: Record<string, unknown>) => {
        const statusMap: Record<string, string> = {
          'concluido': 'concluido',
          'pendente': 'pendente',
          'nao-iniciado': 'nao_iniciado',
        };
        return {
          trip_id: tripId,
          title: d.name,
          owner: d.owner,
          status: statusMap[d.status as string] || 'nao_iniciado',
          expiry_date: d.expiryDate || null,
          notes: d.notes,
        };
      });
      await supabase.from('documents').insert(docs);
    }

    // Migrate packing items (suitcase, backpack, pharmacy, grocery)
    const packingMigrations: Record<string, unknown>[] = [];

    const listMappings: [string, string][] = [
      ['suitcaseItems', 'mala'],
      ['backpackItems', 'mochila'],
      ['pharmacyItems', 'farmacia'],
      ['groceryItems', 'mercado'],
    ];

    for (const [stateKey, listType] of listMappings) {
      if (state[stateKey]?.length > 0) {
        for (const item of state[stateKey]) {
          packingMigrations.push({
            trip_id: tripId,
            list_type: listType,
            name: item.name,
            checked: item.checked ?? false,
            category: item.category || null,
          });
        }
      }
    }

    if (packingMigrations.length > 0) {
      await supabase.from('packing_items').insert(packingMigrations);
    }

    // Migrate custom restaurants
    if (state.customRestaurants?.length > 0) {
      const restaurants = state.customRestaurants.map((r: Record<string, unknown>) => ({
        trip_id: tripId,
        item_type: 'restaurante',
        name: r.name,
        location: r.location,
        park_or_area: r.parkOrArea,
        internal_location: r.internalLocation,
        highlight: r.highlight,
        kid_friendly: r.kidFriendly ?? true,
      }));
      await supabase.from('food_items').insert(restaurants);
    }

    // Migrate food items
    if (state.foodItems?.length > 0) {
      const foods = state.foodItems.map((f: Record<string, unknown>) => ({
        trip_id: tripId,
        item_type: 'comida',
        name: f.name,
        category: f.category,
        notes: f.notes,
        checked: f.checked ?? false,
      }));
      await supabase.from('food_items').insert(foods);
    }

    localStorage.setItem('migration-completed', 'true');
    console.log('Migracao do localStorage concluida com sucesso');
  } catch (error) {
    console.error('Erro na migracao:', error);
  }
}
