import React, {useEffect, useState} from "react";
import { useHistory, useParams } from 'react-router-dom';
import {
  TextInputField,
  Button,
  Pane,
  Dialog,
  BackButton,
} from 'evergreen-ui';

import { getClientWithEmail, getATravelDetails, createApprovedBooking, createUserByDefault } from './driversStore';
import { VIP_STATUS, BOOKING_STATES, LEGAL_STATUS } from "../../constants";
import { useAuth } from "../../utils/use-auth";


export const AddNewPassanger = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [client, setClient] = useState([]);
  //const [travel, setTravel] = useState([]);
  const [clientExists, setClientExists] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);

  const [userIsVIP, setUserIsVip] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      try {
        const travelResponse = await getATravelDetails(travelId);
        if (travelResponse.passengers.length) {
          //setTravel(travelResponse);
          setSubtotal(travelResponse.price)
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [travelId]);

  const inputCallback = (e, name) => {
    const {value} = e.target;
    setEmail(value);
  }

  const createUser = async () => {
    try {
      setLoading(true);
      const newUser = await createUserByDefault(email);
      return newUser;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const clientExistsCallback = async () => {
    try {
      setLoading(true);
      const response = await getClientWithEmail(email);
      if ( response.email ) {
        setClient(response);
        setClientExists(true);
        setUserIsVip( response.vip.status === VIP_STATUS.ENROLLED);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setShowConfirm(true);
    }
  }

  const bookingCallback = async () => {
    let id = client.id;
    if (!clientExists){
      const newUser = await createUser();
      id = newUser.id;
    }
    const booking = Object.assign({
      id,
      bookingStatus: BOOKING_STATES.ACTIVE, 
      creditCard: 'Efectivo', 
      payment: (userIsVIP ? subtotal * 0.90 : subtotal), 
      boughtAdditionals: [], 
      accepted: true,
      legalStatus: LEGAL_STATUS.APPROVED,
    } );
    try {
      setLoading(true);
      const bookingResponse = await createApprovedBooking(booking, travelId);
      if (bookingResponse.accepted){
        setshowSuccess( true );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  //successCallback
  const backCallback = () => {
    history.push(history.goBack());
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingTop={100}
    >
      <Dialog
        isShown={showConfirm}
        title="Confirmar Reserva"
        intent="danger"
        onConfirm={() => bookingCallback()}
        onCloseComplete={() => setShowConfirm(false)}
        confirmLabel="Continuar"
        cancelLabel="Cancelar"
      > { clientExists ? "El cliente existe, el pago sera registrado" : "El cliente no tiene cuenta, se creara una con el email dado y una contraseña por defecto '123@Pass'"}
      </Dialog>
      <Dialog
        isShown={showSuccess}
        title="Reserva exitosa"
        intent="success"
        onConfirm={() => backCallback()}
        onCloseComplete={() => setshowSuccess(false)}
        confirmLabel="Continuar"
      > { "Reserva exitosa" }
      </Dialog>
      {!loading && (
        <>
          <Pane marginBottom={20}>
            <BackButton
              appearance="minimal"
              alignSelf="flex-start"
              marginLeft={10}
              marginBottom={10}
              onClick={() => backCallback()}
            >
              Volver
            </BackButton>
            <TextInputField
              width={'65vh'}
              required
              label="Email"
              placeholder="Email"
              value={email}
              onChange={e => inputCallback(e, 'email')}
            />
            <Button
              width={'65vh'}
              display="flex"
              justifyContent="center"
              appearance="primary"
              intent="warning"
              onClick={clientExistsCallback}
            >
              Agregar pasajero
            </Button>
          </Pane>
        </>
      )}
    </Pane>
  );
}