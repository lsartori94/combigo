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

import { getAdditionals } from "../Additionals/additionalsStore";
import { getRouteDetails, getTravelDetails, getUserCC } from "./checkoutStore";

export default function Checkout() {
  let { travelId } = useParams();
  const history = useHistory();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [isShownSuccess, setIsShownSuccess] = useState(false);
  const [checkedSavedCC, setCheckedSavedCC] = useState(false);
  const [userHasSavedCC, setUserHasSavedCC] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  //Detalles del viaje
  const [allAdditionals, setAllAdditionals] = useState([]);
  const [details, setDetails] = useState({
    dateAndTime: '',
    route: '',
    availableAdditionals: [],
  });
  const [routeDetails, setRouteDetails] = useState({
    origin: '',
    destination: '',
    durationMin: '',
  });

  //Detalles del pasajero
  const [newPassengerDetails, setNewPassengerDetails] = useState({
    id: '',
    boughtAdditionals: [],
    total: 0,
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
      const additionals = await getAdditionals();
      setAllAdditionals(additionals);
    }
    async function initialize() {
      try {
        setLoading(true);
        const travelResponse = await getTravelDetails(travelId);
        const routeResponse = await getRouteDetails(travelResponse.route);
        const userCCInfo = await getUserCC(auth.user);
        setDetails(travelResponse);
        setRouteDetails(routeResponse);
        if (userCCInfo.number) {
          setUserCardInfo(userCCInfo);
          setUserHasSavedCC(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId, auth.user, history]);

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
            newValues.issuer = ''
            break;
        }
        newValues.number = value;
        break;
      case 'cardHolder':
        if (/[^a-zA-Z]/g.test(value)) return
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
  const renderHr = () => {
    return (
      <hr
        style={{
          color: "#000000",
          backgroundColor: "#000000",
          borderColor: "#000000",
        }}
      />
    );
  };

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

  //debug
  const ss = () => {
    console.log(userCardInfo);
  };

  //reemplazar 0 por travel price
  const refreshSubtotal = () => {
    const selected = newPassengerDetails.boughtAdditionals;
    if (selected.length) {
      const prices = allAdditionals.filter(elem => selected.includes(elem.id)).map(elem => elem.price);
      const n = prices.reduce((a, b) => a + b, 0);
      setSubtotal(n);
    } else {
      setSubtotal(0);
    }
  };

  //Simular pago, #TODO spinner en dialog
  const paymentCallback = async () => {
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
    setIsShownSuccess(true);
  };

  //#TODO subtotal dinámico, sección descuento VIP
  const renderDetails = (details) => {
    if (!auth.user) {
      const url = `/checkout/${details.id}`;
      history.push(`/login?callbackUrl=${url}`);
    }

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
              <Strong size={400}>Duración estimada: </Strong>
              <Text>{`${timeConvert(routeDetails.durationMin)}`}</Text>

            </div>
            {renderHr()}
            <div>
              <InlineAlert intent="warning" marginBottom={10} marginTop={10}>
                Prepare su reserva:
              </InlineAlert>
            </div>
            <div>
              <Strong size={400}>Adicionales disponibles: </Strong>
              <Pane display="flex" flexWrap="wrap">
                <ul style={{ margin: "0" }}>{renderAdditionals()}</ul>
              </Pane>
            </div>
            <div>
              <EditIcon color="selected" marginRight={8} />
              <Strong size={400}>Información de pago: </Strong>
            </div>

            {userHasSavedCC ? renderSavedCCCheckbox() :
              <Alert
              intent="none"
              hasIcon={false}
              appearance="card"
              title="Podés asociar una tarjeta navegando a tu perfil"
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
                  validationMessage={showCcErrors && ccErrors.number ? "Campo Requerido o inválido" : null}
                />
                <TextInputField
                  width={'40vh'}
                  label="Titular"
                  value={newCardInfo.cardHolder}
                  onChange={e => handleInput('cardHolder', e.target.value)}
                  required
                  validationMessage={showCcErrors && ccErrors.cardHolder ? "Campo Requerido o inválido" : null}
                />
                <FormField
                  width={'40vh'}
                  marginBottom={20}
                  required
                  label="Fecha de Vencimiento"
                  value={newCardInfo.expDate}
                  validationMessage={showCcErrors && ccErrors.expDate ? "Campo Requerido o inválido" : null}
                >
                  <input
                    type="date"
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
                  validationMessage={showCcErrors && ccErrors.cvv ? "Campo Requerido o inválido" : null}
                />
              </Pane>
              )}

            {renderHr()}
            <div>
              <InlineAlert intent="none" marginBottom={10} marginTop={10}>
                Subtotal: {`$${subtotal}`}
              </InlineAlert>
            </div>

             {/* No se desde donde llamar a refresh para que funcione bien */}
             <Button
            display="flex"
            justifyContent="center"
            marginBottom={8}
            onClick={() => refreshSubtotal()}
            > refresh subtotal 
            </Button>

          </div>

          <Button
            width={"65vh"}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="success"
            iconBefore={SavedIcon}
            marginTop="20"
            disabled={!checkedSavedCC && !ccErrors}
            onClick={() => paymentCallback()}
          >
            Pagar y Reservar
          </Button>

          <Dialog
            isShown={isShownSuccess}
            title="Reserva exitosa"
            onCloseComplete={() => setIsShownSuccess(false)}
            confirmLabel="Ver ticket"
            hasCancel={false}
          > {selectedCard.number ? (`Pago de $${subtotal} realizado. Con tarjeta ${selectedCard.issuer} - Terminada en ${selectedCard.number.slice(-4)}`) : null}
          </Dialog>

        </div>
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
