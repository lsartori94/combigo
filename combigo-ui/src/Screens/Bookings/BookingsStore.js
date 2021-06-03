import { API_BASE } from '../../constants';
import { getAdditionals } from '../Additionals/additionalsStore';
import { getRoutes } from '../Routes/routesStore';

//Get bookings
export async function getBookings(user) {
  const response = await fetch(`${API_BASE}/users/${user.username}/bookings`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getTravelDetails(travelId) {
  const response = await fetch(`${API_BASE}/travels/${travelId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export function getAvailableAditionals() {
  return getAdditionals();
}

export function getAvailableRoutes() {
  return getRoutes();
}