import { API_BASE } from '../../constants';

//Get Routes
export async function getRoutes() {
  const response = await fetch(`${API_BASE}/routes`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getRouteDetails(routeId) {
  const response = await fetch(`${API_BASE}/routes/${routeId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

//CRUD Users
export async function deleteRoute(routeId) {
  const response = await fetch(
    `${API_BASE}/routes/${routeId}`,
    { method: 'DELETE'}
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function createRoute(route) {
  const response = await fetch(
    `${API_BASE}/routes`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(route)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function saveRouteDetails(route) {
  const response = await fetch(
    `${API_BASE}/routes/${route.id}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(route)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}
