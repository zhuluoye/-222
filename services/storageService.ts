import { Hotel, LocationType } from '../types';
import { INITIAL_HOTELS } from '../constants';

const STORAGE_KEY = 'snowland_hotels_data_v2';

// Simulate network latency for "cloud" feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get data locally (mimics DB fetch)
const getLocalData = (): Hotel[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that the parsed data is an array and ensure robust properties
      if (Array.isArray(parsed)) {
        return parsed.map((h: any) => ({
          ...h,
          tags: Array.isArray(h.tags) ? h.tags : [] // Prevent crash if tags is missing or not an array
        }));
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOTELS));
    return INITIAL_HOTELS;
  } catch (error) {
    console.error("Failed to load hotels from storage", error);
    return INITIAL_HOTELS;
  }
};

export const fetchHotels = async (): Promise<Hotel[]> => {
  await delay(400); // Simulate cloud fetch latency
  return getLocalData();
};

export const saveHotels = async (hotels: Hotel[]) => {
  await delay(300); // Simulate cloud save latency
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  } catch (error) {
    console.error("Failed to save hotels to storage", error);
  }
};

export const addHotel = async (hotel: Hotel): Promise<Hotel[]> => {
  const current = getLocalData();
  const updated = [...current, hotel];
  await saveHotels(updated);
  return updated;
};

export const updateHotel = async (hotel: Hotel): Promise<Hotel[]> => {
  const current = getLocalData();
  const updated = current.map(h => h.id === hotel.id ? hotel : h);
  await saveHotels(updated);
  return updated;
};

export const deleteHotel = async (id: string): Promise<Hotel[]> => {
  const current = getLocalData();
  const updated = current.filter(h => h.id !== id);
  await saveHotels(updated);
  return updated;
};

export const getHotelsByLocation = async (location: LocationType): Promise<Hotel[]> => {
  await delay(200);
  const all = getLocalData();
  return all.filter(h => h.location === location);
};