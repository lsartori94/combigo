import React from 'react';
import {
  Link
} from "react-router-dom";
import { Button } from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";

export const Profile = () => {
  const auth = useAuth();

  return (
    <div>
      {auth.user ? (
          <>
            <div>{auth.user.username}</div>
            <div>{auth.user.name}</div>
            <div>{auth.user.role}</div>
            <div>{auth.user.email}</div>
            <Button onClick={() => auth.signout()}>Signout</Button>
          </>
        ) : (
          <Link to="/login">Signin</Link>
        )}
    </div>
  );
};
