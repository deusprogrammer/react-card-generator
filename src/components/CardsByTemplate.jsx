import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import {Form, Text} from 'informed'

import ImageSelector from './ImageSelector'
import Card from './Card'
import AuthHelper from '../util/AuthHelper'

import config from '../config'

export default class CreateCard extends React.Component {
    state = {
        cards: [],
        cardLayout: null
    }

    componentWillMount() {
        axios.get(config.apiDomain + "/templates/" + this.props.match.params.id, AuthHelper.createConfig())
            .then((templateResponse) => {
                let cardLayout = templateResponse.data
                this.setState({cardLayout})
            })
        axios.get(config.apiDomain + "/templates/" + this.props.match.params.id + "/cards", AuthHelper.createConfig())
            .then((templateResponse) => {
                let cards = templateResponse.data
                this.setState({cards})
            })
    }

    render() {
        return (
            <div>
                <h1>{this.state.cardLayout ? this.state.cardLayout.name : ""} Cards {this.state.cardLayout ? " for " + this.state.cardLayout.game : ""}</h1>
                {this.state.cards.map((card) => {
                    return (
                        <div style={{float: "left"}}>
                            <div>{card.name}</div>
                            <Link to={`${process.env.PUBLIC_URL}/cards/${card._id}`}>
                                <Card width={200} data={card} />
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}
