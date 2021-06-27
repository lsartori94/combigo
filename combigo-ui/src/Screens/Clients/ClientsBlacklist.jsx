import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Table,
  Spinner,
  Pane,
  Badge,
  BackButton
} from 'evergreen-ui';

import { getClients, getBlacklist } from './listClientsStore';
import './clients.css';

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

  function currentlyBlacklisted(clientId) {
    const endDate = new Date(blacklist.find(b => b.userId === clientId).endDate);
    const today = new Date();
    return today <= endDate;
  };

  const renderClients = (clients, blacklist) => {
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
        className="clients-container"
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
                <Table.TextCell>{currentlyBlacklisted(client.id) ? 
                  <Badge color='red'> Inhabilitado </Badge> : <Badge color='green'> Habilitado </Badge>}
                </Table.TextCell>
                <Table.TextCell>{new Date(blacklist.find(b => b.userId === client.id).startDate).toLocaleDateString('es-AR', options)}</Table.TextCell>
                <Table.TextCell> {` ${blacklist.find(b => b.userId === client.id).history.length + 1} - `} 
                  <Link to={`/clientsBlacklist/history/${client.id}`}>Ver historial</Link> 
                </Table.TextCell> 
                <Table.Cell flex="none">
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
      { !loading &&  renderClients(clients, blacklist) }
    </div>
  );
};
