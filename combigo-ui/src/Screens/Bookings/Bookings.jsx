import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import {
  Table,
  Popover,
  Position,
  Menu,
  IconButton,
  Spinner,
  MoreIcon,
  Pane,
  Badge
} from 'evergreen-ui';

import { getAvailableRoutes, getBookings, getAllTravels } from './BookingsStore';
import { useAuth } from "../../utils/use-auth";
import { TRAVEL_STATES } from '../../constants';

export const Bookings = () => {
  const auth = useAuth();
  const history = useHistory();
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoaded, setBookingsLoaded] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const routesResponse = await getAvailableRoutes();
        const booksResponse = await getBookings(auth.user);
        const travelsResponse = await getAllTravels();
        setRoutes(routesResponse);
        setTravels(travelsResponse);
        if (booksResponse.length) {
          setBookings(booksResponse);
          setBookingsLoaded(true);
        }
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [auth.user, history]);

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}> Usted no ha realizado reservas.
    </div>
  );

  const decideStatusColor = (status) => {
    let color = "";
    switch(status) {
      case TRAVEL_STATES.NOT_STARTED:
        color = "blue";
        break;
      case TRAVEL_STATES.IN_PROGRESS:
        color = "green";
        break;
      default:
        color = "neutral";
    }
    return color;
  };
  
  const renderRowMenu = (travelId, bookingId) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/bookingDetails/${travelId}/${bookingId}`}><Menu.Item>Detalles</Menu.Item></Link>
          </Menu.Group>
        </Menu>
      )
  }

  const renderBookings = (bookings, routes) => {
    if (bookings.length < 1) {
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
            {bookings.map(booking => (
              <Table.Row key={booking.bookingId}>
                <Table.TextCell>
                  {travels.length && new Date(travels.find(trv => trv.id === booking.travelId).dateAndTime).toLocaleDateString('es-AR', options)}
                </Table.TextCell>
                <Table.TextCell>
                  {bookingsLoaded && routes.find(rou => rou.travels.includes(booking.travelId)).origin}
                </Table.TextCell>
                <Table.TextCell>
                  {bookingsLoaded && routes.find(rou =>rou.travels.includes(booking.travelId)).destination}
                </Table.TextCell>
                <Table.TextCell>
                  <Badge color={decideStatusColor(booking.status)} marginRight={8}> {booking.status} </Badge>
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(booking.travelId, booking.bookingId)}
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
      { !loading &&  renderBookings(bookings, routes) }
    </div>
  );
};
