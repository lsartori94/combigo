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
  Dialog
} from 'evergreen-ui';

import './travels.css';
import { getTravels, deleteTravel } from './travelsStore';

export const Travels = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getTravels();
        setTravels(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const deleteRouteCb = async (uname) =>{
    try {
      await deleteTravel(uname);
      const response = await getTravels();
        setTravels(response);
    } catch (e) {
      console.error(e);
    }
  }

  const promptDelete = (uname) => {
    setSelectedTravel(uname);
    setShowDelete(true);
  }

  const deleteCallback = () => {
    deleteRouteCb(selectedTravel);
    setShowDelete(false);
  }

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
          <Link to={`/travels/${travelId}`}><Menu.Item>Editar...</Menu.Item></Link>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
          <Link to={`/travels/${travelId}/driver`}><Menu.Item>Asignar chofer</Menu.Item></Link>
          </Menu.Group>
          <Menu.Group>
          <Link to={`/travels/${travelId}/vehicle`}><Menu.Item>Asignar vehiculo</Menu.Item></Link>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptDelete(travelId)}>Eliminar...</Menu.Item>
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
        className="travel-container"
      >
        <Dialog
          isShown={showDelete}
          title="Confirmar Eliminacion"
          intent="danger"
          onConfirm={() => deleteCallback()}
          onCloseComplete={() => setShowDelete(false)}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
        >
          Los Viajes Eliminados no pueden recuperarse. Esta seguro de que quiere eliminar?
        </Dialog>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              ID
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Fecha
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Ruta
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Chofer
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Vehiculo
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Cantidad de Adicionales
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Cantidad de Pasajeros
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {travels.map(travel => (
              <Table.Row key={travel.id}>
                <Table.TextCell>
                  <Link to={`/travels/${travel.id}`}>{travel.id}</Link>
                </Table.TextCell>
                <Table.TextCell>
                  {travel.dateAndTime}
                </Table.TextCell>
                <Table.TextCell>
                  <Link to={`/routes/${travel.route}`}>{travel.route}</Link>
                </Table.TextCell>
                <Table.TextCell>
                  {(travel.driver !== " " && 
                    <Link to={`/drivers/${travel.driver}?isId=true`}>{travel.driver}</Link>) || "No asignado"}
                </Table.TextCell>
                <Table.TextCell>
                  {(travel.vehicle !== " " && 
                    <Link to={`/vehicles/${travel.vehicle}`}>{travel.vehicle}</Link>) || "No asignado"}
                </Table.TextCell>
                <Table.TextCell>
                  {travel.status}
                </Table.TextCell>
                <Table.TextCell>
                  {travel.availableAdditionals.length}
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
