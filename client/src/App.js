
import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Dashboard from "./components/layout/dashboard";
import Authentication from "./components/authentication/authentication";
import Layout from './components/layout/layout'

import {UserContext} from "./context/user-context"

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const currentUser =  jwt_decode(token)
      setUser(currentUser.username);
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser}}>
      <Layout>
        <Switch>
          <Route path="/">
            {user ? (
              <Dashboard />
            ) : (
              <Authentication />
            )}
          </Route>
        </Switch>
        </Layout>
      </UserContext.Provider>
    </>
  );
};

export default App;


/*
import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Dashboard from "./components/dashboard";
import Authentication from "./components/authentication";

import { UserContext } from "./context/user-context";
import Nav from "./components/nav";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      user: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({ user: jwt_decode(token) });
    }
  }

  toggleUser = user => {
    this.setState({isLogged:true})
    this.setState({ user:user });
    this.forceUpdate()
  };

  render() {
    return (
      <>
        <UserContext.Provider
          value={{ ...this.state.user, toggleUser: this.toggleUser }}
        >
           <Nav user={this.state.user} toggleUser={this.toggleUser} isLogged={this.state.isLogged} />
          <Switch>
            <Route path="/">{this.state.user ? <Dashboard /> : <Authentication toggleUser={this.toggleUser} />}</Route>
          </Switch>
        </UserContext.Provider>
      </>
    );
  }
}

export default App;
*/