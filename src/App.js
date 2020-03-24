import React from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import './App.css'

import CreateTemplate from './components/CreateTemplate'
import CreateCard from './components/CreateCard'

import CardDetail from './components/CardDetail'
import Template from './components/Template'
import Templates from './components/Templates'
import Cards from './components/Cards'
import CardsByTemplate from './components/CardsByTemplate'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/cards`} exact component={Cards} />
          <Route path={`${process.env.PUBLIC_URL}/cards/:id`} exact component={CardDetail} />
          <Route path={`${process.env.PUBLIC_URL}/new/templates`} exact component={CreateTemplate} />
          <Route path={`${process.env.PUBLIC_URL}/templates`} exact component={Templates} />
          <Route path={`${process.env.PUBLIC_URL}/templates/:id`} exact component={Template} />
          <Route path={`${process.env.PUBLIC_URL}/templates/:id/new/card`} exact component={CreateCard} />
          <Route path={`${process.env.PUBLIC_URL}/templates/:id/cards`} exact component={CardsByTemplate} />
          <Redirect to={`${process.env.PUBLIC_URL}/templates`} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
