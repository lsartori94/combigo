import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
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
  MoreIcon
} from 'evergreen-ui';

import { LEGAL_STATUS, TRAVEL_STATES } from '../../constants.js';

import { getTravelDetails, getClients, acceptPassenger } from './driversStore';

export const ListPassengers = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [travel, setTravel] = useState([]);
  const [clients, setClients] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const travelResponse = await getTravelDetails(travelId);
        const clientsResponse = await getClients();
        setTravel(travelResponse);
        setClients(clientsResponse);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [travelId]); // eslint-disable-line

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

  const triggerReject = () => {
    
  }

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No hay pasajeros para este viaje
    </div>
  );

  const renderPassangers = (travelDetails, clientDetails) => {
    if (travelDetails.passengers.length < 1) {
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
              Id
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado legal
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travelDetails.passengers.map(passenger => (
              <Table.Row key={passenger.id}>
                <Table.TextCell>
                  {passenger.legalStatus}
                </Table.TextCell>
                <Table.TextCell>
                  {clientDetails.find( cl => cl.id === passenger.id ).name}
                </Table.TextCell>
                <Table.Cell flex="none">
                <Button
                  onClick={triggerAccept}
                  disabled={!(passenger.legalStatus === LEGAL_STATUS.APPROVED) || passenger.accepted}
                  >
                    Aceptar
                  </Button>
                </Table.Cell>
                <Table.Cell flex="none">
                <Button
                  onClick={triggerReject}
                  disabled={passenger.accepted}
                  >
                    Rechazar
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