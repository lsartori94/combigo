import { API_BASE } from '../../constants';

export async function getRouteDetails(routeId) {
console.log("jajaja", routeId);
  const response = await fetch(`${API_BASE}/routes/${routeId}}`);
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
