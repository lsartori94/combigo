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
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  
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
    setOrigins(Array.from(new Set(routes.map(item => item.origin))));
  }, [routes]);


  function handleOrigins(value) {
    setSelectedOrigin(value);
    filterDestinations(value);
  }

  function filterDestinations(selection) {
    const filter = routes.filter(item => item.origin === selection).map(item => item.destination);
    setDestinations(filter);
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
          items={origins}
          onChange={value => handleOrigins(value)}
          placeholder="Origen"
          initialSelectedItem={selectedOrigin}
          itemToString={item => item}
        />
      </FormField>
      <FormField
        width={'65vh'}
        required
        marginBottom={20}
        label="Destino"
      >
        <Combobox
          disabled={!selectedOrigin}
          items={destinations}
          onChange={value => setSelectedDestination(value)}
          placeholder="Destino"
          initialSelectedItem={selectedDestination}
          itemToString={item => item}
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
