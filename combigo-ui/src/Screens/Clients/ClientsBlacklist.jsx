import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  Table,
  Spinner,
  Pane,
  Badge,
  BackButton,
} from 'evergreen-ui';

import { getClients, getBlacklist } from './listClientsStore';

export const ClientsBlacklist = () => {
  const [clients, setClients] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      try {
        const blacklistResponse = await getBlacklist();
        const clientsResponse = await getClients();

        console.log(blacklistResponse);
        console.log(clientsResponse);
        
        const blacklistedClients = clientsResponse.filter(c => blacklistResponse.some(b => b.userId === c.id));
        setBlacklist(blacklistResponse);
        setClients(blacklistedClients);
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
      <div style={{padding: "30px"}}>Aun no existen casos de pasajeros rechazados.</div>
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
              Estado actual
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Fecha de último rechazo
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Cantidad de veces rechazado
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {clients.map(client => (
              <Table.Row key={client.username}>
                <Table.TextCell>{client.username}</Table.TextCell>
                <Table.TextCell>{client.name}</Table.TextCell>
                <Table.TextCell>TODO</Table.TextCell>
                <Table.TextCell>TODO</Table.TextCell>
                <Table.TextCell>TODO</Table.TextCell>
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
