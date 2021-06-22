import { API_BASE } from '../../constants';
import { getRoutes } from '../Routes/routesStore';
import { getVehicles } from '../Vehicles/vehiclesStore';
//import { getTravelDetails } from '../Bookings/BookingsStore';
import {TRAVEL_STATES} from '../../constants'

//Get drivers
export async function getDrivers() {
  const response = await fetch(`${API_BASE}/users?role=driver`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getDriverDetails(uname) {
  const response = await fetch(`${API_BASE}/users/${uname}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getDriverUsername(id) {
  const response = await fetch(`${API_BASE}/users/id/${id}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

//CRUD Users
export async function deleteUser(uname) {
  const response = await fetch(
    `${API_BASE}/users/${uname}`,
    { method: 'DELETE'}
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function createDriver(user) {
  user.role = 'DRIVER';
  const response = await fetch(
    `${API_BASE}/users`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function saveUserDetails(user) {
  const response = await fetch(
    `${API_BASE}/users/${user.username}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function getDriverTravels( driverId ) {
  const response = await fetch(`${API_BASE}/travels`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();

  return result.filter( trav => (trav.driver === driverId) && (trav.status !== TRAVEL_STATES.FINISHED || trav.status !== TRAVEL_STATES.CANCELED));
}

export function getAvailableRoutes() {
  return getRoutes(true);
}

export function getAvailableVehicles() {
  return getVehicles();
}

export async function getTravelDetails(travelId) {
  const response = await fetch(`${API_BASE}/travels/${travelId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}