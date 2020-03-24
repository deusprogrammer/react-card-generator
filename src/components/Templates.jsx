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
                            {template.game + ":" + template.name}
                        </Link>
                    )
                })}
            </div>
        )
    }
}