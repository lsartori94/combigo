import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Pane,
  Spinner,
  BackButton,
  Button,
  Table,
  Checkbox,
  PlusIcon
} from 'evergreen-ui';

import { LEGAL_STATUS, TRAVEL_STATES } from '../../constants.js';

import { getATravelDetails, getClients, acceptPassenger } from './driversStore';

export const ListPassengers = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [travel, setTravel] = useState([]);
  const [clients, setClients] = useState([]);
  const [travelsLoaded, setTravelsLoaded] = useState(false);
  const [ClientsLoaded, setClientsLoaded] = useState(false);
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
    initialize();
    initializeExtras();
  }, [travelId]);

  const backCallback = () => {
    history.push('/driverTravels');
  }

  //Recarga los viajes para que las checkbox se actualicen
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

  //Scan QR (Programar)
  const triggerScanQR = async () => {    
  }

  //Add new passanger (Programar)
  const triggerAddPassenger = async () => {    
  }

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

  const renderPassangers = (travel, clients) => {
    if ( !travelsLoaded || travel.passengers.length < 1) {
      return renderPlaceholder();
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
              Declaracion jurada
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Presente
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travel.passengers.map(passenger => (
              <Table.Row key={passenger.id}>
                <Table.TextCell>
                  {travelsLoaded && ClientsLoaded && clients.find( cl => cl.id === passenger.id ).name}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && passenger.legalStatus}
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

        <Button
          onClick={triggerScanQR}
          disabled={travel.status === TRAVEL_STATES.IN_PROGRESS}
          appearance="primary"
        >
          Escanear QR de ticket
        </Button>

        <Button
          iconBefore={PlusIcon}
          onClick={triggerAddPassenger }
          disabled={travel.stock <= 0 }
          marginTop={10}
          intent="success"
        >
          Agregar pasajero sin reserva
        </Button>

      </Pane>)
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderPassangers(travel, clients) }
    </div>
  );
};