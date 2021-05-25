import { API_BASE } from '../../constants';

export async function saveUserCreditCardInfo(username, info) {
  const response = await fetch(
    `${API_BASE}/users/${username}/card`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function getCreditCardInfo(user) {
  const response = await fetch(`${API_BASE}/users/${user}/card`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}

export async function deleteCard(user) {
  const response = await fetch(
    `${API_BASE}/users/${user}/card`,
    {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const result = await response.json();
  return result;
}
