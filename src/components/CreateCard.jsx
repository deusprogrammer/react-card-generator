import React from 'react'

import axios from 'axios'

import {Form, Text} from 'informed'

import ImageSelector from './ImageSelector'
import AuthHelper from '../util/AuthHelper'

import config from '../config'

export default class CreateCard extends React.Component {
    state = {
        cardLayout: null,
        images: {}
    }

    componentWillMount() {
        axios.get(config.apiDomain + "/templates/" + this.props.match.params.id, AuthHelper.createConfig())
            .then((templateResponse) => {
                let cardLayout = templateResponse.data
                this.setState({cardLayout})
            })
    }

    updateImage = (key, imageData, ext) => {
        let images = {...this.state.images}
        images[key] = {imageData, ext}
        this.setState({images})
    }

    createCard = () => {
        // Save all images
        Promise.all(Object.keys(this.state.images).map(key => {
            let image = this.state.images[key]
            image.imageData = image.imageData.substring(image.imageData.indexOf(',') + 1)
            return axios.post(config.imageApiDomain, {imagePayload: image.imageData, mimeType: "image/" + image.ext})
                    .then(response => {
                        return {
                            field: key,
                            url: config.imageApiDomain + "/" + response.data._id
                        }
                    })
        }))
        .then(results => {
            let payload = {...this.formApi.getState().values}
            payload.templateHref = config.apiDomain + "/templates/" + this.props.match.params.id
            payload.template = this.props.match.params.id
            results.forEach(result => {
                payload.data[result.field] = result.url
            })
            axios.post(config.apiDomain + "/cards", payload, AuthHelper.createConfig())
                .then(response => {
                    this.props.history.push("/cards/" + response.data._id)
                })
        })
    }

    render() {
        return (
            <div>
                <h1>Create {this.state.cardLayout ? this.state.cardLayout.name : ""} Card {this.state.cardLayout ? " for " + this.state.cardLayout.game : ""}</h1>
                <Form getApi={formApi => this.formApi = formApi} >
                    <div><label>Card Name</label><Text field="name" /></div>
                    {this.state.cardLayout ? Object.keys(this.state.cardLayout.fields).map(key => {
                        if (this.state.cardLayout.fields[key] === "text") {
                            return (
                                <div>
                                    <label>{key.toUpperCase()}</label>
                                    <Text field={`data.${key}`} />
                                </div>
                            )
                        } else if (this.state.cardLayout.fields[key] === "image") {
                            return (
                                <div>
                                    <label>{key.toUpperCase()}</label>
                                    <ImageSelector
                                        className="artwork-selector"
                                        src={this.state.images[key] ? this.state.images[key].imageData : ""}
                                        onChange={(imageData, ext) => {this.updateImage(key, imageData, ext)}}/>
                                </div>)
                        }
                    }) : null}
                    <button onClick={() => {this.createCard()}}>Create Card</button>
                </Form>
            </div>
        )
    }
}