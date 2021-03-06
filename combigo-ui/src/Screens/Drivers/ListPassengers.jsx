import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Pane,
  Spinner,
  BackButton,
  Button,
  Table,
  Checkbox,
  PlusIcon,
  Popover,
  Badge,
  toaster
} from 'evergreen-ui';

import QrReader from 'react-qr-reader';

import { LEGAL_STATUS, TRAVEL_STATES, BOOKING_STATES } from '../../constants.js';

import { getATravelDetails, getClients, acceptPassenger } from './driversStore';

export const ListPassengers = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [travel, setTravel] = useState([]);
  const [clients, setClients] = useState([]);
  const [travelsLoaded, setTravelsLoaded] = useState(false);
  const [ClientsLoaded, setClientsLoaded] = useState(false);
  const closeRef = useRef();
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const clientsResponse = await getClients();
      if (clientsResponse.length) {
        setClients(clientsResponse);
        setClientsLoaded(true);
      }
    }
    async function initialize() {
      setLoading(true);
      try {
        const travelResponse = await getATravelDetails(travelId);
        if (travelResponse.passengers) { //Antes era travelResponse.passengers.length que da negativo si es igual a 0 parece
          setTravel(travelResponse);
          setTravelsLoaded(true);
        }
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
    history.push('/driverTravels');
  }

  //Recarga los viajes para que las checkbox se actualicen sss
  async function reloadTravel() {
    setLoading(true);
    try {
      const travelResponse = await getATravelDetails(travelId);
      if (travelResponse.passengers.length) {
        setTravel(travelResponse);
        setTravelsLoaded(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  //Ocurre cuand ose apreta aceptar
  const triggerAccept = async (travelId, userId) => {    
    try {
      setLoading(true);
      await acceptPassenger(travelId, userId);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      reloadTravel();
    }
  }

  const handleError = (err, close) => {
    console.error(err);
    toaster.danger('Tuvimos un error iniciando el scanner');
  };

  const handleScan = async (data, close) => {
    if (data) {
      const result = JSON.parse(data);
      if (result.travelId && result.userId) {
        try {
          await acceptPassenger(result.travelId, result.userId);
          toaster.success('Ticket Valido', {
            id: 'scan-success',
            duration: 5
          });
        } catch (e) {
          toaster.danger(e.toString(), {
            id: 'scan-error',
            duration: 10
          });
        }
      } else {
        toaster.danger('Ticket no Valido', {
          id: 'scan-error',
          duration: 10
        });
      }
      // Ocultar popover
      closeRef.current.click();
      reloadTravel();
    }
  };

  const renderPlaceholder = () => (
    
    <Pane
      marginTop={20}
      display="flex"
      alignItems="center"
      flexDirection="column">
      <BackButton
        appearance="minimal"
        alignSelf="flex-start"
        marginLeft={10}
        marginBottom={10}
        onClick={() => backCallback()}
      >
        Volver
      </BackButton>
    <div style={{padding: "30px"}}>No hay pasajeros para este viaje</div>
  </Pane>
  );

  //Solo cuando no hay pasageros
  const renderPlaceholderAddNewPassenger = ( travel ) => (

    <Pane
      marginTop={20}
      display="flex"
      alignItems="center"
      flexDirection="column">
      <BackButton
        appearance="minimal"
        alignSelf="flex-start"
        marginLeft={10}
        marginBottom={10}
        onClick={() => backCallback()}
      >
        Volver
      </BackButton>
    <div style={{padding: "30px"}}>No hay pasajeros para este viaje</div>

      <Button
        iconBefore={PlusIcon}
        is={Link}
        to={`/driverTravels/passengers/addNewPassanger/${travel.id}`}
        disabled={ (travel.stock <= 0) || (travel.status !== TRAVEL_STATES.IN_PROGRESS)}
        marginTop={10}
        intent="success"
      >
        Agregar pasajero sin reserva
      </Button>
  </Pane>
  );

  const decideBookingStatusColor = (status) => {
    let color = "";
    switch(status) {
      case BOOKING_STATES.PENDING:
        color = "blue";
        break;
      default:
        color = "neutral";
    }
    return color;
  };

  const decideLegalStatusColor = (status) => {
    let color = "";
    switch(status) {
      case LEGAL_STATUS.PENDING:
        color = "blue";
        break;
      case LEGAL_STATUS.APPROVED:
        color = "green";
        break;
      case LEGAL_STATUS.REJECTED:
        color = "red";
        break;
      default:
        color = "neutral";
    }
    return color;
  };

  const renderPassangers = (travel, clients) => {
    if ( !travelsLoaded ) {
      return renderPlaceholder();
    }
    if (travel.passengers.length < 1 ) {
      return renderPlaceholderAddNewPassenger( travel );
    }
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
        className="travel-container"
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
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado reserva
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Declaracion jurada
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Aceptado
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travel.passengers.map(passenger => (
              <Table.Row key={passenger.ticketId}>
                <Table.TextCell>
                  {travelsLoaded && ClientsLoaded && clients.find( cl => cl.id === passenger.id ).name}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && (<Badge color={decideBookingStatusColor(passenger.bookingStatus)} marginRight={8}> {passenger.bookingStatus} </Badge>)}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && (<Badge color={decideLegalStatusColor(passenger.legalStatus)} marginRight={8}> {passenger.legalStatus} </Badge>)}
                </Table.TextCell>
                <Table.TextCell>
                  <Checkbox
                    checked={passenger.accepted}
                    disabled
                  />
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Button
                    intent="success"
                    onClick={() => triggerAccept(travel.id, passenger.id) }
                    disabled={!(passenger.legalStatus === LEGAL_STATUS.APPROVED) || passenger.accepted || travel.status !== TRAVEL_STATES.NOT_STARTED }
                  >
                    Aceptar
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Popover
          content={({close}) => (
            <Pane
              width={'80vw'}
              height={'60vh'}
              paddingX={40}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
              <Button marginTop={10} onClick={close}>Cerrar</Button>
            </Pane>
          )}
        >
          <Button
            disabled={travel.status === TRAVEL_STATES.IN_PROGRESS}
            appearance="primary"
          >
            Escanear QR de ticket
          </Button>
        </Popover>
        <Button
          iconBefore={PlusIcon}
          is={Link}
          to={`/driverTravels/passengers/addNewPassanger/${travel.id}`}
          disabled={(travel.stock <= 0) || (travel.status !== TRAVEL_STATES.IN_PROGRESS)}
          marginTop={10}
          intent="success"
        >
          Agregar pasajero sin reserva
        </Button>

      </Pane>)
  };
  
  return (
    <Pane>
      <span ref={closeRef} style={{display:'none'}}></span>
      { loading && <Spinner /> }
      { !loading &&  renderPassangers(travel, clients) }
    </Pane>
  );
};