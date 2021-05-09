import React, { useDebugValue, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Pane,
  TextInputField,
  Button,
  SmallCrossIcon,
  SavedIcon,
  FormField
} from 'evergreen-ui';

import { useAuth } from '../../utils/use-auth';

export const Register = () => {
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    dni: "",
    bdate: ""
  });
  const [oldDetails, setOldDetails] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    dni: "",
    bdate: ""
  });
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    name: false,
    dni: false,
    bdate: false
  });
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();
  const auth = useAuth();
  
  useEffect(() => {
    const prev = JSON.stringify(oldDetails);
    const act = JSON.stringify(details);
    const auxErrors = {};
    if (prev !== act) {
      setFormDirty(true);
      for (const [key, value] of Object.entries(details)) {
        switch (key) {
          case 'email':
            auxErrors.email = !validateEmail(value);
          break;
          case 'password':
            auxErrors.password = !validatePassword(value);
          break;
          default:
            if (!value) {
              auxErrors[key] = true;
            } else {
              auxErrors[key] = false;
            }
            break;
        }
      }
      setErrors({...auxErrors});
    } else {
      setFormDirty(false);
    }
  }, [details, oldDetails]);

  const inputCallback = (e, name) => {
    const {value} = e.target;
    switch (name) {
      case 'username':
        setDetails({...details, username: value});
      break;
      case 'email':
        setDetails({...details, email: value});
      break;
      case 'password':
        setDetails({...details, password: value});
      break;
      case 'name':
        setDetails({...details, name: value});
      break;
      case 'dni':
        if (!isNaN(+value)) {
          setDetails({...details, dni: value});
        }
      break;
      case 'bdate':
        setDetails({...details, bdate: value});
      break;
      default:
      break;
    }
  }

  const restoreForm = () => {
    setDetails(oldDetails);
  }

  const validatePassword = (psswd) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(psswd);
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const saveCallback = async () => {
    if (Object.values(errors).find(val => val)) {
      setShowErrors(true);
      return;
    } else {
      setShowErrors(false);
    }
    debugger;
    try {
      await auth.signup(details);
      history.push('/profile');
    } catch (e) {
      setApiError(e.message)
      setSaveError(true);
    }
  }

  const renderDetails = (details) => {
    const date = new Date();
    const month = (String(date.getMonth() + 1).length > 1) ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = (String(date.getDate()).length > 1) ? date.getDate() : `0${date.getDate()}`;
    const dateLimit = `${date.getFullYear() - 18}-${month}-${day}`;
    return (
      <Pane
        marginTop={20}
        marginBottom={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        {saveError && (<div>Error al guardar: {apiError}</div>)}
        {!saveError && (<div>
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.username ? "Campo Requerido o Invalido" : null}
            label="Nombre de usuario"
            placeholder="Username"
            description=""
            value={details.username}
            onChange={e => inputCallback(e, 'username')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.email ? "Campo Requerido o Invalido" : null}
            label="Email"
            placeholder="Email"
            description="El email debe ser una direccion valida"
            value={details.email}
            onChange={e => inputCallback(e, 'email')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.password ? "Campo Requerido o Invalido" : null}
            label="Password"
            description="La contraseña debe tener un dígito, una mayúscula, un símbolo, y al menos 8 caracteres"
            value={details.password}
            onChange={e => inputCallback(e, 'password')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.name ? "Campo Requerido o Invalido" : null}
            label="Nombre"
            placeholder="Nombre"
            value={details.name}
            onChange={e => inputCallback(e, 'name')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.dni ? "Campo Requerido o Invalido" : null}
            label="DNI"
            placeholder="24356785"
            value={details.dni}
            onChange={e => inputCallback(e, 'dni')}
          />
          <FormField
            width={'65vh'}
            marginBottom={20}
            required
            validationMessage={showErrors && errors.bdate ? "Campo Requerido o Invalido" : null}
            label="Fecha de nacimiento"
            description="Debe ser mayor de edad para usar el sistema"
          >
            <input
              type="date"
              value={details.bdate}
              onChange={e => inputCallback(e, 'bdate')}
              min="1960-01-01"
              max={dateLimit}
            />
          </FormField>
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="none"
            iconBefore={SmallCrossIcon}
            marginBottom={10}
            onClick={() => restoreForm()}
          >
            Cancelar
          </Button>
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="warning"
            iconBefore={SavedIcon}
            onClick={() => saveCallback()}
            disabled={!formDirty}
          >
            Guardar
          </Button>
        </div>)}
      </Pane>
    );
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {renderDetails(details)}
      {!saveError && (<Pane>
        Ya Tenes Cuenta? <Link to="/login"><span>Inicia Sesion</span></Link>
      </Pane>)}
    </Pane>
  );
};
