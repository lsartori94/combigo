// import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Navigation } from '../Components/Navigation/Navigation';
import { Home } from '../Screens/Home/Home';
import { Profile } from '../Screens/Profile/Profile';
import { VehicleDetails } from "../Screens/Vehicles/VehicleDetails/VehicleDetails";
import { Vehicles } from '../Screens/Vehicles/Vehicles';
import { Drivers } from '../Screens/Users/Drivers';
import { UserDetails } from '../Screens/Users/UserDetails';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/profile">
            <Profile />
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
            <UserDetails />
          </Route>
          <Route path="/drivers/add">
            <UserDetails />
          </Route>
          <Route path="/drivers">
            <Drivers />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
