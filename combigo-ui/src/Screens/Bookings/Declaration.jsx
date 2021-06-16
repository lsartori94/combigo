import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SavedIcon,
  Combobox,
  FormField,
  Checkbox, 
  Alert,
  Strong,
  Text
} from 'evergreen-ui';

import { getUserDetails, getTravelDetails, getAvailableRoutes } from './BookingsStore'; 
import { useAuth } from "../../utils/use-auth"; 

export const Declaration = () => {
  let { travelId } = useParams();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [formDetails, setFormDetails] = useState({
    dateAndTime: "",
    passengerId: "",
    dni: ""
  });
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [travelDetails, setTravelDetails] = useState({});
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
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
  
  useEffect(() => {
    const auxErrors = {};
      setFormDirty(true);
      for (const [key, value] of Object.entries(formDetails)) {
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
  }, [formDetails]);

  // const inputCallback = (e, name) => {
  //     const {value} = e.target;
  //     switch (name) {
  //       case 'dateAndTime':
  //         setDetails({...details, dateAndTime: value});
  //       break;
  //       case 'route':
  //         setDetails({...details, route: value});
  //       break;
  //       case 'availableAdditionals':
  //         setDetails({...details, availableAdditionals: value});
  //       break;
  //       case 'passengers':
  //         setDetails({...details, passengers: value});
  //       break;
  //       default:
  //       break;
  //     }
  //   }
  // }

  // const handleCheckbox = (e) => {
  //   const {checked, id} = e.target;
  //   let newAdditionals;

  //   if (!checked) {
  //     newAdditionals = [...details.availableAdditionals.filter(el => el !== id)];
  //   } else {
  //     newAdditionals = [...details.availableAdditionals, id];
  //   }
  //   setDetails({...details, availableAdditionals: newAdditionals});
  // }

  const saveCallback = async () => {
    if (Object.values(errors).find(val => val)) {
      setShowErrors(true);
      return;
    } else {
      setShowErrors(false);
    }
    try {
      setLoading(true);
      setLoading(false);
      history.push(history.goBack());
    } catch (e) {
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push(history.goBack());
  }

  const mapRoute = () => {
    const route = availableRoutes.find(elem => elem.id === travelDetails.route) || {};
    return `${route.origin}/${route.destination}`;
  };

  // const renderCheckboxes = () => {
  //   return availableAdditionals.map(elem => {
  //     const checked = details.availableAdditionals.find(
  //       el => el === elem.id
  //     );
  //     return (
  //       <li key={elem.id}>
  //         <Checkbox
  //           label={elem.name}
  //           marginLeft={10}
  //           id={elem.id}
  //           checked={checked ? true : false}
  //           onChange={e => handleCheckbox(e)}
  //         />
  //       </li>)
  //     });
  // }

  const renderDetails = (formDetails) => {

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    //mejorar style
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

          <Checkbox
            label="Confirmo que los parrafos anteriores son correctos, reflejan la informacion del viaje y la información perteneciente a mi persona. 
            Declaro que la reserva para el viaje referenciado y su asiento en el mismo es instransferible y procedo a completar la Declaración Jurada."
            width={'65vh'}
          >
          </Checkbox>

          <Pane display="flex" flexWrap="wrap">
            <ul>
              {/*renderCheckboxes()*/}
            </ul>
          </Pane>
         
          {/* <FormField
            width={'65vh'}
            required
            marginBottom={20}
            label=""
            description=""
          >
          </FormField> */}

          
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
            Guardar y enviar
          </Button>

      </Pane>
    );
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderDetails(formDetails) }
    </div>
  );
};
