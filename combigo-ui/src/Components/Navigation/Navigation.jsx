import React, {useState} from 'react';
import {
  Link
} from "react-router-dom";
import { Pane, Icon, MenuIcon, MenuClosedIcon, LogInIcon, PersonIcon } from 'evergreen-ui';
import './Navigation.css';
import {useAuth} from '../../utils/use-auth.js';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();

  return (
    <React.Fragment>
      <Pane
        elevation={1}
        padding={10}
        background="tint1"
        display="flex"
        alignSelf="center"
        alignItems="center"
        paddingX={20}
        height={"10vh"}
        maxHeigth={100}
      >
        <Icon cursor='pointer' icon={MenuIcon} size={30} onClick={() => setIsOpen(true)}/>
        <div className="title-container">
          <h1><Link to="/">CombiGO</Link></h1>
        </div>
        {auth.user && (
          <Link to="/profile">
            <Pane display="flex" alignItems="center">
              <span>{auth.user.username}</span>
              <Icon marginLeft={5} cursor='pointer' icon={PersonIcon} size={30} />
            </Pane>
          </Link>
        )}
        {!auth.user && (<div>
          <Link to="/login">
            <Icon cursor='pointer' icon={LogInIcon} size={30} />
          </Link>
        </div>)}
      </Pane>
      <Pane
        position="absolute"
        top={0}
        left={isOpen? 0 : -300}
        elevation={1}
        padding={20}
        paddingTop={30}
        zIndex={99}
        width={"20vw"}
        maxWidth={200}
        fontSize={"1.5em"}
        background="tint1"
        height={'100vh'}
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
            <hr />
            <li onClick={() => setIsOpen(false)}>
              <Link to="/profile">Profile</Link>
            </li>
            {auth.user && auth.isAdmin() && (
              <>
                <hr />
                <li onClick={() => setIsOpen(false)}>
                  <Link to="/vehicles">Vehicles</Link>
                </li>
                <hr />
                <li onClick={() => setIsOpen(false)}>
                  <Link to="/drivers">Drivers</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Pane>
    </React.Fragment>
  );
}
