import React from 'react';
import {
  Link
} from "react-router-dom";
import { Pane, Button, TextInputField } from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";

export const Profile = () => {
  const auth = useAuth();

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingTop={100}
    >
      {auth.user ? (
          <>
            <TextInputField
              width={'65vh'}
              label="Nombre de Usuario"
              value={auth.user.username}
              disabled
            />
            <TextInputField
              width={'65vh'}
              label="Nombre"
              value={auth.user.name}
              disabled
            />
            <TextInputField
              width={'65vh'}
              label="Rol"
              value={auth.user.role}
              disabled
            />
            <TextInputField
              width={'65vh'}
              label="Email"
              value={auth.user.email}
              disabled
            />
            <Button onClick={() => auth.signout()}>
              <Link to="/">Cerrar Sesion</Link>
            </Button>
          </>
        ) : (
          <Link to="/login">Signin</Link>
        )}
    </Pane>
  );
};
