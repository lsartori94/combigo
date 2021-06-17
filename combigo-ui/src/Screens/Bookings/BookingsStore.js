import { API_BASE } from '../../constants';
import { getAdditionals } from '../Additionals/additionalsStore';
import { getUserInfo } from '../Profile/profileStore';
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

export async function getAllTravels() {
  const response = await fetch(`${API_BASE}/travels/all`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function cancelBooking(travelId, userId, bookingId) {
  const response = await fetch(
    `${API_BASE}/travels/${travelId}/cancelBooking`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: userId, idBooking: bookingId}) //Cambiado para el booking id
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

export function getUserDetails(user) {
  return getUserInfo(user.username);
}