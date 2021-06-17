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
  PlusIcon,
  Pane,
} from 'evergreen-ui';

import { getDriverTravels } from './driversStore';
import { useAuth } from "../../utils/use-auth";
//import {TRAVEL_STATES} from '../../constants'

export const DriverTravels = () => {
  const auth = useAuth();
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getDriverTravels( auth.user.id );
        setTravels(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  });

  const addCallback = () => {
    history.push('/travels/add');
  }

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No hay Viajes
      <IconButton
          alignSelf="flex-end"
          marginLeft="20px"
          appearance="minimal"
          padding="30px"
          icon={PlusIcon}
          iconSize={40}
          intent="success"
          onClick={() => addCallback()}
        />
    </div>
  );
  
  const renderRowMenu = (travelId) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={``}><Menu.Item>Ver detalles...</Menu.Item></Link>
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
              Ruta
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
                  {new Date(travel.dateAndTime).toLocaleDateString('es-AR', options)}
                  
                </Table.TextCell>
                <Table.TextCell>
                  {travel.route}
                </Table.TextCell>
                <Table.TextCell>
                  {travel.vehicle|| "No asignado"}
                </Table.TextCell>
                <Table.TextCell>
                  {travel.status}
                </Table.TextCell>
                <Table.TextCell>
                  {travel.passengers.length}
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
        <IconButton
          alignSelf="flex-end"
          marginRight="30px"
          appearance="minimal"
          icon={PlusIcon}
          iconSize={40}
          intent="success"
          onClick={() => addCallback()}
        />
      </Pane>)
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderTravels(travels) }
    </div>
  );
};
