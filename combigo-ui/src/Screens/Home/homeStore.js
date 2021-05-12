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

