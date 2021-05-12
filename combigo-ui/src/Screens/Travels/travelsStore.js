import { API_BASE } from '../../constants';
import { getDrivers } from '../Drivers/driversStore';
import { getAdditionals } from '../Additionals/additionalsStore';
import { getVehicles } from '../Vehicles/vehiclesStore';
import { getRoutes } from '../Routes/routesStore';

//Get Routes
export async function getTravels() {
  const response = await fetch(`${API_BASE}/travels`);
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

export async function deleteTravel(travelId) {
  const response = await fetch(
    `${API_BASE}/travels/${travelId}`,
    { method: 'DELETE'}
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function createTravel(travel) {
  const response = await fetch(
    `${API_BASE}/travels`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(travel)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function saveTravelDetails(travel) {
  const response = await fetch(
    `${API_BASE}/travels/${travel.id}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(travel)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export function getAvailableAditionals() {
  return getAdditionals();
}

export function getAvailableDrivers() {
  return getDrivers();
}

export function getAvailableVehicles() {
  return getVehicles();
}

export function getAvailableRoutes() {
  return getRoutes();
}