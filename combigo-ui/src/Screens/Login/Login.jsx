import React, {useState} from "react";
import { useHistory } from 'react-router';
import {
  TextInputField,
  Button,
} from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";

export const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const auth = useAuth();
  const history = useHistory();

  const inputCallback = (e, name) => {
    const {value} = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
      break;
      case 'password':
        setPassword(value);
      break;
      default:
      break;
    }
  }

  const loginCallback = async () => {
    try {
      await auth.signin(email, password);
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div>
        <TextInputField
          width={'65vh'}
          required
          validationMessage="Campo Requerido"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={e => inputCallback(e, 'email')}
        />
        <TextInputField
          width={'65vh'}
          required
          label="Password"
          placeholder="********"
          value={password}
          onChange={e => inputCallback(e, 'password')}
        />
        <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="warning"
            onClick={() => loginCallback()}
          >
            Iniciar Sesion
          </Button>
      </div>
    </div>
  );
}