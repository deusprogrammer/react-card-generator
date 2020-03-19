import React from 'react'
import axios from 'axios'

import CardRenderer from './CardRenderer'
import config from '../config'

export default class Card extends React.Component {
    state = {
        cardLayout: null,
        cardData: null,
        cardMetaData: {}
    }

    componentWillMount() {
        if (this.props.data && this.props.template) {
            this.setState({cardLayout: this.props.template, cardData: this.props.data})
        } else if (this.props.data) {
            let card = this.props.data
            axios.get(card.templateHref)
                    .then((templateResponse) => {
                        let cardLayout = templateResponse.data
                        console.log("LAYOUT: " + JSON.stringify(cardLayout, null, 4))
                        this.setState({cardLayout, cardData: card.data, cardMetaData: card})
                    })
        } else if (this.props.id) {
            axios.get(`${config.apiDomain}/cards/${this.props.id}`)
            .then((response) => {
                let card = response.data
                console.log("DATA: " + JSON.stringify(card, null, 4))
                axios.get(response.data.templateHref)
                    .then((templateResponse) => {
                        let cardLayout = templateResponse.data
                        console.log("LAYOUT: " + JSON.stringify(cardLayout, null, 4))
                        this.setState({cardLayout, cardData: card.data, cardMetaData: card})
                    })
            })
        }
    }

    render() {
        if (this.state.cardLayout && this.state.cardData) {
            return (
                <CardRenderer
                    cardLayout={this.state.cardLayout}
                    cardData={this.state.cardData} 
                    onMouseDown={() => {}} 
                    onMouseUp={() => {}} 
                    onClick={() => {}} 
                    onMouseMove={() => {}}
                    onElementClicked={() => {}}/> 
            )
        } else {
            return null
        }
    }
}
