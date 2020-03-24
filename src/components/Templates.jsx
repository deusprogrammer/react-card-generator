import React from 'react'

import {Link} from 'react-router-dom'

export default class Templates extends React.Component {
    state = {
        templates: []
    }

    componentWillMount() {
        axios.get(config.apiDomain + "/templates", AuthHelper.createConfig())
            .then((templateResponse) => {
                let templates = templateResponse.data
                this.setState({templates})
            })
    }

    render () {
        return (
            <div>
                <h1>Templates</h1>
                {this.state.templates.map(template => {
                    return (
                        <Link to={`${process.env.PUBLIC_URL}/templates/${template._id}/cards`}>
                            <span style={{display: "inline-block", height: "200px", lineHeight: "200px", background: "gray", color: "white", borderRadius: "10px"}}>
                                {template.game + ":" + template.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        )
    }
}