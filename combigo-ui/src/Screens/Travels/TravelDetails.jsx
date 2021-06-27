import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon,
  Combobox,
  FormField,
  Checkbox, 
  Alert
} from 'evergreen-ui';

import { TRAVEL_STATES } from '../../constants.js';

import {
  getTravelDetails,
  saveTravelDetails,
  createTravel,
  getAvailableAditionals,
  getAvailableRoutes
} from './travelsStore';

export const TravelDetails = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    dateAndTime: "",
    route: "",
    passengers: [],
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: []
  });
  const [oldDetails, setOldDetails] = useState({});
  const [availableAdditionals, setAvailableAdditionals] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({
    dateAndTime: "",
    route: "",
    passengers: [],
    status: "",
    availableAdditionals: []
  });
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const additionals = await getAvailableAditionals();
      const routes = await getAvailableRoutes();
      setAvailableAdditionals(additionals);
      setAvailableRoutes(routes);
    }
    if (travelId === 'add') {
      setNoTravel(false);
      setCreating(true);
      setLoading(false);
      initializeExtras();
      return;
    };
    async function initialize() {
      setLoading(true);
      try {
        const response = await getTravelDetails(travelId);
        setNoTravel(false);
        setDetails(response);
        setOldDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId]);
  
  useEffect(() => {
    const prev = JSON.stringify(oldDetails);
    const act = JSON.stringify(details);
    const auxErrors = {};
    if (prev !== act) {
      setFormDirty(true);
      for (const [key, value] of Object.entries(details)) {
        switch (key) {
          default:
            if (
              !(key === 'driver' || key === 'vehicle' || key === 'stock')
              && !value
            ) {
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

  const inputCallback = (e, name, skipValidation) => {
    if (skipValidation) {
      setDetails({...details, [name]: e});
    } else {
      const {value} = e.target;
      switch (name) {
        case 'dateAndTime':
          setDetails({...details, dateAndTime: value});
        break;
        case 'route':
          setDetails({...details, route: value});
        break;
        case 'availableAdditionals':
          setDetails({...details, availableAdditionals: value});
        break;
        case 'passengers':
          setDetails({...details, passengers: value});
        break;
        default:
        break;
      }
    }
  }

  const handleCheckbox = (e) => {
    const {checked, id} = e.target;
    let newAdditionals;

    if (!checked) {
      newAdditionals = [...details.availableAdditionals.filter(el => el !== id)];
    } else {
      newAdditionals = [...details.availableAdditionals, id];
    }
    setDetails({...details, availableAdditionals: newAdditionals});
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
        await createTravel(details);
      } else {
        await saveTravelDetails(details);
      }
      setLoading(false);
      history.push('/travels');
    } catch (e) {
      setApiError(e.message)
      setSaveError(true);
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push('/travels');
  }

  const renderAdditionals = () => {
    return availableAdditionals.map(elem => {
      const checked = details.availableAdditionals.find(
        el => el === elem.id
      );
      return (
        <li key={elem.id}>
          <Checkbox
            label={elem.name}
            marginLeft={10}
            id={elem.id}
            checked={checked ? true : false}
            onChange={e => handleCheckbox(e)}
          />
        </li>)
      });
  }

  const statusDisabled = (status) =>
  !(status === TRAVEL_STATES.NOT_STARTED
  || status === TRAVEL_STATES.NO_VEHICLE) && !creating;

  const renderDetails = (details) => {
    if (noTravel) {
      return (<div>No existe Ruta</div>)
    }
    return (
      <Pane
        marginTop={20}
        marginBottom={100}
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
        {!saveError && (
        <div>

          {(!details.active && !creating) && 
          (<Alert
            title='Viaje eliminado'
            intent='warning'
            appearance='card'
            marginBottom={32}
          />)}    

          {(details.passengers.length > 0 && !statusDisabled(details.status)) &&
          (<Alert
            title='Hay pasajes vendidos para el viaje, no puede modificarse Ruta ni Fecha/Hora.'
            intent='danger'
            appearance='card'
            marginBottom={32}
          />)}

          {statusDisabled(details.status) && 
          (<Alert
            title='El viaje ya finalizó o esta en curso, no se puede editar.'
            intent='danger'
            appearance='card'
            marginBottom={32}
          />)}

          <FormField
            width={'65vh'}
            marginBottom={20}
            required
            validationMessage={showErrors && errors.dateAndTime ? "Campo Requerido o Invalido" : null}
            label="Fecha y Hora"
          >
            <input
              disabled={details.passengers.length || statusDisabled(details.status)}
              type="datetime-local"
              value={details.dateAndTime}
              onChange={e => inputCallback(e, 'dateAndTime')}
              min="2021-01-01T00:00"
              max="2025-31-12T00:00"
            />
          </FormField>

          <FormField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.route ? "Campo Requerido" : null}
            marginBottom={20}
            label="Ruta"
            description="La Ruta ya debe existir en el sistema"
          >
            <Combobox
              items={availableRoutes}
              selectedItem={availableRoutes.find(elem => elem.id === details.route)}
              label="Ruta"
              disabled={details.passengers.length > 0 || statusDisabled(details.status)}
              onChange={value => value ? inputCallback(value.id, 'route', true) : ''}
              placeholder="Ruta"
              itemToString={item => item ? `${item.origin}/${item.destination}(${item.id})` : ''}
            />
          </FormField>

          <FormField
            width={'65vh'}
            marginBottom={12}
            label="Adicionales"
            description="El adicional ya debe existir en el sistema"
            required
          >
            <Pane display="flex" flexWrap="wrap">
              <ul>
                {renderAdditionals()}
              </ul>
            </Pane>
          </FormField>

          <TextInputField
            width={'65vh'}
            disabled
            validationMessage={showErrors && errors.status ? "Campo Requerido" : null}
            label="Estado"
            value={details.status}
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
