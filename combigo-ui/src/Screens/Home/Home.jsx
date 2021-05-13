import './home.css';
import React, { useEffect, useState } from "react";
import { Pane, Combobox, FormField, Button, Spinner } from 'evergreen-ui';
import { getRoutes } from './homeStore';

import { useAuth } from "../../utils/use-auth";


export const Home = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  useEffect(() => { 
    async function initialize() {
      try {
        const response = await getRoutes();
        setRoutes(response);
        setLoading(false);
      } catch(e) {
        console.error(e);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    filterOrigins();
  }, [routes]);

  useEffect(() => {
    filterDestinations(selectedOrigin);
  }, [selectedOrigin]);

  useEffect(() => {
    setSelectedDestination(null);
  }, [destinations]);

  function filterOrigins() {
    const originBuffer = [];
    routes.forEach(route => {
      if (!originBuffer.find(item => item.origin === route.origin)) {
        originBuffer.push(route);
      }
    });
    setOrigins(originBuffer);
  }

  function filterDestinations(selection) {
    if (!selection) {
      setDestinations(null);
      return;
    }
    const {origin} = selection;
    const destinationBuffer = [];
    routes
      .filter(route => route.origin === origin)
      .forEach(route => {
      if (!destinationBuffer.find(item => item.destination === route.destination)) {
        destinationBuffer.push(route);
      }
    });
    setDestinations(destinationBuffer);
  }

  const renderSearch = () => (
    <Pane>Elegi Tu Destino
      <Pane marginTop={20}>
      <FormField
        width={'65vh'}
        required
        marginBottom={20}
        label="Origen"
      >
        <Combobox
          openOnFocus
          items={origins}
          selectedItem={selectedOrigin}
          onChange={value => setSelectedOrigin(value)}
          placeholder="Origen"
          initialSelectedItem={selectedOrigin}
          itemToString={item => item ? item.origin : ''}
        />
      </FormField>
      <FormField
        width={'65vh'}
        required
        marginBottom={20}
        label="Destino"
      >
        <Combobox
          openOnFocus
          disabled={!selectedOrigin}
          selectedItem={selectedDestination}
          placeholder={"Destino"}
          items={destinations}
          onChange={value => setSelectedDestination(value)}
          placeholder="Destino"
          itemToString={item => item ? item.destination : ''}
        />
      </FormField>
      <Button
        disabled={!selectedDestination || (selectedOrigin == selectedDestination)} //Cambie esto
      >Buscar</Button>
      </Pane>
    </Pane>
  );

  return (
    <Pane
    className="home-container"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height={"85vh"}
  >
    {auth.user && (
      <Pane
        display="flex"
        alignItems="center"
        height={100}
        fontSize={"2em"}
        fontWeight={400}
        color={"#eaf5ff"}
        textShadow={"1px 1px #444343"}
      >
        Hola, {auth.user.name}! Estas Listo Para Viajar?
      </Pane>
    )}
    <Pane
      marginTop={auth.user ? 40: 140}
      padding={16}
      background="tint2"
      borderRadius={3}
      width={"60vw"}
      height={400}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      { loading && <Spinner /> }
      { !loading && renderSearch() }
    </Pane>
  </Pane>
  );
}
