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

import { getAdditionals, deleteAdditional } from './additionalsStore';

export const Additionals = () => {
  const [additionals, setAdditionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdditional, setSelectedAdditional] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getAdditionals();
        setAdditionals(response);
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
      await deleteAdditional(uname);
      const response = await getAdditionals();
        setAdditionals(response);
    } catch (e) {
      console.error(e);
    }
  }

  const promptDelete = (uname) => {
    setSelectedAdditional(uname);
    setShowDelete(true);
  }

  const deleteCallback = () => {
    deleteDriver(selectedAdditional);
    setShowDelete(false);
  }

  const addCallback = () => {
    history.push('/additionals/add');
  }

  const renderPlaceholder = () => (
    // mejorar style
    <div>No hay Choferes
      <IconButton
          alignSelf="flex-end"
          marginRight="30px"
          appearance="minimal"
          icon={PlusIcon}
          iconSize={40}
          intent="success"
          onClick={() => addCallback()}
        />
    </div>
  );
  
  const renderRowMenu = (addId) => {
      return (
        <Menu>
          <Menu.Group>
          <Link to={`/additionals/${addId}`}><Menu.Item>Editar...</Menu.Item></Link>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptDelete(addId)}>Eliminar...</Menu.Item>
          </Menu.Group>
        </Menu>
      )
  }

  const renderAdditionals = (additionals) => {
    if (additionals.length < 1) {
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
          Los Adicionales eliminados no pueden recuperarse. Esta seguro de que quiere eliminar?
        </Dialog>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              ID
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {additionals.map(additional => (
              <Table.Row key={additional.id}>
                <Table.TextCell>{additional.id}</Table.TextCell>
                <Table.TextCell>{additional.name}</Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={renderRowMenu(additional.id)}
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
      { !loading &&  renderAdditionals(additionals) }
    </div>
  );
};
