import { API_BASE } from '../../constants';

export async function getVehicles() {
  const response = await fetch(`${API_BASE}/vehicles`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getVehicleDetails(id) {
  const response = await fetch(`${API_BASE}/vehicles/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function deleteVehicle(id) {
  const response = await fetch(
    `${API_BASE}/vehicles/${id}`,
    { method: 'DELETE'}
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function createVehicle(veh) {
  const response = await fetch(
    `${API_BASE}/vehicles`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(veh)
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function saveVehiculeDetails(veh) {
  const response = await fetch(
    `${API_BASE}/vehicles/${veh.id}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(veh)
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}
