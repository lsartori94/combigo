import './home.css';
import React from "react";
import { Pane } from 'evergreen-ui';

import { useAuth } from "../../utils/use-auth";


export const Home = () => {
  const auth = useAuth();

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
        <Pane>Elegi Tu Destino</Pane>
        <Pane>TODO PANEL</Pane>
      </Pane>
    </Pane>
  );
}
