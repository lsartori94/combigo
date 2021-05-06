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
import { VehicleDetails } from "../Screens/Vehicles/VehicleDetails/VehicleDetails";
import { Vehicles } from '../Screens/Vehicles/Vehicles';
import { Drivers } from '../Screens/Drivers/Drivers';
import { DriverDetails } from '../Screens/Drivers/DriverDetails';
import { ProvideAuth } from '../utils/use-auth';

function App() {
  useEffect(() => {
    document.title = 'CombiGO';
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
