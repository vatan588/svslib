import React from "react";
import ReactDOM from "react-dom";
import { render } from 'react-dom';
import {Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { createRoot } from 'react-dom/client';
import { Login } from "./components/login/login";
import { Home } from "./components/home/home";
import "./index.css";
import "../src/assets/style/style.scss";
import { Payments } from "./components/payment/payment";
import { BookedSeats } from "./components/bookedseats/bookedseats";
import { StudentView } from "./components/studentview/studentview";
export const history = createBrowserHistory();
// http://localhost:3000/6034dc5893da7531538c6b4f/5e26950a1d5f600929cafa07/60acb16a5d4f7a06e42acd26/121
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/payments" component={Payments} />
            <Route exact path="/bookedseats" component={BookedSeats} />
            <Route exact path="/student/:id" component={StudentView} />
          </Switch>
        </Router>
      </div>
    );
  }
}

// const el = document.createElement("div");
// document.body.append(el);
// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>, el);


// ReactDOM.render(<App />, document.getElementById("root"));


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App/>);
