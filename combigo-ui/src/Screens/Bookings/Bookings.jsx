import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

import { getAvailableRoutes, getBookings } from './BookingsStore'; //Sacar el delete travels
import { useAuth } from "../../utils/use-auth"; //For bookings

export const Bookings = () => {
  const auth = useAuth();
  const [travels, setTravels] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getBookings(auth.user);
        setTravels(response);
        const response1 = await getAvailableRoutes();
        setRoutes(response1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [auth.user]);

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}> Usted no ha realizado reservas.
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

  const renderTravels = (travels, routes) => {
    if (travels.length < 1) {
      return renderPlaceholder();
    }
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
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
                  {new Date(travel.dateAndTime).toLocaleDateString('es-AR', options)}
                </Table.TextCell>
                <Table.TextCell>
                  <Link to={`/routes/${travel.route}`}>{routes.find(rou => rou.id === travel.route).origin}</Link>
                </Table.TextCell>
                <Table.TextCell>
                  <Link to={`/routes/${travel.route}`}>{routes.find(rou => rou.id === travel.route).destination}</Link>
                </Table.TextCell>
                <Table.TextCell>
                  {auth.user.travelHistory.find(th => th.travelId === travel.id).status}
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(travel.id)}
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
      { !loading &&  renderTravels(travels, routes) }
    </div>
  );
};
