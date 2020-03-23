import React from "react"
import axios from "axios"

import Card from "./Card"

import config from "../config"
import AuthHelper from '../util/AuthHelper'

export default class CardDetail extends React.Component {
    state = {
        cardLayout: null,
        cardData: null,
        cardMetaData: {}
    }

    componentWillMount() {
        axios.get(`${config.apiDomain}/cards/${this.props.match.params.id}`, AuthHelper.createConfig())
            .then((response) => {
                let card = response.data
                axios.get(response.data.templateHref, AuthHelper.createConfig())
                    .then((templateResponse) => {
                        let cardLayout = templateResponse.data
                        console.log("LAYOUT: " + JSON.stringify(cardLayout, null, 4))
                        this.setState({cardLayout, cardData: card.data, cardMetaData: card})
                    })
            })
    }

    render() {
        let templateUuid = null
        
        if (this.state.cardMetaData && this.state.cardMetaData.templateHref) {
            templateUuid = this.state.cardMetaData.templateHref.substring(this.state.cardMetaData.templateHref.lastIndexOf("/") + 1);
        }

        return (
            <div>
                { this.state.cardLayout && this.state.cardData ? 
                <div>
                    <div style={{float: "left"}}>
                        <h2>{this.state.cardMetaData.name} <span style={{color: "green"}}>[{this.state.cardLayout.game}:{this.state.cardLayout.name}]</span></h2>
                        <Card id={this.props.match.params.id} /><br />
                        <button onClick={() => {this.props.history.push(`${process.env.PUBLIC_URL}/templates/${templateUuid}/new/card`)}}>Create Another Card Like This</button>
                    </div>
                    <div style={{float: "right"}}>
                        <h2>Layout JSON:</h2>
                        <pre style={{textAlign: "left", width: "800px", margin: "auto", background: "grey", color: "white", overflowX: "scroll"}}>
                            {JSON.stringify(this.state.cardLayout, null, 5)}
                        </pre>
                    </div>
                    <div style={{float: "right"}}>
                        <h2>Data JSON:</h2>
                        <pre style={{textAlign: "left", width: "800px", margin: "auto", background: "grey", color: "white", overflowX: "scroll"}}>
                            {JSON.stringify(this.state.cardData, null, 5)}
                        </pre>
                    </div>
                    <div style={{float: "right"}}>
                        <h2>Artwork:</h2>
                        <img alt="Card Artwork" src={this.state.cardData.artwork} style={{width: "800px"}} />
                    </div>
                </div> : null }
            </div>
        );
    }
};