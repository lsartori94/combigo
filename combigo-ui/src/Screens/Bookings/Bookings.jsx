import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Table,
  Popover,
  Position,
  Menu,
  IconButton,
  Spinner,
  MoreIcon,
  Pane
} from 'evergreen-ui';

import { getBookings, getTravelDetails } from './BookingsStore'; //Sacar el delete travels
import { useAuth } from "../../utils/use-auth"; //For bookings

export const Bookings = () => {
  const auth = useAuth();
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getBookings(auth.user);
        setTravels(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No hay Reservas
    </div>
  );
  
  const renderRowMenu = (travelId) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/bookingDetails/${travelId}/${auth.user.username}`}><Menu.Item>Detalles</Menu.Item></Link>
          </Menu.Group>
        </Menu>
      )
  }

  const renderTravels = (travels) => {
    if (travels.length < 1) {
      return renderPlaceholder();
    }
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
        className="Booking-container"
      >
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Fecha y Hora
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Origen
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Destino
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado de reserva
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travels.map(travel => (
              <Table.Row key={travel.id}>
                <Table.TextCell>
                  {new Date(travel.dateAndTime).toString()}
                </Table.TextCell>
                <Table.TextCell>
                  <Link to={`/routes/${travel.travelId}`}>{travel.route}</Link>
                </Table.TextCell>
                <Table.TextCell>
                  <Link to={`/routes/${travel.travelId}`}>{travel.route}</Link>
                </Table.TextCell>
                <Table.TextCell>
                  {travel.id}
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(travel.travelId)}
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
      { !loading &&  renderTravels(travels) }
    </div>
  );
};
