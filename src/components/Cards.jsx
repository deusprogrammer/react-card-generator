import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import Card from './Card'

import config from '../config'
import AuthHelper from '../util/AuthHelper'

export default class Cards extends React.Component {
    state = {
        cards: []
    }

    componentWillMount() {
        axios.get(`${config.apiDomain}/cards`, AuthHelper.createConfig())
            .then((response) => {
                this.setState({cards: response.data})
            })
    }

    render() {
        return (
            <div>
                <h2>Cards</h2>
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