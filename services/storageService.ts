import { Hotel, LocationType } from '../types';
import { INITIAL_HOTELS } from '../constants';

const STORAGE_KEY = 'snowland_hotels_data';

export const getHotels = (): Hotel[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Seed initial data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOTELS));
    return INITIAL_HOTELS;
  } catch (error) {
    console.error("Failed to load hotels from storage", error);
    return INITIAL_HOTELS;
  }
};

export const saveHotels = (hotels: Hotel[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  } catch (error) {
    console.error("Failed to save hotels to storage", error);
  }
};

export const addHotel = (hotel: Hotel) => {
  const current = getHotels();
  const updated = [...current, hotel];
  saveHotels(updated);
  return updated;
};

export const updateHotel = (hotel: Hotel) => {
  const current = getHotels();
  const updated = current.map(h => h.id === hotel.id ? hotel : h);
  saveHotels(updated);
  return updated;
};

export const deleteHotel = (id: string) => {
  const current = getHotels();
  const updated = current.filter(h => h.id !== id);
  saveHotels(updated);
  return updated;
};

export const getHotelsByLocation = (location: LocationType): Hotel[] => {
  const all = getHotels();
  return all.filter(h => h.location === location);
};