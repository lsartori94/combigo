import React, {useState} from "react";
import { useHistory, Link } from 'react-router-dom';
import {
  TextInputField,
  Button,
  Pane,
} from 'evergreen-ui';

import './Login.css';
import { useAuth } from "../../utils/use-auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
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
      setLoginError(true);
    }
  }

  const tryAgainCallback = () => {
    setEmail("");
    setPassword("");
    setLoginError(false);
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingTop={100}
    >
      {loginError && (
        <>
          <Pane marginBottom={30}>El usuario no existe o la contraseña es incorrecta</Pane>
          <Button
            width={'35vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="warning"
            onClick={() => tryAgainCallback()}
          >
            Volver a Intentar
          </Button>
        </>
      )}
      {!loginError && (
        <>
          <Pane marginBottom={20}>
            <TextInputField
              width={'65vh'}
              required
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
          </Pane>
          <Pane>
            No Tenes Cuenta? <Link to="/register"><span>Registrate</span></Link>
          </Pane>
        </>
      )}
    </Pane>
  );
}