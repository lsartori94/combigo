import './Profile.css';
import React, { useEffect, useState } from 'react';
import {
  Link
} from "react-router-dom";
import { Pane, Button, TextInputField, FormField } from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";
import { getUserInfo } from './profileStore';

export const Profile = () => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function initialize() {
      try {
        const uInfo = await getUserInfo(auth.user.username);
        setUserInfo(uInfo);
      } catch (e) {
        console.error(e);
      }
    }
    initialize();
  },[auth.user]);

  // const saveUserData = async () => {
  //   try{
  //     const res = await saveUserInfo(userInfo.username, userInfo);
  //     setUserInfo(res);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // } 

  const handleInputChange = (field, value) => {
    const newInfo = Object.assign(userInfo);
    newInfo[field] = value;
    setUserInfo(newInfo);
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingTop={100}
    >
      {userInfo ? (
          <>
            <TextInputField
              width={'65vh'}
              label="Nombre de Usuario"
              value={userInfo.username}
              disabled
            />
            <TextInputField
              width={'65vh'}
              label="Nombre"
              value={userInfo.name}
              disabled
              onChange={e => handleInputChange('name', e.target.value)}
            />
            <TextInputField
              width={'65vh'}
              label="Fecha de Nacimiento"
              value={userInfo.bdate}
              disabled
            />
            <TextInputField
              width={'65vh'}
              label="DNI"
              value={userInfo.dni}
              disabled
            />
            <TextInputField
              width={'65vh'}
              label="Email"
              value={userInfo.email}
              disabled
              onChange={e => handleInputChange('email', e.target.value)}
            />

            <Pane width={'65vh'} display="flex" justifyContent={"flex-start"} marginBottom={20}>
              <FormField
                label="Membresia VIP"
                width={'65vh'}
                description="¡10% de descuento en total de las reservas por $100 mensuales! Es necesario tener tarjeta de credito asociada."
              >
                <Button  className="profile-btn" appearance="primary" intent="success">
                  <Link className="profile-a" to="/subscription">Gestionar Membresía</Link>
                </Button>
              </FormField>
            </Pane>

            <Pane width={'65vh'} display="flex" justifyContent={"flex-start"} marginBottom={30}>
              <Button className="profile-btn" appearance="primary">
                <Link className="profile-a" to="/cards">Gestionar Medios de Pago</Link>
              </Button>
            </Pane>
            <Pane width={'65vh'} display="flex" justifyContent={"space-around"}>
              {/* <Button appearance="primary" intent="success" onClick={() => saveUserData()}>
                Guardar
              </Button> */}
              <Button className="profile-btn" appearance="primary" intent="danger" onClick={() => auth.signout()}>
                <Link className="profile-a" to="/">Cerrar Sesion</Link>
              </Button>
            </Pane>
          </>
        ) : (
          <Link to="/login" className="signin">Inicia sesión o Registrate!</Link>
        )}
    </Pane>
  );
};
