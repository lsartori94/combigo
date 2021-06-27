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
  Pane,
  Badge,
  BackButton
} from 'evergreen-ui';

import { getClients } from './listClientsStore';
import { VIP_STATUS, VIP_STATUS_MSG } from "../../constants";

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await getClients();
        setClients(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const backCallback = () => {
    history.push('/clients');
  }

  const renderPlaceholder = () => (
    <Pane
      marginTop={20}
      display="flex"
      alignItems="center"
      flexDirection="column">
      <BackButton
        appearance="minimal"
        alignSelf="flex-start"
        marginLeft={10}
        marginBottom={10}
        onClick={() => backCallback()}
      >
        Volver
      </BackButton>
    <div style={{padding: "30px"}}>No hay clientes registrados en el sistema.</div>
  </Pane>
  );
  
  // const renderRowMenu = (uname) => {
  //     return (
  //       <Menu>
  //         <Menu.Group>
  //         <Link to={`/clients/${uname}`}><Menu.Item>Detalles</Menu.Item></Link>
  //         </Menu.Group>
  //       </Menu>
  //     )
  // }

  const renderClients = (clients) => {
    if (clients.length < 1) {
      return renderPlaceholder();
    }

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Nombre de Usuario
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Nombre
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Email
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Fecha de alta
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado VIP
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {clients.map(client => (
              <Table.Row key={client.username}>
                <Table.TextCell>{client.username}</Table.TextCell>
                <Table.TextCell>{client.name}</Table.TextCell>
                <Table.TextCell>{client.email}</Table.TextCell>
                <Table.TextCell>{new Date(client.registerDate).toLocaleDateString('es-AR', options)}</Table.TextCell>
                {client.vip.status === VIP_STATUS.ENROLLED ? (
                  <Table.TextCell> <Badge color='green'> {VIP_STATUS_MSG[client.vip.status]}</Badge> desde el: {new Date(client.vip.startDate).toLocaleDateString('es-AR').split('T')} </Table.TextCell>) : (
                  <Table.TextCell> <Badge color='neutral'> {VIP_STATUS_MSG[client.vip.status]}</Badge> </Table.TextCell>)}
                <Table.Cell flex="none">
                  {/* <Popover
                    content={renderRowMenu(client.username)}
                    position={Position.BOTTOM_RIGHT}
                  >
                    <IconButton icon={MoreIcon} height={24} appearance="minimal" />
                  </Popover> */}
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
      { !loading &&  renderClients(clients) }
    </div>
  );
};
