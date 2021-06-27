// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from "react";
import { API_BASE } from "../constants";
import { session } from "./session";

const ROLES = {
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
  CLIENT: 'CLIENT'
}

const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = async (email, password) => {
    const response = await fetch(
      `${API_BASE}/users/login`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    setUser(result);
    session.setUser(result);
    return result;
  };

  const signup = async (user) => {
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
    setUser(result);
    session.setUser(result);
    return result;
  };

  const signout = () => {
    setUser(null);
    session.clear();
  };

  const isAdmin = () => {
    return user && user.role === ROLES.ADMIN;
  }

  const isClient = () => {
    return user && user.role === ROLES.CLIENT; //para las reservas
  }

  const isDriver = () => {
    return user && user.role === ROLES.DRIVER; //para las reservas
  }

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const user = session.getUser();
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    // Cleanup subscription on unmount
    return () => session.clear();
  }, []);
  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    isAdmin,
    isClient,
    isDriver
  };
}
