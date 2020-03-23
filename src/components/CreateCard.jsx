import React from 'react'

import {Form, Text} from 'informed'

export default class CreateCard extends React.Component {
    render() {
        return (
            <Form getApi={formApi => this.formApi = formApi} >
                <label>Name</label><Text field="name" /><br />
                <label>Description</label><Text field="description" /><br />
                <label>Proficiency</label><Text field="proficiency" /><br />
                <label>Cost</label><Text field="cost" /><br />
                <label>Damage</label><Text field="damage" /><br />
                <label>Weight</label><Text field="weight" /><br />
                <label>Properties</label><Text field="properties" /><br />
                <label>Artwork</label><Text field="artwork" /><br />
                <button onClick={() => {this.addBill()}}>Add Bill</button>
                <button onClick={() => {this.props.history.push(`${process.env.PUBLIC_URL}/budgets/${this.props.match.params.id}`)}}>Next</button>
            </Form>
        )
    }
}