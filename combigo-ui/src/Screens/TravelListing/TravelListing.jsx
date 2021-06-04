import React, {useEffect, useState} from 'react'
import { Alert, BackButton, Button, Pane, Spinner } from 'evergreen-ui';
import { useHistory, useParams } from 'react-router'

import { getDetailsForRoute, getTravelsForRoute } from './TravelListingStore';
import { useAuth } from '../../utils/use-auth';

export default function TravelListing() {
  const {routeId} = useParams();
  const history = useHistory();
  const auth = useAuth();
  const [travels, setTravels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeDetails, setRouteDetails] = useState({})

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      try {
        const res = await getTravelsForRoute(routeId);
        const det = await getDetailsForRoute(routeId);
        setTravels(res);
        setRouteDetails(det);
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [routeId]);

  const navigate = (url) => history.push(url);
  const handleBtnClick = (selectedTravel) => {
    const url = `/checkout/${selectedTravel.id}`;
    if (auth.user) {
      navigate(url);
    } else {
      navigate(`/login?callbackUrl=${url}`);
    }
  }

  const backCallback = () => history.push('/');

  const travelItem = (info) => (
    <Pane
      borderRadius={15}
      background="tint2"
      width={'90vw'}
      minHeight={100}
      elevation={2}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
      paddingX={20}
      marginBottom={20}
    >
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop={25}
        width={'100%'}
      >
        <Pane>
          {routeDetails.origin} - {routeDetails.destination}
        </Pane>
        <Pane>
          <Pane>
            Fecha Salida: {info.dateAndTime.split('T')[0].split('-').reverse().join('-')}
          </Pane>
          <Pane>
            Hora Salida: {info.dateAndTime.split('T')[1]}
          </Pane>
        </Pane>
        <Button appearance="primary" intent="none" onClick={() =>handleBtnClick(info)}>Reservar</Button>
      </Pane>
      {info.stock < 3 && <Pane fontSize={12} fontStyle="italic" color="#FFB020">Ultimos Asientos!</Pane>}
    </Pane>
  );

  const renderTravels = (travels) => {
    return (
      <Pane>
        {travels.map(travelItem)}
      </Pane>
    );
  }

  return (
    <Pane
      width={'100vw'}
      display='flex'
      flexDirection="column"
      alignItems="center"
      paddingTop={45}
    >
      {loading && <Spinner></Spinner>}
      {!loading && (
        <>
          {error && (
            <Alert
              title="Tuvimos un error"
              intent="danger"
            >
              {`${error}`}
            </Alert>
          )}
          {travels.length && routeDetails.origin && renderTravels(travels) || null}
          {!travels.length && (
            <>
              <Alert
                title="No Hay Viajes Disponibles Para la Ruta"
                intent="warning"
                marginBottom={20}
              />
              <BackButton appearance="minimal" onClick={() => backCallback()}>Volver</BackButton>
            </>
          )}
        </>
      )}
    </Pane>
  )
}
