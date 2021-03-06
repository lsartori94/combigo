import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
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
  Dialog
} from 'evergreen-ui';

import { getRoutes, deleteRoute } from './routesStore';
import { getTravels } from '../Travels/travelsStore';
import {TRAVEL_STATES} from '../../constants'

export const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteWithPending, setShowDeleteWithPending] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getRoutes();
        const travels = await getTravels();
        setRoutes(response);
        setTravels(travels);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const deleteRouteCb = async (routeId) =>{
    try {
      await deleteRoute(routeId);
      const response = await getRoutes();
        setRoutes(response);
    } catch (e) {
      console.error(e);
    }
  }

  const promptDelete = (routeId) => {
    setSelectedRoute(routeId);
    const pending = travels.find(travel => (travel.route === routeId) && (travel.status === TRAVEL_STATES.NOT_STARTED));
    if (pending)
      setShowDeleteWithPending(true);
    setShowDelete(true);
  }

  const deleteCallback = () => {
    deleteRouteCb(selectedRoute);
    setShowDelete(false);
    setShowDeleteWithPending(false);
  }

  const addCallback = () => {
    history.push('/routes/add');
  }

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No hay Rutas
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
  
  const renderRowMenu = (routeId) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/routes/${routeId}`}><Menu.Item>Editar...</Menu.Item></Link>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptDelete(routeId)}>Eliminar...</Menu.Item>
          </Menu.Group>
        </Menu>
      )
  }

  const renderRoutes = (routes) => {
    if (routes.length < 1) {
      return renderPlaceholder();
    }
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Dialog
          isShown={showDelete}
          title="Confirmar Eliminacion"
          intent="danger"
          onConfirm={() => deleteCallback()}
          onCloseComplete={() => setShowDelete(false)}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
        > {showDeleteWithPending ? "La ruta seleccionada tiene viajes pendientes, estos se cancelar??n automaticamente. ??Esta seguro de que quiere eliminar la Ruta?" 
            : "??Esta seguro de que quiere eliminar la Ruta?"}
        </Dialog>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              ID
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Origen
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Destino
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Distancia (km)
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Duracion (min)
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Viajes
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {routes.map(route => (
              <Table.Row key={route.id}>
                <Table.TextCell>{route.id}</Table.TextCell>
                <Table.TextCell>{route.origin}</Table.TextCell>
                <Table.TextCell>{route.destination}</Table.TextCell>
                <Table.TextCell>{route.distanceKm}</Table.TextCell>
                <Table.TextCell>{route.durationMin}</Table.TextCell>
                <Table.TextCell>{route.travels.length}</Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(route.id)}
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
      { !loading &&  renderRoutes(routes) }
    </div>
  );
};
