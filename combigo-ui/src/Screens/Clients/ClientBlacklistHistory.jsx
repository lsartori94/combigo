import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import {
  Table,
  Spinner,
  Pane,
  Badge,
  BackButton
} from 'evergreen-ui';

import { getClientBlacklist } from './listClientsStore';

export const ClientBlacklistHistory = () => {
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const {userId} = useParams();

  useEffect(() => {
    async function initialize() {
      try {
        const blacklistResponse = await getClientBlacklist(userId);
        setBlacklist(blacklistResponse);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [userId]);

  const backCallback = () => {
    history.push('/clientsBlacklist');
  }

  const renderBlacklist = (blacklist) => {

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
      <BackButton
        appearance="minimal"
        alignSelf="flex-start"
        marginLeft={10}
        marginBottom={10}
        onClick={() => backCallback()}
      >
        Volver
      </BackButton>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Fecha rechazo
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Fecha fin
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado actual
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            <Table.Row key={blacklist.userId}>
              <Table.TextCell>{new Date(blacklist.startDate).toLocaleDateString('es-AR', options)}</Table.TextCell>
              <Table.TextCell>{new Date(blacklist.endDate).toLocaleDateString('es-AR', options)}</Table.TextCell>
              <Table.TextCell>{(new Date() < new Date(blacklist.endDate)) ? 
                <Badge color='red'> Vigente </Badge> : <Badge color='neutral'> Vencida </Badge>}
              </Table.TextCell>
              <Table.Cell flex="none">
              </Table.Cell>
            </Table.Row>
            {blacklist.history.map(each => (
              <Table.Row key={blacklist.userId}>
                <Table.TextCell>{new Date(each.startDate).toLocaleDateString('es-AR', options)}</Table.TextCell>
              <Table.TextCell>{new Date(each.endDate).toLocaleDateString('es-AR', options)}</Table.TextCell>
              <Table.TextCell>{(new Date() <= new Date(each.endDate)) ? 
                <Badge color='red'> Vigente </Badge> : <Badge color='neutral'> Vencida </Badge>}
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
      { !loading &&  renderBlacklist(blacklist) }
    </div>
  );
};
