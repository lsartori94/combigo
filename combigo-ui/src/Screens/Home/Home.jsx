import './home.css';
import React, { useEffect, useState } from "react";
import { Pane, Combobox, FormField } from 'evergreen-ui';
import { getRoutes } from './homeStore';

import { useAuth } from "../../utils/use-auth";


export const Home = () => {
  const auth = useAuth();

  const [routes, setRoutes] = useState([]);
  
  useEffect(() => { 
    async function initialize() {
      try {
        const response = await getRoutes();
        const set = new Set(response.map(item => item.origin));
        setRoutes(Array.from(set));
      } catch(e) {
        console.error(e);
      }
    }
    initialize();
  }, []);


  // const inputCallback = (e, name, skipValidation) => {
  //   if (skipValidation) {
  //     setDetails({...details, [name]: e});
  //   } else {
  //     const {value} = e.target;
  //     switch (name) {
  //       case 'origin':
  //         setDetails({...details, origin: value});
  //       break;
  //       case 'destination':
  //         setDetails({...details, destination: value});
  //       break;
  //       default:
  //       break;
  //     }
  //   }
  // }


  
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
        <Pane>Elegi Tu Destino
          <Pane>
          <FormField
            width={'65vh'}
            required
            marginBottom={20}
            label="Origen"
          >
            <Combobox
              items={routes}
              // onChange={value => inputCallback(value.id, 'route', true)}
              placeholder="Origen"
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
              items={routes}
              // onChange={value => inputCallback(value.id, 'route', true)}
              placeholder="Destino"
              itemToString={item => item}
            />
          </FormField>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
}
