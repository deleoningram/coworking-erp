import { supabase } from '../supabaseClient';

export interface Booking {
  id: string;
  resource: string;
  time: string;
  status: 'active' | 'pending' | 'approved' | 'cancelled' | 'completed';
  payment: 'paid' | 'unpaid' | 'refund';
  client: string;
  created_at?: string;
}

/**
 * Fetch all bookings from Supabase
 */
export const fetchBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return data || [];
};

/**
 * Create a new booking
 */
export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
  // Generate ID
  const id = 'XJ-' + Math.floor(Math.random() * 10000);
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ ...booking, id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
};

/**
 * Update an existing booking
 */
export const updateBooking = async (id: string, updates: Partial<Booking>): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a booking
 */
export const deleteBooking = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};
