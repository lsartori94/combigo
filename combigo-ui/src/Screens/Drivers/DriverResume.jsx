import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon,
  FormField,
  Alert,
  Table,
  Combobox,
} from 'evergreen-ui';

import { getDriverDetails, getDriverHistory, getAvailableRoutes, getDriverUsername } from './driversStore';
import { TRAVEL_STATES } from '../../constants';

export const DriverResume = () => {
  let { driverId } = useParams();
  const [loading, setLoading] = useState(true);
  const [travelsLoaded, settravelsLoaded] = useState(true);
  const [driverHistory, setDriverHistory] = useState({});
  const [routes, setRoutes] = useState({});
  //const [payPerHour, setPayPerHour] = useState(0); //Paga por defecto
  const [name, setName] = useState('');
  const [noTravels, setNoTravels] = useState(true);
  const history = useHistory();

  const [year, setYear] = useState( new Date().getFullYear().toString() );
  const [availableYears, setAvailableYears] = useState([
    '2021', '2022', '2023', '2024', '2025'
  ]);

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      try {
        const routesResponse = await getAvailableRoutes();
        setRoutes(routesResponse);
        const nameResponse = await getDriverUsername(driverId);
        setName( nameResponse.name );
        const response = await getDriverHistory(driverId);
        if ( response.length > 0 ) {
          setNoTravels(false);
          setDriverHistory(response);  
          settravelsLoaded(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [driverId]); // eslint-disable-line

  const backCallback = () => {
    history.push(history.goBack());
  }

  const inputCallback = (year) => {
    setYear(year);
  }

  const finishedTravels = () => {
    return driverHistory.filter( tr => tr.status === TRAVEL_STATES.FINISHED );
  }

  const travelsForMonth = ( month ) => {
    let fTravels = finishedTravels();
    return fTravels.filter( t => ( ( (t.dateAndTime.split('-'))[1] === month ) && ( (t.dateAndTime.split('-'))[0] === year ) ) );
  }

  const horasTrabajadas = (travels) => {
    let minutos = 0;
    travels.forEach(element => {
      minutos += routes.find( r => r.id === element.route ).durationMin;
    });

    return ( minutos / 60 ).toFixed(2);
  }

  // const payPerMonth = (travels) => {
  //   return ( horasTrabajadas(travels) * payPerHour )
  // }

  const renderDetails = (travels) => {
    if (noTravels) {
      return (
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
          > Volver
        </BackButton> 
        No hay viajes pertenecientes al chofer
      </Pane>)
    }

    //Perdon. NO SE QUE ESTOY HACIENDO :D, pero funciona?
    const travelsPerMonth = [];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    //months.forEach( i => travelsPerMonth[i] = travelsForMonth( i ) );

    for (var i = 0; i < 12; i++) {
      travelsPerMonth[i] = { 
        month: monthNames[i], 
        travels: travelsForMonth(months[i]) 
      };
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
        {travelsLoaded && (<div>
          <TextInputField
            width={'65vh'}
            label="Chofer:"
            value={name}
            disabled
          />
        </div>)}

        <FormField
            width={'65vh'}
            marginBottom={20}
            label="Año"
          >
            <Combobox
              width={'65vh'}
              items={availableYears}
              selectedItem={availableYears.find(elem => elem === year)}
              label="Año"
              onChange={value => value ? inputCallback(value) : ''}
              placeholder={"Año"}
            />
        </FormField>
        
        <Table width={"95%"}>
          <Table.Head>
            <Table.TextHeaderCell>
              Mes
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Cantidad de viajes finalizados
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Cantidad de horas trabajdas
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={400}>
            {travelsPerMonth.map(travelsForThisMonth => (
              <Table.Row key={travelsForThisMonth.month}>
                <Table.TextCell>
                  {travelsLoaded && travelsForThisMonth.month}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && travelsForThisMonth.travels.length}
                </Table.TextCell>
                <Table.TextCell>
                  {travelsLoaded && horasTrabajadas(travelsForThisMonth.travels)}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

      </Pane>
    );
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderDetails(driverHistory) }
    </div>
  );
};
