import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

import './custom.css'
import {TextPicker} from "./components/TextPicker";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
          <Route exact path='/document/' component={Home} />
        <Route exact path='/document/:documentId' component={Home} />
        <Route path='/text-picker' component={TextPicker} />
          <Route path='/login' component={Login}/>
          <Route path='/sign-up' component={SignUp}/>

      </Layout>
    );
  }
}
