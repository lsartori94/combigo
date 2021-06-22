import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  Spinner,
  Button,
  BackButton,
  SavedIcon,
  Checkbox, 
  Strong,
  Text,
  Dialog,
  Alert
} from 'evergreen-ui';

import { getUserDetails, getTravelDetails, getAvailableRoutes, updateLegalStatus } from './BookingsStore'; 
import { useAuth } from "../../utils/use-auth"; 

export const Declaration = () => {
  let { travelId, bookingId } = useParams();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [travelDetails, setTravelDetails] = useState({});
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [symptomsChecked, setSymptomsChecked] = useState([]);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      try {
        const travelResponse = await getTravelDetails(travelId);
        const userResponse = await getUserDetails(auth.user);
        const routes = await getAvailableRoutes();
        setAvailableRoutes(routes);
        setTravelDetails(travelResponse);
        setUserDetails(userResponse);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [travelId, auth.user]);

  const saveCallback = async () => {    
    try {
      setLoading(true);
      await updateLegalStatus(travelId, symptomsChecked, auth.user, bookingId.asString); //asString ????
      history.push(history.push('/bookings'));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setShowConfirmAlert(false);
    }
  }

  const backCallback = () => {
    history.push(history.goBack());
  }

  const mapRoute = () => {
    const route = availableRoutes.find(elem => elem.id === travelDetails.route) || {};
    return `${route.origin}/${route.destination}`;
  };

  
  const handleCheckbox = (e) => {
    const {checked, id} = e.target;
    let newSymptomsChecked;
    if (!checked) {
      newSymptomsChecked = [...symptomsChecked.filter(el => el !== id)];
    } else {
      newSymptomsChecked = [...symptomsChecked, id];
    }
    setSymptomsChecked(newSymptomsChecked);
  }

  const isChecked = (symptom) => {
    return symptomsChecked.includes(symptom);
  }

  const moreThanAnHourLeft = () => {
    const travelDate = new Date(travelDetails.dateAndTime);
    const now = new Date();
    let hoursLeft = Math.floor((travelDate - now) / (1000*60*60));
    if (hoursLeft >= 1) return true;
    return false;
  };

  const renderDetails = () => {

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    return (
      <Pane
        marginTop={20}
        marginBottom={100}
        alignItems="center"
        display="flex"
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

        {(moreThanAnHourLeft() && 
          <Alert 
            intent="danger" 
            appearance='card'
            marginTop={10}> Aún no se permite llenar la declaracion jurada, reinténtelo dentro de la hora antes del viaje.
          </Alert>)}

          <Strong size={600} marginTop={8}>DECLARACIÓN JURADA DE SALUD- COVID19</Strong>

          <Strong size={400} marginTop={8}>Fecha y hora actuales</Strong>
          <Text>{new Date().toLocaleDateString("es-AR", options)}</Text>

          <Strong size={400} marginTop={8}>Datos del pasajero</Strong>
          <Text>Nombre: {userDetails.name}</Text>
          <Text>Documento: {userDetails.dni}</Text>
          <Text>Fecha de nacimiento: {userDetails.bdate}</Text>

          <Strong size={400} marginTop={8}>Datos del viaje</Strong>
          <Text>Ruta: {mapRoute()}</Text>
          <Text>Fecha de salida: {new Date(travelDetails.dateAndTime).toLocaleDateString("es-AR", options)}</Text>
        
          <Text> --------------------------------------------------------------------------------------------------------------- </Text>

          <Strong size={400} marginTop={8}>¿Presenta actualmente o presentó dentro de los últimos 10 días los siguientes síntomas?</Strong>
          <Text size={400} marginTop={8} color="green">Marque la opción en caso afirmativo, deje sin marcar en caso negativo.</Text>
          <Checkbox
            id='fever'
            label="Fiebre (38º o más)"
            marginBottom={0}
            width={'65vh'}
            checked={isChecked('fever')}
            onChange={e => handleCheckbox(e)}
          >
          </Checkbox>
          <Checkbox
            id='throat'
            label="Dolor de garganta"
            marginBottom={0}
            width={'65vh'}
            checked={isChecked('throat')}
            onChange={e => handleCheckbox(e)}
          >
          </Checkbox>
          <Checkbox
            id='cough'
            label="Tos"
            marginBottom={0}
            width={'65vh'}
            checked={isChecked('cough')}
            onChange={e => handleCheckbox(e)}
          >
          </Checkbox>
          <Checkbox
            id='taste'
            label="Pérdida del gusto o del olfato"
            marginBottom={0}
            width={'65vh'}
            checked={isChecked('taste')}
            onChange={e => handleCheckbox(e)}
          >
          </Checkbox>
          <Checkbox
            id='respiratory'
            label="Dificultad respiratoria"
            marginBottom={0}
            width={'65vh'}
            checked={isChecked('respiratory')}
            onChange={e => handleCheckbox(e)}
          >
          </Checkbox>

          <Strong size={400} marginTop={8}>¿En los últimos 10 días estuvo en contacto estrecho con un caso confirmado de COVID-19?</Strong>
          <Text size={400} marginTop={8} color="green">Marque la opción en caso afirmativo, deje sin marcar en caso negativo.</Text>
          <Checkbox
            id='contact'
            label="Si"
            marginBottom={0}
            width={'65vh'}
            checked={isChecked('contact')}
            onChange={e => handleCheckbox(e)}
          >
          </Checkbox>

          <Text> --------------------------------------------------------------------------------------------------------------- </Text>

          <Checkbox
            label="Confirmo que los datos anteriores son correctos, reflejan la informacion del viaje y la información perteneciente a mi persona. 
            Declaro que la reserva para el viaje referenciado y su asiento en el mismo es instransferible y este formulario tiene carácter de Declaración Jurada."
            checked={confirmChecked}
            width={'65vh'}
            onChange={e => setConfirmChecked(e.target.checked)}
           />

          
          <Button
            width={'65vh'}
            display="flex"
            marginTop={20}
            justifyContent="center"
            appearance="primary"
            intent="warning"
            onClick={() => setShowConfirmAlert(true)}
            iconBefore={SavedIcon}
            disabled={moreThanAnHourLeft() || !confirmChecked}
          >
            Aceptar y enviar
          </Button>

          {(moreThanAnHourLeft() && 
          <Alert 
            intent="danger" 
            appearance='card'
            marginTop={10}> Aún no se permite llenar la declaracion jurada, reinténtelo dentro de la hora antes del viaje.
          </Alert>)}

          <Dialog
            isShown={showConfirmAlert}
            title="Confirmar envío de declaracion jurada"
            onCloseComplete={() => saveCallback()}
            confirmLabel="Confirmar"
            hasCancel={false}
            intent="success"
          > {`Sus reservas y compras de los próximos 15 días serán canceladas si se presenta como caso sospechoso. 
              ¿Confirmar envío de declaración jurada?`}
          </Dialog>

      </Pane>
    );
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderDetails() }
    </div>
  );
};
