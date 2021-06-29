import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Table,
  Popover,
  Position,
  Menu,
  IconButton,
  Spinner,
  MoreIcon,
  Pane,
  Dialog,
} from 'evergreen-ui';

import { getDriverTravels, getAvailableRoutes, cancelTravel, startTravel, finishTravel } from './driversStore';
import { useAuth } from "../../utils/use-auth";
import { TRAVEL_STATES } from '../../constants';

export const DriverTravels = () => {
  const auth = useAuth();
  const history = useHistory();
  const [travels, setTravels] = useState([]);
  const [routes, setRoutes] = useState([]);
  //const [vehicles, setVehicles] = useState([]); //Necesitamos esto para el stock? NO
  const [loading, setLoading] = useState(true);
  const [travelsLoaded, setTravelsLoaded] = useState(false);

  const [showCancel, setShowCancel] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState(null);

  useEffect(() => {
    async function initialize() {
      try {
        const routesResponse = await getAvailableRoutes();
        const response = await getDriverTravels( auth.user.id );
        setRoutes(routesResponse);
        if (response.length) {
          setTravels(response);
          setTravelsLoaded(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  },[auth.user, history]);

  //Recarga los viajes despues de un cambio en la api
  async function reloadTravel() {
    setLoading(true);
    setTravelsLoaded(false);
    try {
      const response = await getDriverTravels( auth.user.id ); //Solo los pendientes y comenzados
      //if (response.length) {
        setTravels(response);
        setTravelsLoaded(true);
      //}                         //Si el if esta no se actualiza el placeholder
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const renderPlaceholder = () => (
    <div style={{padding: "30px"}}>No posee viajes asignados activos
    </div>
  );

  //cancelar viaje
  const promptCancel = async (travelId) => {    
    setSelectedTravel(travelId);
    setShowCancel(true);
  }

  const cancelCallback = async () => {    
    try {
      await cancelTravel(selectedTravel); //es el id
    } catch (e) {
      console.error(e);
    } finally {
      reloadTravel();
      setShowCancel(false);
    }
  }

  //Comenzar viaje 
  const promptStartTravel = async (travelId) => {    
    setSelectedTravel(travelId);
    setShowStart(true);
  }

  const startTravelCallback = async () => {   
    try {
      await startTravel(selectedTravel); //es el id
    } catch (e) {
      console.error(e);
    } finally {
      reloadTravel();
      setShowStart(false);
    }
  }

  //Finalizar viaje
  const promptFinishTravel = async (travelId) => {   
    setSelectedTravel(travelId); 
    setShowFinish(true);
  }

  const finishTravelCallback = async () => {   
    try {
      await finishTravel(selectedTravel); //es el id
    } catch (e) {
      console.error(e);
    } finally {
      reloadTravel();
      setShowFinish(false);
    } 
  }

  //probar si faltan 6 horas para un viaje
  const moreThanSixHoursLeft = (atravel) => {
    const travelDate = new Date(atravel.dateAndTime);
    const now = new Date();
    let hoursLeft = Math.floor((travelDate - now) / (1000*60*60));
    if (hoursLeft >= 6) return true;
    return false;
  };

  //probar si falta 1 hora para u viaje
  const beforeStartingTime = (atravel) => {
    const travelDate = new Date(atravel.dateAndTime);
    const now = new Date();
    let hoursLeft = Math.floor((travelDate - now) / (1000*60*60));
    if (hoursLeft >= 0) return true;
    return false;
  };
  
  const renderRowMenu = (atravel) => {
    //Si no faltan menos de 6 horas para el viaje no se puede cancelar, comenzar, finalizar viaje o aceptar pasageros (lo ultimo pasa solo)
    if ( moreThanSixHoursLeft(atravel) ){
      return (
        <Menu>
          <Menu.Group>
            <Link to={`/driverTravels/passengers/${atravel.id}`}><Menu.Item>Ver pasajeros</Menu.Item></Link>
          </Menu.Group>
        </Menu>
      )
    }
    if ( beforeStartingTime(atravel) ){
      return (
        <Menu>
          <Menu.Group>
            <Link to={`/driverTravels/passengers/${atravel.id}`}><Menu.Item>Ver pasajeros</Menu.Item></Link>
          </Menu.Group>
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptCancel(atravel.id)}>Cancelar...</Menu.Item>
          </Menu.Group>
        </Menu>
      )
    }
    if ( ( atravel.status === TRAVEL_STATES.NOT_STARTED ) ||  ( atravel.status === TRAVEL_STATES.NO_VEHICLE ) ){
      return (
        <Menu>
          <Menu.Group>
            <Link to={`/driverTravels/passengers/${atravel.id}`}><Menu.Item>Ver pasajeros</Menu.Item></Link>
          </Menu.Group>
          <Menu.Group>
            <Menu.Item intent="success" onClick={() => promptStartTravel(atravel.id)}>Comenzar viaje</Menu.Item>
          </Menu.Group>
          <Menu.Group>
            <Menu.Item intent="danger" onClick={() => promptCancel(atravel.id)}>Cancelar...</Menu.Item>
          </Menu.Group>
        </Menu>
      )
    }
    if ( atravel.status === TRAVEL_STATES.IN_PROGRESS ){
      return (
        <Menu>
          <Menu.Group>
            <Link to={`/driverTravels/passengers/${atravel.id}`}><Menu.Item>Ver pasajeros</Menu.Item></Link>
          </Menu.Group>
          <Menu.Group>
            <Menu.Item intent="success" onClick={() => promptFinishTravel(atravel.id)}>Finalizar viaje</Menu.Item>
          </Menu.Group>
        </Menu>
      )
    }
  }

  const renderTravels = (travels) => {
    if (travels.length < 1) {
      return renderPlaceholder();
    }
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
        className="travel-container"
      >
        <Dialog
          isShown={showCancel}
          title="Confirmar cancelación"
          intent="danger"
          onConfirm={() => cancelCallback()}
          onCloseComplete={() => setShowCancel(false)}
          confirmLabel="Continuar"
          cancelLabel="Cancelar"
        > { "Si cancela el viaje las reservas de los pasajeros seran reembolsadas. ¿Desea continuar?"}
        </Dialog>
        <Dialog
          isShown={showStart}
          title="Confirmar comenzar viaje"
          intent="success"
          onConfirm={() => startTravelCallback()}
          onCloseComplete={() => setShowStart(false)}
          confirmLabel="Comenzar"
          cancelLabel="Cancelar"
        > { "Los pasajeros que no esten aceptados seran registrados como ausentes."}
        </Dialog>
        <Dialog
          isShown={showFinish}
          title="Confirmar finalizar viaje"
          intent="success"
          onConfirm={() => finishTravelCallback()}
          onCloseComplete={() => setShowFinish(false)}
          confirmLabel="Terminar"
          cancelLabel="Cancelar"
        > { "Confirmar final del viaje."}
        </Dialog>
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Fecha
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Origen
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Destino
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Estado
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Pasajeros aceptados
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Asientos libres
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travels.map(travel => (
              <Table.Row key={travel.id}>
                <Table.TextCell>
                  {travelsLoaded && new Date(travel.dateAndTime).toLocaleDateString('es-AR', options)}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && routes.find(rou => rou.travels.includes(travel.id)).origin}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && routes.find(rou =>rou.travels.includes(travel.id)).destination}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && travel.status}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && travel.passengers.filter( p => p.accepted ).length}
                </Table.TextCell>
                <Table.TextCell>
                  {/* {travelsLoaded && ( vehicles.find(ve => ve.id === travel.vehicle ) || "No asignado" ) */
                   travelsLoaded && travel.stock}
                </Table.TextCell>
                <Table.Cell flex="none">
                  <Popover
                    content={travelsLoaded && renderRowMenu(travel)}
                    position={Position.BOTTOM_RIGHT}
                  >
                    <IconButton icon={MoreIcon} height={24} appearance="minimal" />
                  </Popover>
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
      { !loading &&  renderTravels(travels) }
    </div>
  );
};
