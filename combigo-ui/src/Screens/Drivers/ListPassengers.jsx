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

import { getTravelDetails } from './driversStore';

export const ListPassengers = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [travel, setTravel] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const travelResponse = await getTravelDetails(travelId);
        setTravel(travelResponse);
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

  const renderRowMenu = () => {
    return (
      <Menu>
        <Menu.Group>
        <Link to={``}><Menu.Item>Aprovar pasajero</Menu.Item></Link>
        </Menu.Group>
      </Menu>
    )
  }

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No hay pasajeros para este viaje
    </div>
  );

  const renderPassangers = (travelDetails) => {
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
              Estado legal
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travelDetails.passengers.map(passgenger => (
              <Table.Row key={passgenger.id}>
                <Table.TextCell>
                  {passgenger.legalStatus}
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(passgenger.id)}
                    position={Position.BOTTOM_RIGHT}
                  >
                    <IconButton icon={MoreIcon} height={24} appearance="minimal" />
                  </Popover>
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
      { !loading &&  renderPassangers(travel) }
    </div>
  );
};