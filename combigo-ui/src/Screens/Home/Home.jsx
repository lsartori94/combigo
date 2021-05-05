import React from "react";
import {
  Link
} from "react-router-dom";
import { Button } from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";


export const Home = () => {
  const auth = useAuth();

  return (
    <div>
      <div>
        {auth.user ? (
          <>
            <Link to="/profile">Account ({auth.user.email})</Link>
            <Button onClick={() => auth.signout()}>Signout</Button>
          </>
        ) : (
          <Link to="/login">Signin</Link>
        )}
      </div>
    </div>
  );
}
