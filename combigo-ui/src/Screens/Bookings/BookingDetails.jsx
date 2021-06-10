import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  FormField,
  Checkbox,
  BackButton,
  Button,
  Dialog
} from 'evergreen-ui';

import { TRAVEL_STATES } from '../../constants.js';
import { useAuth } from "../../utils/use-auth"; //For bookings

import {
  getTravelDetails,
  getAvailableAditionals,
  getAvailableRoutes,
  getBookings,
  cancelBooking
} from './BookingsStore';

export const BookingDetails = () => {
  let { travelId } = useParams();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    dateAndTime: "",
    route: {
      origin: "",
      destination: ""
    },
    passengers: [],
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: []
  });
  const [availableAdditionals, setAvailableAdditionals] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const [travel, setTravel] = useState([]);
  const [showRefound, setShowRefound] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const additionals = await getAvailableAditionals();
      const routes = await getAvailableRoutes();
      const travelResponse = await getTravelDetails(travelId);
      setAvailableAdditionals(additionals);
      setAvailableRoutes(routes);
      setTravel(travelResponse)
    }
    if (travelId === 'add') {
      setNoTravel(false);
      setLoading(false);
      return;
    };
    async function initialize() {
      try {
        //setLoading(true);
        const booksResponse = await getBookings(auth.user);
        // const response = await getTravelDetails(travelId);
        const book = booksResponse.find(b => b.travelId === travelId)
        setNoTravel(false);
        setDetails(book);
        // setBookings(booksResponse);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId]);

  const backCallback = () => {
    history.push('/Bookings');
  }

  const promptCancel = () => {
    //Si no se puede cancelar el boton deberia estar desabilitado
    //Decidir si va a ser full refound o half refound

    //setFullRefound(true); //Agregar condicion!!!
    //setShowRefound(true);

    //Primero mostrar el dialog de cuidado porque se cancelara


    //Despues si lo aceptan que dependiendo de cuanto falta para el viaje se full refound o half refound

    // if (true) //if( ( details.dateAndTime - Date.new() ) > 1.728e+8 )
    //   setfullRefound(true);
    // setshowCancel(true);
    setShowRefound(true);
  }

  const fullRefoundCallback = async () => {
    //Llama al travel que cancele la reserva con todo,
    //Despues llama al usuario que ponga "FULLREFOUND" en el estado nuevo
    //Devolver el dinero? no se como hacerlo todavia
    //setShowRefound(false);
    //setFullRefound(false);
    try {
      setLoading(true);
      await cancelBooking(travelId, auth.user.id);
      history.push('/bookings');
    } catch (e) {
      console.log(e);
    } finally {
      setShowRefound(false);
      setLoading(false);
    }
  }

  const renderAdditionals = () => {
    const filtered = availableAdditionals.filter(
      a => details.boughtAdditionals.find(el => el === a.id)
    );
    return filtered.map(elem => (
      <li key={elem.id}>
        {elem.name}
      </li>
    ));
  }

  const mapRoute = () => {
    const route = availableRoutes.find(elem => elem.id === travel.route) || {};
    return `${route.origin}/${route.destination}`;
  };

  const renderDetails = (details) => {
    if (noTravel) {
      return (<div>No existe la reserva</div>)
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
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={20}
      >
        <Dialog
          isShown={showRefound}
          title="Confirmar Eliminacion"
          intent="danger"
          onConfirm={() => fullRefoundCallback()}
          onCloseComplete={() => setShowRefound(false)}
          confirmLabel="Aceptar"
          cancelLabel="Cancelar"
        >
          Esta seguro que quiere cancelar? Si quedan mas de 48hs se devolvera la totalidad del dinero
        </Dialog>
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
          label="Fecha y hora de salida"
          value={new Date(travel.dateAndTime).toLocaleDateString("es-AR", options)}
          disabled
        />
        <TextInputField
          width={'65vh'}
          label="Ruta"
          value={mapRoute()} 
          disabled
        />
        <TextInputField
          width={'65vh'}
          label="Estado de la reserva"
          value={details.status}
          disabled
        />
        <FormField
            width={'65vh'}
            marginBottom={20}
            label="Adicionales"
            description="Adicionales comprados" //Cambiar a los adicionales comprados
        >
          {availableAdditionals.length &&(<Pane display="flex" flexWrap="wrap">
            <ul>
              {renderAdditionals()}
            </ul>
          </Pane>)}
          </FormField>
        <Button 
          marginRight={16} 
          intent="danger"
          onClick={promptCancel}
          disabled={details.status !== TRAVEL_STATES.NOT_STARTED}
        >
        Cancelar Reserva
      </Button>
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
