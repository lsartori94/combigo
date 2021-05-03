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

import { getVehicles, deleteVehicle } from './vehiclesStore';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVeh, setSelectedVeh] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getVehicles();
        setVehicles(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const deleteVeh = async (id) =>{
    try {
      const response = await deleteVehicle(id);
      setVehicles(response);
    } catch (e) {
      console.error(e);
    }
  }

  const promptDelete = (id) => {
    setSelectedVeh(id);
    setShowDelete(true);
  }

  const deleteCallback = () => {
    deleteVeh(selectedVeh);
    setShowDelete(false);
  }

  const addCallback = () => {
    history.push('/vehicles/add');
  }

  const renderPlaceholder = () => (
    <div>No Hay Vehiculos</div>
  );
  
  const renderRowMenu = (id) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/vehicles/${id}`}><Menu.Item>Editar...</Menu.Item></Link>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptDelete(id)}>Eliminar...</Menu.Item>
          </Menu.Group>
        </Menu>
      )
  }

  const renderVehicles = (vehicles) => {
    if (vehicles.length < 1) {
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
        >
          Los Vehiculos eliminados no pueden recuperarse. Esta seguro de que quiere eliminar?
        </Dialog>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Marca
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Patente
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Capacidad
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {vehicles.map(veh => (
              <Table.Row key={veh.id}>
                <Table.TextCell>{veh.name}</Table.TextCell>
                <Table.TextCell>{veh.brand}</Table.TextCell>
                <Table.TextCell>{veh.plate}</Table.TextCell>
                <Table.TextCell isNumber>
                  {veh.capacity}
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(veh.id)}
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
      { !loading &&  renderVehicles(vehicles) }
    </div>
  );
};
