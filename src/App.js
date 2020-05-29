import React from 'react';
import GoogleMap from './google/GoogleMap'
import GoogleMapAdvanced from './google/GoogleMapAdvanced'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <ul>
              <Link to="/simple">Simple Example</Link><br />
              <Link to="/advanced">Advanced Example</Link>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <GoogleMapAdvanced />
          </Route>
          <Route exact path="/simple">
            <GoogleMap />
          </Route>
          <Route exact path="/advanced">
            <GoogleMapAdvanced />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
