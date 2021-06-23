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
  Pane,
} from 'evergreen-ui';

import { getDriverTravels, getAvailableVehicles, getAvailableRoutes } from './driversStore';
import { useAuth } from "../../utils/use-auth";
import {TRAVEL_STATES} from '../../constants'

export const DriverTravels = () => {
  const auth = useAuth();
  const history = useHistory();
  const [travels, setTravels] = useState([]);
  const [routes, setRoutes] = useState([]);
  //const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [travelsLoaded, setTravelsLoaded] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const routesResponse = await getAvailableRoutes();
        const response = await getDriverTravels( auth.user.id );
        //const vehiclesResponse = await getAvailableVehicles();
        //setVehicles(vehiclesResponse);
        setRoutes(routesResponse);
        if (response.length) {
          setTravels(response);
          setTravelsLoaded(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  },[auth.user, history]);

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No posee viajes asignados activos
    </div>
  );
  
  const renderRowMenu = (travelId) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/driverTravels/passengers/${travelId}`}><Menu.Item>Ver pasajeros</Menu.Item></Link>
          </Menu.Group>
        </Menu>
      )
  }

  const renderTravels = (travels) => {
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
        className="travel-container"
      >
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Fecha
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Origen
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Destino
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Vehiculo
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Cantidad de Pasajeros
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travels.map(travel => (
              <Table.Row key={travel.id}>
                <Table.TextCell>
                  {travelsLoaded && new Date(travel.dateAndTime).toLocaleDateString('es-AR', options)}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && routes.find(rou => rou.travels.includes(travel.id)).origin}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && routes.find(rou =>rou.travels.includes(travel.id)).destination}
                </Table.TextCell>
                <Table.TextCell>
                  {/* {travelsLoaded && ( vehicles.find(ve => ve.id === travel.vehicle ) || "No asignado" ) */
                   travelsLoaded && travel.vehicle}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && travel.status}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && travel.passengers.length}
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
      { !loading &&  renderTravels(travels) }
    </div>
  );
};
