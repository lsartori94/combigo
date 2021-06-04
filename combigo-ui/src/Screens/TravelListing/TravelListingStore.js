import { API_BASE } from '../../constants';
import { getRouteDetails } from '../Routes/routesStore';

export async function getTravelsForRoute(routeId) {
  const response = await fetch(`${API_BASE}/routes/${routeId}/travels`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getDetailsForRoute(routeId) {
  return getRouteDetails(routeId);
}
