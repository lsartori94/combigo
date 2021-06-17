import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import {
  Pane,
  Spinner,
  BackButton,
  Button,
  UnorderedList,
  ListItem,
  TickIcon,
  Strong,
  Text,
  InlineAlert
} from "evergreen-ui";

import { TRAVEL_STATES } from '../../constants.js';
import { useAuth } from "../../utils/use-auth";

import {
  getTravelDetails,
  getAvailableAditionals,
  getAvailableRoutes,
  getBookings,
} from "./BookingsStore";

export const Ticket = () => {
  let { travelId, bookingId } = useParams();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState({
    travelId: "",
    status: "",
    boughtAdditionals: [],
    payment: 0
  });
  const [availableAdditionals, setAvailableAdditionals] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const [travel, setTravel] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const additionals = await getAvailableAditionals();
      const routes = await getAvailableRoutes();
      const travelResponse = await getTravelDetails(travelId);
      setAvailableAdditionals(additionals);
      setAvailableRoutes(routes);
      setTravel(travelResponse);
    }
    async function initialize() {
      try {
        const booksResponse = await getBookings(auth.user);
        const book = booksResponse.find((b) => b.bookingId === bookingId);
        setNoTravel(false);
        setBookDetails(book);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId, bookingId]); // eslint-disable-line

  const backCallback = () => {
    history.push(history.goBack());
  };

  // TODO: QR
  const qrCallback = () => {
    return;
  };

  const renderAdditionals = () => {
    const filtered = availableAdditionals.filter((a) =>
      bookDetails.boughtAdditionals.find((el) => el === a.id)
    );
    return filtered.map((elem) => (
      <ListItem>
        {elem.name} - ${elem.price}
      </ListItem>
    ));
  };

  const mapRoute = () => {
    const route =
      availableRoutes.find((elem) => elem.id === travel.route) || {};
    return `${route.origin} / ${route.destination}`;
  };

  const renderDetails = (bookDetails) => {
    if (noTravel) {
      return <div>No existe el ticket</div>;
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

      // TODO: style pane un poco para que parezca un ticket y se diferencie de bookingDetails
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={20}
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

        <Strong size={400}>Fecha y hora de salida</Strong>
        <Text marginBottom={8}>
          {new Date(travel.dateAndTime).toLocaleDateString("es-AR", options)}
        </Text>

        <Strong size={400}>Ruta</Strong>
        <Text marginBottom={8}>{mapRoute()}</Text>

        {bookDetails.boughtAdditionals.length > 0 && (
        <Pane 
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Strong size={400}>Adicionales comprados</Strong>
            <UnorderedList icon={TickIcon} iconColor="success">
              {renderAdditionals()}
            </UnorderedList>
        </Pane>)}

        <Strong size={400} marginTop={8}>Total pagado</Strong>
        <Text>${bookDetails.payment}</Text>

        <Button
          marginTop={16}
          marginBottom={8}
          intent="success"
          appearance="primary"
          onClick={qrCallback}
          disabled={(bookDetails.status !== TRAVEL_STATES.NOT_STARTED) && (bookDetails.status !== TRAVEL_STATES.IN_PROGRESS)}
        > Generar QR
        </Button>

        {(bookDetails.status !== TRAVEL_STATES.NOT_STARTED) && (bookDetails.status !== TRAVEL_STATES.IN_PROGRESS) && (
          <InlineAlert intent="none">
            El viaje ya finalizó o la reserva fue cancelada.
          </InlineAlert> )}
      </Pane>
    );
  };

  return (
    <div>
      {loading && <Spinner />}
      {!loading && renderDetails(bookDetails)}
    </div>
  );
};
