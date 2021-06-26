import { API_BASE } from '../../constants';
import { getAdditionals } from "../Additionals/additionalsStore";
import { getUserInfo } from "../Profile/profileStore";

export async function getRouteDetails(routeId) {
    const response = await fetch(`${API_BASE}/routes/${routeId}`);
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

export async function createBooking(details, travelId) {
  const response = await fetch(
    `${API_BASE}/travels/${travelId}/newBooking`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function getAvailableAdditionals(travelId) {
  return getAdditionals(travelId);
}

export async function getUserDetails(user) {
  return getUserInfo(user.username);
}
