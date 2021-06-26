import './Profile.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  Link
} from "react-router-dom";
import { Pane, Button, TextInputField, FormField, InlineAlert, BackButton } from 'evergreen-ui';

import { VIP_STATUS, VIP_STATUS_MSG } from "../../constants";
import { useAuth } from "../../utils/use-auth";
import { getUserInfo, changeVipStatus } from './profileStore';

export const Subscription = () => {
  const auth = useAuth();
  const history = useHistory();
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
  },[auth.user]);

  const handleVipChange = async () => {
    steChangingVip(true);
    let value = userInfo.vip.status;
    if (value === VIP_STATUS.ENROLLED) {
      value = VIP_STATUS.NOT_ENROLLED;
    } else {
      value = VIP_STATUS.ENROLLED;
    }
    try {
      const res = await changeVipStatus(userInfo.username, value);
      setUserInfo(res);
      setVipAvailable(res.creditCard && res.creditCard.issuer);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(function(){ steChangingVip(false); }, 1000); //timeout simular vip change
    }
  }

  const backCallback = () => {
    history.push('/profile');
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingTop={20}
    >
      {userInfo ? (
          <>
            <BackButton
              appearance="minimal"
              alignSelf="flex-start"
              marginLeft={10}
              marginBottom={10}
              onClick={() => backCallback()}
            > Volver
            </BackButton>

            <FormField
              label="Membresia VIP"
              width={'65vh'}
              description="Accedé a un 10% de descuento en el total de cada reserva que hagas, solo por $100 mensuales. Es necesario tener tarjeta de credito asociada"
            >
              {!vipAvailable && 
              <InlineAlert intent="none" marginBottom={5}>
                Asocie una tarjeta en "Gestionar Medios de Pago" para acceder a la membresía.
              </InlineAlert>}

              <Pane display={'flex'} alignItems={'center'}>
                <TextInputField
                  label="Estado"
                  value={VIP_STATUS_MSG[userInfo.vip.status]}
                  disabled
                  marginRight={30}
                />
                <Button disabled={!vipAvailable} onClick={() => handleVipChange()} isLoading={changingVip}>
                  {
                    (userInfo.vip.status && userInfo.vip.status === VIP_STATUS.ENROLLED)
                      ? `Cancelar Membresía`
                      : `Subscribirse a Membresía`
                  }
                </Button>
              </Pane>
            </FormField>
          </>
        ) : (
          <Link to="/login" className="signin">Inicia sesión o Registrate!</Link>
        )}
    </Pane>
  );
};
