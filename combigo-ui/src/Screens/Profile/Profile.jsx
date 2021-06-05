import './Profile.css';
import React, { useEffect, useState } from 'react';
import {
  Link
} from "react-router-dom";
import { Pane, Button, TextInputField, FormField, InlineAlert } from 'evergreen-ui';

import { VIP_STATUS, VIP_STATUS_MSG } from "../../constants";
import { useAuth } from "../../utils/use-auth";
import { getUserInfo, saveUserInfo, changeVipStatus } from './profileStore';

export const Profile = () => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [vipAvailable, setVipAvailable] = useState(false);
  const [changingVip, steChangingVip] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const uInfo = await getUserInfo(auth.user.username);
        setUserInfo(uInfo);
        setVipAvailable(uInfo.creditCard && uInfo.creditCard.issuer);
      } catch (e) {
        console.error(e);
      }
    }
    initialize();
  }, []);

  const handleVipChange = async () => {
    steChangingVip(true);
    let value = userInfo.vipStatus;
    if (value === VIP_STATUS.ENROLLED) {
      value = VIP_STATUS.NOT_ENROLLED;
    } else {
      value = VIP_STATUS.ENROLLED;
    }
    debugger;
    try {
      const res = await changeVipStatus(userInfo.username, value);
      setUserInfo(res);
      setVipAvailable(res.creditCard && res.creditCard.issuer);
    } catch (e) {
      console.error(e);
    } finally {
      steChangingVip(false);
    }
  }

  const saveUserData = async () => {
    try{
      const res = await saveUserInfo(userInfo.username, userInfo);
      setUserInfo(res);
    } catch (e) {
      console.error(e);
    }
  }

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
              onChange={e => handleInputChange('email', e.target.value)}
            />
            <FormField
              label="Membresia VIP"
              width={'65vh'}
              description="¡10% de descuento en total de las reservas por $100 mensuales! Es necesario tener tarjeta de credito asociada."
            >
              {!vipAvailable && 
              <InlineAlert intent="none" marginBottom={5}>
                Asocie una tarjeta para acceder a la membresía.
              </InlineAlert>}
              <Pane display={'flex'} alignItems={'center'}>
                <TextInputField
                  label="Estado"
                  value={VIP_STATUS_MSG[userInfo.vipStatus]}
                  disabled
                  marginRight={30}
                />
                <Button disabled={!vipAvailable} onClick={() => handleVipChange()} isLoading={changingVip}>
                  {
                    (userInfo.vipStatus && userInfo.vipStatus === VIP_STATUS.ENROLLED)
                      ? `Cancelar Membresía`
                      : `Subscribirse a Membresía`
                  }
                </Button>
              </Pane>
            </FormField>
            <Pane width={'65vh'} display="flex" justifyContent={"flex-start"} marginBottom={30}>
              <Button className="profile-btn" appearance="primary">
                <Link className="profile-a" to="/cards">Gestionar Medios de Pago</Link>
              </Button>
            </Pane>
            <Pane width={'65vh'} display="flex" justifyContent={"space-around"}>
              <Button appearance="primary" intent="success" onClick={() => saveUserData()}>
                Guardar
              </Button>
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
