import { API_BASE } from '../../constants';
import { getAdditionals } from '../Additionals/additionalsStore';
import { getRoutes } from '../Routes/routesStore';

export async function getTravels() {
  const response = await fetch(`${API_BASE}/travels`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

//Get bookings
export async function getBookings(user) {
  const response = await fetch(`${API_BASE}/users/${user.user.username}/bookings`);
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
  const travRes = await fetch(
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
  if (!travRes.ok) {
    const error = await travRes.text();
    throw new Error(error);
  }
  const travJson = await travRes.json();
  const completeResponse = await fetch(
    `${API_BASE}/travels/${travJson.id}/additionals`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({availableAdditionals: travel.availableAdditionals})
    }
  );
  if (!completeResponse.ok) {
    const error = await completeResponse.text();
    throw new Error(error);
  }
  const result = await completeResponse.json();
  return result;
}

export async function saveTravelDetails(travel) {
  const travRes = await fetch(
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
  if (!travRes.ok) {
    const error = await travRes.text();
    throw new Error(error);
  }
  const travJson = await travRes.json();
  const completeResponse = await fetch(
    `${API_BASE}/travels/${travJson.id}/additionals`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({availableAdditionals: travel.availableAdditionals})
    }
  );
  if (!completeResponse.ok) {
    const error = await completeResponse.text();
    throw new Error(error);
  }
  const result = await completeResponse.json();
  return result;
}

export async function saveTravelVehicle(travel) {
  const response = await fetch(
    `${API_BASE}/travels/${travel.id}/vehicle`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({vehicle: travel.vehicle})
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function saveTravelDriver(travel) {
  const response = await fetch(
    `${API_BASE}/travels/${travel.id}/driver`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({driver: travel.driver})
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function getValidTravelAssigns(travelId) {
  const response = await fetch(`${API_BASE}/travels/${travelId}/validAssigns`);
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