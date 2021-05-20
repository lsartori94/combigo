// import './App.css';
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Footer } from '../Components/Footer/Footer';
import { Navigation } from '../Components/Navigation/Navigation';
import { Home } from '../Screens/Home/Home';
import { Profile } from '../Screens/Profile/Profile';
import { Login } from '../Screens/Login/Login';
import { Register } from '../Screens/Register/Register';
import { VehicleDetails } from "../Screens/Vehicles/VehicleDetails";
import { Vehicles } from '../Screens/Vehicles/Vehicles';
import { Drivers } from '../Screens/Drivers/Drivers';
import { DriverDetails } from '../Screens/Drivers/DriverDetails';
import { RouteDetails } from '../Screens/Routes/RouteDetails';
import { Routes } from '../Screens/Routes/Routes';
import { Travels } from '../Screens/Travels/Travels';
import { TravelDetails } from '../Screens/Travels/TravelDetails';
import { TravelAssigns } from '../Screens/Travels/TravelAssigns';
import { Additionals } from '../Screens/Additionals/Additionals';
import { AdditionalDetails } from '../Screens/Additionals/AdditionalDetails';
import { ProvideAuth } from '../utils/use-auth';

function App() {
  useEffect(() => {
    document.title = 'Combi-19';
  },[]);

  return (
    <ProvideAuth>
      <Router>
        <div className="app-container">
          <Navigation />
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/vehicles/:vehicleId">
              <VehicleDetails />
            </Route>
            <Route path="/vehicles/add">
              <VehicleDetails />
            </Route>
            <Route path="/vehicles">
              <Vehicles />
            </Route>
            <Route path="/drivers/:uname">
              <DriverDetails />
            </Route>
            <Route path="/drivers/add">
              <DriverDetails />
            </Route>
            <Route path="/drivers">
              <Drivers />
            </Route>
            <Route path="/routes/:routeId">
              <RouteDetails />
            </Route>
            <Route path="/routes/add">
              <RouteDetails />
            </Route>
            <Route path="/routes">
              <Routes />
            </Route>
            <Route path="/travels/:travelId/:assign">
              <TravelAssigns />
            </Route>
            <Route path="/travels/:travelId">
              <TravelDetails />
            </Route>
            <Route path="/travels/add">
              <TravelDetails />
            </Route>
            <Route path="/travels">
              <Travels />
            </Route>
            <Route path="/additionals/:addId">
              <AdditionalDetails />
            </Route>
            <Route path="/additionals/add">
              <AdditionalDetails />
            </Route>
            <Route path="/additionals">
              <Additionals />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </ProvideAuth>
  );
}

export default App;
