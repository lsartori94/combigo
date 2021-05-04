import React, {useState} from 'react';
import {
  Link
} from "react-router-dom";
import { Pane, Icon, MenuIcon, MenuClosedIcon } from 'evergreen-ui';
import './Navigation.css';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Pane
        elevation={1}
        padding={10}
        background="tint1"
        display="flex"
        alignSelf="center"
      >
        <Icon cursor='pointer' icon={MenuIcon} size={30} onClick={() => setIsOpen(true)}/>
        <div className="title-container">
          <h1><Link to="/">CombiGO</Link></h1>
        </div>
      </Pane>
      <Pane
        position="absolute"
        top={0}
        left={isOpen? 0 : -200}
        elevation={1}
        padding={10}
        paddingTop={30}
        background="tint1"
        height={'100vh'}
        display="flex"
        justifyContent="flex-start"
        flexDirection="column"
        transition="left 0.5s"
      >
        <nav>
        <Icon cursor='pointer' icon={MenuClosedIcon} size={40} onClick={() => setIsOpen(false)}/>
          <ul>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/">Home</Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/profile">Profile</Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/vehicles">Vehicles</Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/drivers">Drivers</Link>
            </li>
          </ul>
        </nav>
      </Pane>
    </React.Fragment>
  );
}
