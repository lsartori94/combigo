import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
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
import { getRouteDetails, getTravelDetails } from "./checkoutStore";

export default function Checkout() {
  let subtotal = 0;
  let { travelId } = useParams();
  const history = useHistory();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [isShownCC, setIsShownCC] = useState(false)
  const [checkedCC, setCheckedCC] = useState(false)
  const [details, setDetails] = useState({
    dateAndTime: "",
    route: "",
    availableAdditionals: [],
  });
  const [allAdditionals, setAllAdditionals] = useState([]);
  const [routeDetails, setRouteDetails] = useState({
    origin: "",
    destination: "",
    durationMin: "",
  });
  const [newPassengerDetails, setNewPassengerDetails] = useState({
    id: "",
    boughtAdditionals: [],
    total: 0,
  });

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
        setDetails(travelResponse);
        setRouteDetails(routeResponse);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId]);

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

  const renderSavedCCCheckbox = () => {
    return (
      <Checkbox
        label={`${auth.user.creditCard.issuer} - Terminada en ${auth.user.creditCard.number.slice(-5)}`}
        marginLeft={10}
        checked={checkedCC}     
        onChange={e => setCheckedCC(e.target.checked)}
      />)
  }

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

  const backCallback = () => {
    history.push(history.goBack());
  };

  //Simular pago
  const paymentCallback = async () => {
    setIsShownCC(true);
  };

  //#TODO handle inputs CC, subtotal dinámico, disable button reservar si no se eligio/llenó tarjeta
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
              <Text>{`${routeDetails.durationMin} minutos`}</Text>
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

            {auth.user.creditCard ? renderSavedCCCheckbox() :
              <Alert
              intent="none"
              hasIcon={false}
              appearance="card"
              title="Podés asociar una tarjeta navegando a tu perfil"
              marginBottom={8}
              marginTop={8}
            />}

              {!checkedCC && (
              <Pane width={'40vh'} marginBottom={20} marginTop={15}>
                <TextInputField
                  width={'40vh'}
                  label="Emisor"
                  required
                />
                <TextInputField
                  width={'40vh'}
                  label="Numero"
                  // onChange={e => handleInput('number', e.target.value)}
                  required
                />
                <TextInputField
                  width={'40vh'}
                  label="Titular"
                  // onChange={e => handleInput('cardHolder', e.target.value)}
                  required
                />
                <FormField
                  width={'40vh'}
                  marginBottom={20}
                  required
                  label="Fecha de Vencimiento"
                >
                  <input
                    type="date"
                    // onChange={e => handleInput('expDate', e.target.value)}
                    min="2021-01-01"
                    max="2030-31-12"
                  />
                </FormField>
                <TextInputField
                  width={'10vh'}
                  label="CVV"
                  // onChange={e => handleInput('cvv', e.target.value)}
                  required
                />
              </Pane>
              )}

            {renderHr()}
            <div>
              <InlineAlert intent="none" marginBottom={10} marginTop={10}>
                Subtotal: {`$${subtotal}`}
              </InlineAlert>
            </div>
          </div>

          <Button
            width={"65vh"}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="success"
            iconBefore={SavedIcon}
            marginTop="20"
            onClick={() => paymentCallback()}
          >
            Pagar y Reservar
          </Button>

          <Dialog
            isShown={isShownCC}
            title="Reserva exitosa"
            onCloseComplete={() => setIsShownCC(false)}
            confirmLabel="Ver ticket"
            hasCancel={false}
          > Viaje reservado 
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
