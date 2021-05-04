import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon
} from 'evergreen-ui';

import { getUserDetails, saveUserDetails, createUser } from './usersStore';

export const UserDetails = () => {
  let { uname } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [oldDetails, setOldDetails] = useState({});
  const [noUser, setNoUser] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
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
        const response = await getUserDetails(uname);
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
    if (prev !== act) {
      setFormDirty(true);
      if (Object.values(details).find(val => val === "") !== undefined) {
        setErrors(true);
      } else {
        setErrors(false);
      }
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
      case 'bdate':
        setDetails({...details, bdate: value});
      break;
      case 'role':
        setDetails({...details, role: value});
      break;
      default:
      break;
    }
  }

  const restoreForm = () => {
    setDetails(oldDetails);
  }

  const saveCallback = async () => {
    try {
      setLoading(true);
      if (creating) {
        await createUser(details);
      } else {
        await saveUserDetails(details);
      }
      setLoading(false);
      history.push(history.goBack());
    } catch (e) {
      console.error(e);
      setSaveError(true);
      setLoading(false);
    }
  }

  //goBack() medio raro, pero es para poder seguir usando UserDetails para Clients y Drivers
  const backCallback = () => {
    history.push(history.goBack());
  }

  const renderDetails = (user) => {
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
        {saveError && (<div>Error al guardar</div>)}
        {!saveError && (<div>
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Nombre de usuario"
            description=""
            value={user.username}
            onChange={e => inputCallback(e, 'username')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Email"
            placeholder="Email"
            value={user.email}
            onChange={e => inputCallback(e, 'email')}
          />
          <TextInputField
            width={'65vh'}
            required
            disabled={!creating}
            label="Password"
            placeholder="********"
            value={user.password}
            onChange={e => inputCallback(e, 'password')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Nombre"
            placeholder="Nombre"
            value={user.name}
            onChange={e => inputCallback(e, 'name')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Fecha de nacimiento"
            placeholder="DD/MM/YYYY"
            value={user.bdate}
            onChange={e => inputCallback(e, 'bdate')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Rol"
            placeholder="Cliente/Chofer/Admin"
            onChange={e => inputCallback(e, 'role')}
            value={user.role}
          />
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
            disabled={(!formDirty) || (formDirty && errors)}
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
