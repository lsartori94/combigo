import { API_BASE } from '../../constants';

export async function getClients() {
  const response = await fetch(`${API_BASE}/users?role=client`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getBlacklist() {
  const response = await fetch(`${API_BASE}/users/blacklist/all`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getClientBlacklist(userId) {
  const response = await fetch(`${API_BASE}/users/blacklist/client/${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}
