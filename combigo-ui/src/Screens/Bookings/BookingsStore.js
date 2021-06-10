import { API_BASE } from '../../constants';
import { getAdditionals } from '../Additionals/additionalsStore';
import { getRoutes } from '../Routes/routesStore';
import { getTravels } from '../Travels/travelsStore';

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

export async function getAllTravels() {
  return getTravels();
}

export async function cancelBooking(travelId, userId) {
  const response = await fetch(
    `${API_BASE}/travels/${travelId}/cancelBooking`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: userId})
    }
  );
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
  return getRoutes(true);
}