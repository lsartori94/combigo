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

import { getDrivers, deleteUser } from './driversStore';

export const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getDrivers();
        setDrivers(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const deleteDriver = async (uname) =>{
    try {
      const response = await deleteUser(uname);
      setDrivers(response);
    } catch (e) {
      console.error(e);
    }
  }

  const promptDelete = (uname) => {
    setSelectedDriver(uname);
    setShowDelete(true);
  }

  const deleteCallback = () => {
    deleteDriver(selectedDriver);
    setShowDelete(false);
  }

  const addCallback = () => {
    history.push('/drivers/add');
  }

  const renderPlaceholder = () => (
    <div>No hay Choferes</div>
  );
  
  const renderRowMenu = (uname) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/drivers/${uname}`}><Menu.Item>Editar...</Menu.Item></Link>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptDelete(uname)}>Eliminar...</Menu.Item>
          </Menu.Group>
        </Menu>
      )
  }

  const renderDrivers = (drivers) => {
    if (drivers.length < 1) {
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
          Los choferes eliminados no pueden recuperarse. Esta seguro de que quiere eliminar?
        </Dialog>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Email
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Fecha de nacimiento
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {drivers.map(driver => (
              <Table.Row key={driver.username}>
                <Table.TextCell>{driver.name}</Table.TextCell>
                <Table.TextCell>{driver.email}</Table.TextCell>
                <Table.TextCell>{driver.bdate}</Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(driver.username)}
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
      { !loading &&  renderDrivers(drivers) }
    </div>
  );
};
