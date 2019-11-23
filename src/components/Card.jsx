import React from 'react'
import axios from 'axios'

import { Stage, Container } from "@inlet/react-pixi"
import Rectangle from "../elements/Rectangle"
import CardElement from "./CardElement"

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
            axios.get(`http://localhost:3000/cards/${this.props.id}`)
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
            let scale = 1.0

            if (this.props.scale) {
                scale = this.props.scale
            } else if (this.props.width) {
                scale = this.props.width/this.state.cardLayout.width
            } else if (this.props.height) {
                scale = this.props.height/this.state.cardLayout.height
            }

            let width = scale * parseInt(this.state.cardLayout.width)
            let height = scale * parseInt(this.state.cardLayout.height)
            return (
                <span onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp} onClick={this.props.onClick} onMouseMove={this.props.onMouseMove}>
                    <Stage options={{ transparent: true }} width={width} height={height}>
                        <Container x={0} y={0} width={width} height={height}>
                            <Rectangle x={0} y={0} fill={this.state.cardLayout.background} width={width} height={height} radius={20} />
                            {
                                Object.keys(this.state.cardLayout.layout).map((key) => {
                                    let element = this.state.cardLayout.layout[key]
                                    return (
                                        <CardElement
                                            key={key}
                                            elementKey={key}
                                            element={element}
                                            scale={scale}
                                            parent={this.state.cardLayout}
                                            cardData={this.state.cardData} 
                                            />)
                                })
                            }
                        </Container>
                    </Stage>
                </span>)
        } else {
            return null
        }
    }
}