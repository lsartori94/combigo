import { API_BASE } from '../../constants';
import { getRoutes } from '../Routes/routesStore';
import { getVehicles } from '../Vehicles/vehiclesStore';
import { getTravelDetails } from '../Travels/travelsStore';

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
  const response = await fetch( `${API_BASE}/travels/driverTravels/${driverId}` );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}


export function getAvailableRoutes() {
  return getRoutes(true);
}

export function getAvailableVehicles() {
  return getVehicles();
}

export async function getATravelDetails(travelId) {
  return getTravelDetails(travelId)
}

export async function getClients() {
  const response = await fetch(`${API_BASE}/users?role=client`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function acceptPassenger(travelId, userId) {
  const response = await fetch(
    `${API_BASE}/travels/acceptPassenger/${travelId}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId})
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function startTravel(travelId) {
  const response = await fetch(
    `${API_BASE}/travels/startTravel/${travelId}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function finishTravel(travelId) {
  const response = await fetch(
    `${API_BASE}/travels/finishtTravel/${travelId}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function cancelTravel(travelId) {
  const response = await fetch(
    `${API_BASE}/travels/cancelTravel/${travelId}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getClientWithEmail(email) {
  const response = await fetch(`${API_BASE}/users/email/${email}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function createApprovedBooking(details, travelId) {
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

export const createUserByDefault = async (email) => {
  const user = {
    email: email,
    username: email,
    name: email,
    password: '123@Pass',
    bdate: '',
    dni: '',
  }
  user.role = 'CLIENT';
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
};