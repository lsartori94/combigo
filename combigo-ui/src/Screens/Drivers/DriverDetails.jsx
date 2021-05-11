import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon,
  FormField
} from 'evergreen-ui';

import { getDriverDetails, saveUserDetails, createDriver } from './driversStore';

export const DriverDetails = () => {
  let { uname } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    dni: "",
    bdate: ""
  });
  const [oldDetails, setOldDetails] = useState({});
  const [noUser, setNoUser] = useState(true);
  const [creating, setCreating] = useState(false);
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

  useEffect(() => {
    if (uname === 'add') {
      setNoUser(false);
      setCreating(true);
      setLoading(false);
      return;
    };
    async function initialize() {
      try {
        setLoading(true);
        const response = await getDriverDetails(uname);
        setNoUser(false);
        setDetails(response);
        setOldDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [uname]);
  
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

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validatePassword = (psswd) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(psswd);
  }

  const saveCallback = async () => {
    if (Object.values(errors).find(val => val)) {
      setShowErrors(true);
      return;
    } else {
      setShowErrors(false);
    }
    try {
      setLoading(true);
      if (creating) {
        await createDriver(details);
      } else {
        await saveUserDetails(details);
      }
      setLoading(false);
      history.push('/drivers');
    } catch (e) {
      setApiError(e.message);
      setSaveError(true);
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push('/drivers');
  }

  const renderDetails = (details) => {
    if (noUser) {
      return (<div>No existe Usuario</div>)
    }
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <BackButton
          appearance="minimal"
          alignSelf="flex-start"
          marginLeft={10}
          marginBottom={10}
          onClick={() => backCallback()}
        >
          Volver
        </BackButton>
        {saveError && (<div>Error al guardar: {apiError}</div>)}
        {!saveError && (<div>
          <TextInputField
            width={'65vh'}
            disabled={!creating}
            required
            validationMessage={showErrors && errors.username ? "Campo Requerido" : null}
            label="Nombre de usuario"
            placeholder="Username"
            description=""
            value={details.username}
            onChange={e => inputCallback(e, 'username')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.email ? "Campo Requerido" : null}
            label="Email"
            placeholder="Email"
            value={details.email}
            onChange={e => inputCallback(e, 'email')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.password ? "Campo Requerido" : null}
            label="Password"
            value={details.password}
            onChange={e => inputCallback(e, 'password')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.name ? "Campo Requerido" : null}
            label="Nombre"
            placeholder="Nombre"
            value={details.name}
            onChange={e => inputCallback(e, 'name')}
          />
          <TextInputField
            width={'65vh'}
            disabled={!creating}
            required
            validationMessage={showErrors && errors.dni ? "Campo Requerido" : null}
            label="DNI"
            placeholder="24356785"
            value={details.dni}
            onChange={e => inputCallback(e, 'dni')}
          />
          <FormField
            width={'65vh'}
            marginBottom={20}
            required
            validationMessage={showErrors && errors.bdate ? "Campo Requerido" : null}
            label="Fecha de nacimiento"
          >
            <input
              type="date"
              value={details.bdate}
              onChange={e => inputCallback(e, 'bdate')}
              min="1960-01-01"
              max="2018-12-31"
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
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderDetails(details) }
    </div>
  );
};
