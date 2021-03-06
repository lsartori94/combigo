import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAuth } from "../../utils/use-auth";
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SavedIcon,
  FormField,
  Checkbox,
  Alert,
  Text,
  Strong,
  InlineAlert,
  EditIcon,
  Dialog
} from "evergreen-ui";

import { getRouteDetails, getTravelDetails, getAvailableAdditionals, getUserDetails, createBooking, getUserBlacklist } from "./checkoutStore";
import { LEGAL_STATUS, VIP_STATUS, BOOKING_STATES } from "../../constants";

export default function Checkout() {
  let { travelId } = useParams();
  const history = useHistory();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [isShownSuccess, setIsShownSuccess] = useState(false);
  const [checkedSavedCC, setCheckedSavedCC] = useState(false);
  const [userHasSavedCC, setUserHasSavedCC] = useState(false);
  const [clientBlacklisted, setClientBlacklisted] = useState(false);
  const [error, setError] = useState(false);
  const [userIsVIP, setUserIsVip] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  //Detalles del viaje
  const [allAdditionals, setAllAdditionals] = useState([]);
  const [details, setDetails] = useState({
    dateAndTime: '',
    route: '',
    availableAdditionals: [],
    passengers: [],
    stock: null,
    price: 0
  });
  const [routeDetails, setRouteDetails] = useState({
    origin: '',
    destination: '',
    durationMin: '',
  });

  //Detalles del nuevo pasajero/reserva
  const [newPassengerDetails, setNewPassengerDetails] = useState({
    id: '',
    boughtAdditionals: [],
    creditCard: '',
    payment: 0
  });

  //CC
  const [newCardInfo, setNewCardInfo] = useState({
    issuer: '',
    number: '',
    cardHolder: '',
    expDate: '',
    cvv: ''
  });
  const [ccErrors, setCcErrors] = useState({
    issuer: '',
    number: '',
    cardHolder: '',
    expDate: '',
    cvv: ''
  });
  const [showCcErrors, setShowCcErrors] = useState(false);
  const [userCardInfo, setUserCardInfo] = useState({});
  const [selectedCard, setSelectedCard] = useState({});

  useEffect(() => {
    async function initializeExtras() {
      const additionals = await getAvailableAdditionals();
      setAllAdditionals(additionals);
    }
    async function initialize() {
      setLoading(true);
      try {
        const travelResponse = await getTravelDetails(travelId);
        const routeResponse = await getRouteDetails(travelResponse.route);
        const userInfo = await getUserDetails(auth.user);
        const userBlacklist = await getUserBlacklist(auth.user);
        setDetails(travelResponse);
        setRouteDetails(routeResponse);
        setSubtotal(travelResponse.price)
        if (userInfo.creditCard.number) {
          setUserCardInfo(userInfo.creditCard);
          setUserHasSavedCC(true);
        }
        if (userInfo.vip.status && userInfo.vip.status === VIP_STATUS.ENROLLED)
          setUserIsVip(true);
        if (userBlacklist.userId && (new Date() <= new Date(userBlacklist.endDate)))
          setClientBlacklisted(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId, auth.user]);

  useEffect(() => {
    const auxErrors = {};
    for (const [key, value] of Object.entries(newCardInfo)) {
      switch (key) {
        default:
          if (!value) {
            auxErrors[key] = true;
          } else {
            auxErrors[key] = false;
          }
          break;
      }
    }
    setCcErrors({...auxErrors});
  }, [newCardInfo]);

  useEffect(() => {
    refreshSubtotal();
  }, [newPassengerDetails]); // eslint-disable-line

  useEffect(() => {
    refreshPayment();
  }, [checkedSavedCC, newCardInfo]); // eslint-disable-line

  //Adicionales
  const handleCheckbox = (e) => {
    const { checked, id } = e.target;
    let newAdditionals;
    if (!checked) {
      newAdditionals = [
        ...newPassengerDetails.boughtAdditionals.filter((el) => el !== id),
      ];
    } else {
      newAdditionals = [...newPassengerDetails.boughtAdditionals, id];
    }
    setNewPassengerDetails({
      ...newPassengerDetails,
      boughtAdditionals: newAdditionals,
    });
  };

  const renderAdditionals = () => {
    const available = allAdditionals.filter((elem) =>
      details.availableAdditionals.includes(elem.id)
    );
    return available.map((elem) => {
      const checked = newPassengerDetails.boughtAdditionals.find(
        (el) => el === elem.id
      );
      return (
        <li key={elem.id}>
          <Checkbox
            label={`${elem.name} - $${elem.price}`}
            marginLeft={10}
            id={elem.id}
            checked={checked ? true : false}
            onChange={(e) => handleCheckbox(e)}
          />
        </li>
      );
    });
  };

  //CC
  const renderSavedCCCheckbox = () => {
    return (
      <Checkbox
        label={`${userCardInfo.issuer} - Terminada en ${userCardInfo.number.slice(-4)}`}
        marginLeft={10}
        checked={checkedSavedCC}     
        onChange={e => setCheckedSavedCC(e.target.checked)}
      />)
  }

  const handleInput = (name, value) => {
    const newValues = JSON.parse(JSON.stringify(newCardInfo));
    switch (name) {
      case 'number':
        if (isNaN(value)) return;
        if (value.length > 16) {
          return;
        };
        switch (value[0]) {
          case '4':
            newValues.issuer = 'Visa';
            break;
          case '5':
            newValues.issuer = 'Master'
            break;
          case '3':
            newValues.issuer = 'American Express'
            break;
          default:
            newValues.issuer = 'Otra'
            break;
        }
        newValues.number = value;
        break;
      case 'cardHolder':
        if (/[^a-zA-Z ]/g.test(value)) return
        newValues.cardHolder = value;
        break;
      case 'expDate':
        if (new Date(value) > new Date())
          newValues.expDate = value;
        else
          newValues.expDate = '';
        break;
      case 'cvv':
        if (isNaN(value)) return;
        if (value.length > 3) return;
        newValues.cvv = value;
        break;
      default:
        break;
    }
    setNewCardInfo(newValues);
  }

  //Util
  function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hora(s) y " + rminutes + " minuto(s).";
  }

  const backCallback = () => {
    history.push(history.goBack());
  };

  const alreadyReserved = (travelInfo) => {
    const {passengers} = travelInfo;
    if (!auth.user) {
      return false;
    } else {
      return (passengers.find(p => p.id === auth.user.id))
    }
  };

  const refreshSubtotal = () => {
    const selected = newPassengerDetails.boughtAdditionals;
    if (selected.length) {
      const prices = allAdditionals.filter(elem => selected.includes(elem.id)).map(elem => elem.price);
      const n = prices.reduce((a, b) => a + b, 0);
      setSubtotal(n + details.price);
    } else {
      setSubtotal(details.price);
    }
  };

  const refreshPayment = () => {
    if (Object.values(ccErrors).find(val => val) && !checkedSavedCC) {
      setShowCcErrors(true);
      return;
    } else {
      setShowCcErrors(false);
    }
    if (checkedSavedCC)
      setSelectedCard(userCardInfo)
    else 
      setSelectedCard(newCardInfo);
  };

  //habria que chequear si travel.dateAndTime > Date.now()
  const paymentCallback = async () => {
    const booking = Object.assign(newPassengerDetails, {
      creditCard: selectedCard.number, 
      payment: (userIsVIP ? subtotal * 0.90 : subtotal), 
      id: auth.user.id, 
      accepted: false, 
      legalStatus: LEGAL_STATUS.PENDING,
      bookingStatus: BOOKING_STATES.PENDING});
    try {
      setLoading(true);
      await createBooking(booking, travelId);
      setIsShownSuccess(true);
    } catch (e) {
      setError(e);
    } finally {
      setTimeout(function(){ setLoading(false); }, 1500); //timeout simular pago
    }
  }

  const renderDetails = (details) => {
    if (!auth.user) {
      const url = `/checkout/${details.id}`;
      history.push(`/login?callbackUrl=${url}`);
    }

    if (clientBlacklisted) {
      return (
      <div>
        <Alert
          intent="danger"
          hasIcon={true}
          appearance="card"
          title="Su usuario se encuentra inhabilitado temporalmente por caso sospechoso."
          marginTop={20}
        />
      </div>)
    }

    if (alreadyReserved(details)) {
      return (
      <div>
        <Alert
          intent="danger"
          hasIcon={true}
          appearance="card"
          title="Usted ya ha realizado una reserva en este viaje."
          marginTop={20}
        />
      </div>)
    }
    
    if (details.stock < 1) {
      return (
      <div>
        <Alert
          intent="danger"
          hasIcon={true}
          appearance="card"
          title="Viaje sin asientos disponibles."
          marginTop={20}
        />
      </div>)
    };


    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    
    return (
      <Pane
        marginTop={20}
        marginBottom={100}
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

        {error && (
        <Alert intent="danger" 
          title="Tuvimos un Error"
        > {error.toString()}
        </Alert>
        )}
        {!error && (
        <div>
          <div>
          <div>
              <InlineAlert intent="none">
                Detalles:
              </InlineAlert>
            </div>
            <div>
              <Strong size={400}>Fecha y hora de salida: </Strong>
              <Text>
                {new Date(details.dateAndTime).toLocaleDateString("es-AR", options)}
              </Text>
            </div>
            <div>
              <Strong size={400}>Ruta: </Strong>
              <Text>{`${routeDetails.origin} / ${routeDetails.destination}`}</Text>
            </div>
            <div>
              <Strong size={400}>Duraci??n estimada: </Strong>
              <Text>{`${timeConvert(routeDetails.durationMin)}`}</Text>

            </div>

            <hr/>

            <div>
              <InlineAlert intent="warning" marginBottom={10} marginTop={10}>
                Prepare su reserva:
              </InlineAlert>
            </div>
            <div style={{marginBottom: 10}}>
              <Strong size={400}> {details.availableAdditionals.length ? 'Adicionales disponibles:' : 'No hay adicionales disponibles para este viaje.'} </Strong>
              <Pane display="flex" flexWrap="wrap">
                <ul style={{ margin: "0" }}>{renderAdditionals()}</ul>
              </Pane>
            </div>
            <div>
              <EditIcon color="selected" marginRight={8} />
              <Strong size={400}>Informaci??n de pago: </Strong>
            </div>

            {userHasSavedCC ? renderSavedCCCheckbox() :
              <Alert
              intent="none"
              hasIcon={false}
              appearance="card"
              title="Pod??s asociar una tarjeta navegando a tu perfil"
              marginBottom={8}
              marginTop={8}
            />}

              {!checkedSavedCC && (
              <Pane width={'40vh'} marginBottom={20} marginTop={15}>
                <TextInputField
                  width={'40vh'}
                  label="Emisor"
                  value={newCardInfo.issuer}
                  placeholder="Autocompletado"
                  disabled
                />
                <TextInputField
                  width={'40vh'}
                  label="Numero"
                  value={newCardInfo.number}
                  onChange={e => handleInput('number', e.target.value)}
                  required
                  validationMessage={showCcErrors && ccErrors.number ? "Campo Requerido o inv??lido" : null}
                />
                <TextInputField
                  width={'40vh'}
                  label="Titular"
                  value={newCardInfo.cardHolder}
                  onChange={e => handleInput('cardHolder', e.target.value)}
                  required
                  validationMessage={showCcErrors && ccErrors.cardHolder ? "Campo Requerido o inv??lido" : null}
                />
                <FormField
                  width={'40vh'}
                  marginBottom={20}
                  required
                  label="Fecha de Vencimiento"
                  validationMessage={showCcErrors && ccErrors.expDate ? "Campo Requerido o inv??lido" : null}
                >
                  <input
                    type="date"
                    value={newCardInfo.expDate}
                    onChange={e => handleInput('expDate', e.target.value)}
                    min={(new Date()).day}
                    max="2030-31-12"
                  />
                </FormField>
                <TextInputField
                  width={'20vh'}
                  label="CVV"
                  value={newCardInfo.cvv}
                  onChange={e => handleInput('cvv', e.target.value)}
                  required
                  validationMessage={showCcErrors && ccErrors.cvv ? "Campo Requerido o inv??lido" : null}
                />
              </Pane>
              )}

            <hr/>

            <div>
              <InlineAlert intent="none" marginBottom={10} marginTop={10}>
                Subtotal: {`$${subtotal}`}
              </InlineAlert>
            </div>
            {userIsVIP && (
             <div>
              <InlineAlert intent="success" marginBottom={10} marginTop={10}>
                Descuento VIP del 10% aplicado: -${subtotal * 0.10}
              </InlineAlert>
            </div>)}

            <hr/>

            <div>
              <Strong size={600}>Total a pagar: ${userIsVIP ? subtotal * 0.90 : subtotal}</Strong>
            </div>

          </div>

          <Button
            width={"65vh"}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="none"
            iconBefore={SavedIcon}
            marginTop="15"
            disabled={!checkedSavedCC && (Object.values(ccErrors).find(val => val))}
            onClick={() => paymentCallback()}
          >
            Pagar y Reservar
          </Button>

          <Dialog
            isShown={isShownSuccess}
            title="Reserva exitosa"
            onCloseComplete={() => history.push('/bookings')}
            confirmLabel="Ver Reservas"
            hasCancel={false}
            intent="success"
          > {selectedCard.number ? 
              (`Pago de $${userIsVIP ? subtotal * 0.90 : subtotal} realizado. Con tarjeta ${selectedCard.issuer} - Terminada en ${selectedCard.number.slice(-4)}`)
              : null}
          </Dialog>

        </div>)}
      </Pane>
    );
  };

  return (
    <div>
      {loading && <Spinner />}
      {!loading && renderDetails(details)}
    </div>
  );
}
