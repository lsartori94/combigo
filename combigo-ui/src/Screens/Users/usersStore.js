import { API_BASE } from '../../constants';

//Get users
export async function getUsers() {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getUserDetails(uname) {
  const response = await fetch(`${API_BASE}/users/${uname}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

//Get drivers
export async function getDrivers() {
    const response = await fetch(`${API_BASE}/users?role=driver`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }

//Get clients
export async function getClients() {
    const response = await fetch(`${API_BASE}/users?role=client`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }
  
//CRUD Users
export async function deleteUser(uname) {
  const response = await fetch(
    `${API_BASE}/user/${uname}`,
    { method: 'DELETE'}
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function createUser(user) {
  const response = await fetch(
    `${API_BASE}/user`,
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function saveUserDetails(user) {
  const response = await fetch(
    `${API_BASE}/user/${user.username}`,
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}