import React, { useEffect, useState } from 'react';
import {
  useHistory
} from "react-router-dom";
import { Pane, Button, TextInputField, FormField, BackButton, Tooltip, IconButton, EditIcon, DeleteIcon, Dialog, Alert } from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";
import { getCreditCardInfo, saveUserCreditCardInfo, deleteCard } from './CardsStore';

export const Cards = () => {
  const auth = useAuth();
  const history = useHistory();
  const [userCardInfo, setUserCardInfo] = useState({
    issuer: '',
    number: '',
    cardHolder: '',
    expDate: '',
    cvv: ''
  });
  const [previousCardInfo, setPreviousCardInfo] = useState({});
  const [editando, setEditando] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!auth.user) {
        history.push('/login');
      }
      try {
        const uInfo = await getCreditCardInfo(auth.user.username);
        setUserCardInfo(uInfo);
      } catch (e) {
        console.error(e);
      }
    }
    initialize();
  }, [auth.user, history]);

  const handleEdit = () => {
    setPreviousCardInfo(userCardInfo);
    setEditando(true);
  }

  const handleSaveCard = async () => {
    setError(null);
    try {
      const res = await saveUserCreditCardInfo(auth.user.username, userCardInfo);
      setUserCardInfo(res);
      setPreviousCardInfo(res);
      setSaved(true);
      setEditando(false);
    } catch (e) {
      console.error(e);
      setError(e)
    }
  };

  const deleteCallback = async () => {
    setError(null);
    try {
      await deleteCard(auth.user.username);
      setUserCardInfo({});
      setPreviousCardInfo({});
    } catch (e) {
      console.error(e);
      setError(e)
    } finally {
      setShowDelete(false);
    }
  }

  const handleCancel = () => {
    setUserCardInfo(previousCardInfo);
    if (!previousCardInfo.issuer) setNewCard(false);
    setEditando(false);
  }

  const backCallback = () => {
    history.push(history.goBack());
  }

  const addCard = () => {
    setNewCard(true);
    setEditando(true);
  }

  const handleInput = (name, value) => {
    const newValues = JSON.parse(JSON.stringify(userCardInfo));
    switch (name) {
      case 'number':
        if (isNaN(value)) return;
        if (value.length > 16) return;
        switch (value[0]) {
          case '4':
            newValues.issuer = 'Visa';
            break;
          case '5':
            newValues.issuer = 'Master'
            break;
          case '3':
            newValues.issuer = 'American Express'
            break;
          default:
            newValues.issuer = ''
            break;
        }
        newValues.number = value;
        break;
      case 'cardHolder':
        if (/[^a-zA-Z0-9 ]/g.test(value)) return
        newValues.cardHolder = value;
        break;
      case 'expDate':
        newValues.expDate = value;
        break;
      case 'cvv':
        if (isNaN(value)) return;
        if (value.length > 3) return;
        newValues.cvv = value;
        break;
      default:
        break;
    }
    setUserCardInfo(newValues);
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingTop={100}
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
      <Dialog
        isShown={showDelete}
        title="Confirmar Eliminacion"
        intent="danger"
        onConfirm={() => deleteCallback()}
        onCloseComplete={() => setShowDelete(false)}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      >
        Esta seguro de que quiere eliminar la tarjeta?
      </Dialog>
      {error && (
        <Alert intent="danger" 
          title="Tuvimos un Error"
        >
          {error}
        </Alert>
      )}
      {saved && (
        <Alert intent="success" 
          title="Guardado"
        />
      )}
      {(newCard || userCardInfo.issuer) && (
        <Pane width={'65vh'} marginBottom={20}>
          <Pane display={'flex'} alignItems="center">
            <FormField label="Tarjeta de Credito" marginRight={20}></FormField>
            {!newCard && (<>
              <Tooltip content="Editar Tarjeta">
                <IconButton icon={EditIcon} onClick={() => handleEdit()}/>
              </Tooltip>
              <Tooltip content="Eliminar Tarjeta">
                <IconButton icon={DeleteIcon} onClick={() => setShowDelete(true)}/>
              </Tooltip>
            </>)}
          </Pane>
          <TextInputField
            width={'65vh'}
            label="Emisor"
            value={userCardInfo.issuer}
            disabled
          />
          <TextInputField
            width={'65vh'}
            label="Numero"
            value={userCardInfo.number}
            disabled={!editando}
            onChange={e => handleInput('number', e.target.value)}
            required
          />
          <TextInputField
            width={'65vh'}
            label="Titular"
            value={userCardInfo.cardHolder}
            disabled={!editando}
            onChange={e => handleInput('cardHolder', e.target.value)}
            required
          />
          <FormField
            width={'65vh'}
            marginBottom={20}
            required
            label="Fecha de Vencimiento"
          >
            <input
              type="date"
              value={userCardInfo.expDate}
              disabled={!editando}
              onChange={e => handleInput('expDate', e.target.value)}
              min="2021-01-01"
              max="2030-31-12"
            />
          </FormField>
          <TextInputField
            width={'65vh'}
            label="CVV"
            value={userCardInfo.cvv}
            disabled={!editando}
            onChange={e => handleInput('cvv', e.target.value)}
            required
          />
          {editando && (
            <Pane display="flex" justifyContent="space-around">
              <Button appearance="primary" intent="danger" onClick={() => handleSaveCard()}>
                Guardar
              </Button>
              <Button appearance="primary" onClick={() => handleCancel()}>
                Cancelar
              </Button>
            </Pane>
          )}
        </Pane>
      )}
      {(!userCardInfo.issuer && !newCard) && (
        <Pane display="flex" flexDirection="column" alignItems="center">
          No tenes tarjetas en el sistema
          <Button marginTop={20} appearance="primary" intent="sucess" onClick={() => addCard()}>
            Agregar Tarjeta de Credito
          </Button>
        </Pane>
      )}
    </Pane>
  );
};
