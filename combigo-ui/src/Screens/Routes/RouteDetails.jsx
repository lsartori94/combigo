import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon
} from 'evergreen-ui';

import { getRouteDetails, saveRouteDetails, createRoute } from './routesStore';

export const RouteDetails = () => {
  let { routeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    origin: "",
    destination: "",
    distanceKm: 0,
    durationMin: 0,
    travels: [],
  });
  const [oldDetails, setOldDetails] = useState({});
  const [noRoute, setNoRoute] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({
    origin: "",
    destination: "",
    distanceKm: 0,
    durationMin: 0,
    travels: [],
  });
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (routeId === 'add') {
      setNoRoute(false);
      setCreating(true);
      setLoading(false);
      return;
    };
    async function initialize() {
      try {
        setLoading(true);
        const response = await getRouteDetails(routeId);
        setNoRoute(false);
        setDetails(response);
        setOldDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [routeId]);
  
  useEffect(() => {
    const prev = JSON.stringify(oldDetails);
    const act = JSON.stringify(details);
    const auxErrors = {};
    if (prev !== act) {
      setFormDirty(true);
      for (const [key, value] of Object.entries(details)) {
        switch (key) {
          default:
            if (!value) {
              auxErrors[key] = true;
            } else {
              auxErrors[key] = false;
            }
            break;
        }
      }
      setErrors({...auxErrors});
    } else {
      setFormDirty(false);
    }
  }, [details, oldDetails]);

  const inputCallback = (e, name) => {
    const {value} = e.target;
    switch (name) {
      case 'origin':
        setDetails({...details, origin: value});
      break;
      case 'destination':
        setDetails({...details, destination: value});
      break;
      case 'distanceKm':
        if (!isNaN(+value)) {
          setDetails({...details, distanceKm: value});
        }
      break;
      case 'durationMin':
        if (!isNaN(+value)) {
          setDetails({...details, durationMin: value});
        }
      break;
      default:
      break;
    }
  }

  const restoreForm = () => {
    setDetails(oldDetails);
  }

  const saveCallback = async () => {
    if (Object.values(errors).find(val => val)) {
      setShowErrors(true);
      return;
    } else {
      setShowErrors(false);
    }
    try {
      setLoading(true);
      if (creating) {
        await createRoute(details);
      } else {
        await saveRouteDetails(details);
      }
      setLoading(false);
      history.push('/routes');
    } catch (e) {
      setApiError(e.message)
      setSaveError(true);
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push(history.goBack());
  }

  const renderDetails = (details) => {
    if (noRoute) {
      return (<div>No existe Ruta</div>)
    }
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
        {saveError && (<div>Error al guardar: {apiError}</div>)}
        {!saveError && (<div>
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.origin ? "Campo Requerido" : null}
            label="Ciudad Origen"
            placeholder="La Plata"
            description=""
            value={details.origin}
            onChange={e => inputCallback(e, 'origin')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.destination ? "Campo Requerido" : null}
            label="Ciudad Destino"
            placeholder="Chascomus"
            description=""
            value={details.destination}
            onChange={e => inputCallback(e, 'destination')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.distanceKm ? "Campo Requerido" : null}
            label="Distancia (km)"
            placeholder="20"
            description="Distancia en Kilometros"
            value={details.distanceKm}
            onChange={e => inputCallback(e, 'distanceKm')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.durationMin ? "Campo Requerido" : null}
            label="Duracion (min)"
            placeholder="20"
            description="Duracion en minutos"
            value={details.durationMin}
            onChange={e => inputCallback(e, 'durationMin')}
          />
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="none"
            iconBefore={SmallCrossIcon}
            marginBottom={10}
            onClick={() => restoreForm()}
          >
            Cancelar
          </Button>
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="warning"
            iconBefore={SavedIcon}
            onClick={() => saveCallback()}
            disabled={!formDirty}
          >
            Guardar
          </Button>
        </div>)}
      </Pane>
    );
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderDetails(details) }
    </div>
  );
};
