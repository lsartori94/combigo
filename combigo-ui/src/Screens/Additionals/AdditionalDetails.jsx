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

import { getAdditionalDetails, saveAdditionalDetails, createAdditional } from './additionalsStore';

export const AdditionalDetails = () => {
  let { addId: additionalId } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    name: ""
  });
  const [oldDetails, setOldDetails] = useState({});
  const [noAdditional, setNoAdditional] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({
    name: ""
  });
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (additionalId === 'add') {
      setNoAdditional(false);
      setCreating(true);
      setLoading(false);
      return;
    };
    async function initialize() {
      try {
        setLoading(true);
        const response = await getAdditionalDetails(additionalId);
        setNoAdditional(false);
        setDetails(response);
        setOldDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [additionalId]);
  
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
      case 'name':
        setDetails({...details, name: value});
      break;
      //case 'bdate':
      //  setDetails({...details, bdate: value});
      //break;
      case 'price':
        setDetails({...details, price: value});
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
        await createAdditional(details);
      } else {
        await saveAdditionalDetails(details);
      }
      setLoading(false);
      history.push('/additionals');
    } catch (e) {
      setApiError(e.message)
      setSaveError(true);
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push('/additionals');
  }

  const renderDetails = (details) => {
    if (noAdditional) {
      return (<div>No existe Adicional</div>)
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
            validationMessage={showErrors && errors.name ? "Campo Requerido" : null}
            label="Nombre de Adicional"
            placeholder="Nombre"
            description="Debe ser único en el sistema"
            value={details.name}
            onChange={e => inputCallback(e, 'name')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.price ? "Campo Requerido" : null}
            label="Precio en pesos"
            placeholder="0"
            //description="Debe ser único en el sistema"
            value={details.price}
            onChange={e => inputCallback(e, 'price')}
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
