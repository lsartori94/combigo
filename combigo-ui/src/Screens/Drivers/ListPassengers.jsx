import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Pane,
  TextInputField,
  Spinner,
  BackButton,
  Button,
  Dialog,
  EditIcon,
  Table,
  Popover,
  Position,
  Menu,
  IconButton,
  MoreIcon,
  Checkbox
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

  const triggerAccept = async (travelId, userId) => {    
    try {
      setLoading(true);
      await acceptPassenger(travelId, userId);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  // const triggerStartTravel = async (travelId) => {    
  //   try {
  //     setLoading(true);
  //     await startTravel(travelId); //Necesitamos hacerlo
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // } //Esto va a estar en ver viajes fdfsdf

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No hay pasajeros para este viaje
    </div>
  );

  const renderPassangers = (travel, clients) => {
    if ( !travelsLoaded || travel.passengers.length < 1) {
      return renderPlaceholder();
    }
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
        className="travel-container"
      >
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado legal
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Aceptado
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
                  />
                </Table.TextCell>
                <Table.Cell flex="none">
                <Button
                  onClick={triggerAccept}
                  disabled={!(passenger.legalStatus === LEGAL_STATUS.APPROVED) || passenger.accepted}
                  >
                    Aceptar
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>)
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderPassangers(travel, clients) }
    </div>
  );
};