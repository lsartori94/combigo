import React, {useEffect, useState} from "react";
import { useHistory, useParams } from 'react-router-dom';
import {
  TextInputField,
  Button,
  Pane,
  Dialog,
  BackButton,
  Strong
} from 'evergreen-ui';

import { getClientWithEmail, getATravelDetails, createApprovedBooking, createUserByDefault } from './driversStore';
import { VIP_STATUS, BOOKING_STATES, LEGAL_STATUS, ROLES } from "../../constants";

export const AddNewPassanger = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [client, setClient] = useState([]);
  const [travel, setTravel] = useState([]);
  const [clientExists, setClientExists] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);

  const [apiError, setApiError] = useState(null);
  const [bookingError, setBookingError] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCantBeDriver, setShowCantBeDriver] = useState(false); //Que no elijan un driver
  const [showAlredyBooked, setShowAlredyBooked] = useState(false); //Que no elijan un driver

  const [userIsVIP, setUserIsVip] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      try {
        const travelResponse = await getATravelDetails(travelId);
        if (travelResponse.passengers) {
          setSubtotal(travelResponse.price);
          setTravel(travelResponse);
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

    if ( !validateEmail( value ) ) {
      setEmailIsValid( false );
    } else {
      setEmailIsValid( true );
    }
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
    setShowConfirm(false)

    if ( clientExists && client.role === ROLES.DRIVER) {
      setClientExists(false);
      setClient([]);
      setShowCantBeDriver(true);
      return;
    }

    const clientHasBooking = travel.passengers.find( p => ( p.id === client.id ) && ( p.accepted === true) );
    if ( clientHasBooking ) {
      setClientExists(false);
      setClient([]);
      setShowAlredyBooked( true );
      return;
    }

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
        setShowSuccess( true );
      }
    } catch (e) {
      console.log(e); //Puede estar blacklisted esto
      setApiError(e.message);
      setBookingError(true);
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
        intent="warning"
        onConfirm={() => bookingCallback()}
        onCloseComplete={() => setShowConfirm(false)}
        confirmLabel="Continuar"
        cancelLabel="Cancelar"
      > {( clientExists ? "El usuario existe" : "El cliente no tiene cuenta, se creara una con el email dado y una contraseña por defecto '123@Pass'" )}
      </Dialog>
      <Dialog
        isShown={showSuccess}
        title="Reserva exitosa"
        intent="success"
        onConfirm={() => backCallback()}
        onCloseComplete={() => setShowSuccess(false)}
        confirmLabel="Continuar"
      > { "Reserva exitosa" }
      </Dialog>
      <Dialog
        isShown={showCantBeDriver}
        title="No puede ser chofer"
        onCloseComplete={() => setShowCantBeDriver(false)}
        confirmLabel="Continuar"
      > { "El mail pertenece a un chófer, use otro mail" }
      </Dialog>
      <Dialog
        isShown={showAlredyBooked}
        title="Cliente ya esta activo en el viaje"
        onCloseComplete={() => setShowAlredyBooked(false)}
        confirmLabel="Continuar"
      > { "El cliente ya esta aceptado para este viaje" }
      </Dialog>
      <Dialog
        isShown={bookingError}
        title="Cliente esta en lista negra u otro error e la api"
        onCloseComplete={() => setBookingError(false)}
        confirmLabel="Continuar"
      > { 'Error al registrar pago: ' + apiError }
      </Dialog>
      {bookingError && (<div>Error al guardar: {apiError}</div>)}
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
            <TextInputField
              width={'65vh'}
              label="Precio sin VIP (10% de descuento con VIP)"
              placeholder="Precio sin VIP"
              value={subtotal}
              disabled
            />
            <Button
              width={'65vh'}
              display="flex"
              justifyContent="center"
              appearance="primary"
              intent="warning"
              onClick={clientExistsCallback}
              disabled = { !emailIsValid }
            >
              Agregar pasajero
            </Button>
          </Pane>
          <Strong size={400} marginTop={8} marginSide={30} center>Al agregar el pasajero en el viaje en curso está firmando un declaración jurada,</Strong>
          <Strong size={400} marginSide={30} center>jurando que el pasajero no presenta síntomas de COVID-19 (fiebre, dolor de garganta, tos, perdida del gusto o del olfato, dificultad respiratoria)</Strong>
          <Strong size={400} marginSide={30} center>y que en los últimos 10 días no estuvo en contacto con ningún caso confirmado de COVID-19</Strong>
        </>
      )}
    </Pane>
  );
}