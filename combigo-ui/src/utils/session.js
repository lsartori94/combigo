import { SESSION_KEY } from '../constants';

const USER_KEY = `${SESSION_KEY}-Logged_User`;

function getUser() {
  const data = sessionStorage.getItem(USER_KEY);
  return JSON.parse(data);
}

function setUser(user) {
  const data = JSON.stringify(user);
  sessionStorage.setItem(USER_KEY, data);
}

function clear() {
  sessionStorage.clear();
}

export const session = {
  setUser,
  getUser,
  clear
};
