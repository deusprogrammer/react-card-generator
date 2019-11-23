import React from 'react'

import Card from './Card'

export default class CreateTemplate extends React.Component {
    state = {
        mode: "BOX",
        index: 0,
        selectedElementKey: "",
        selectedElement: null,
        cardLayout: {
            width: 400,
            height: 560,
            background: 0,
            layout: {}
        },
        cardData: {
            dummy: ""
        }
    }

    clickStart = (event) => {
        this.editData = {
            x1: event.nativeEvent.offsetX, 
            y1: event.nativeEvent.offsetY, 
            x2: null, 
            y2: null
        }

        console.log("START: " + this.editData.x1 + ", " + this.editData.y1)
    }

    clickMove = (event) => {
        if (!this.editData) {
            return
        }

        let index = this.state.index
        let cardLayout = {...this.state.cardLayout}

        this.editData.x2 = event.nativeEvent.offsetX
        this.editData.y2 = event.nativeEvent.offsetY

        console.log("MOVE: " + this.editData.x2 + ", " + this.editData.y2)

        cardLayout.layout["container-" + index] = {
            type: "container",
            x: this.editData.x1.toString(),
            y: this.editData.y1.toString(),
            width: (this.editData.x2 - this.editData.x1).toString(),
            height: (this.editData.y2 - this.editData.y1).toString(),
            background: 16119715,
            layout: {}
        }

        this.setState({cardLayout: cardLayout})
    }

    clickEnd = (event) => {
        let index = this.state.index
        let cardLayout = {...this.state.cardLayout}

        this.editData.x2 = event.nativeEvent.offsetX
        this.editData.y2 = event.nativeEvent.offsetY

        console.log("END: " + this.editData.x2 + ", " + this.editData.y2)

        cardLayout.layout["container-" + index] = {
            type: "container",
            x: this.editData.x1.toString(),
            y: this.editData.y1.toString(),
            width: (this.editData.x2 - this.editData.x1).toString(),
            height: (this.editData.y2 - this.editData.y1).toString(),
            background: 16119715,
            layout: {}
        }

        this.editData = null

        this.setState({cardLayout: cardLayout, selectedElementKey: "container-" + index, selectedElement: cardLayout.layout["container-" + index], index: index + 1})
    }
    
    render() {
        return (
            <div>
                <h1>Create Card Template</h1>
                <div style={{display: "table"}}>
                    <div style={{display: "table-cell", width: "49%", verticalAlign: "middle"}}>
                        <div>
                            <Card onMouseDown={e => this.clickStart(e)} onMouseUp={e => this.clickEnd(e)} onMouseMove={e => this.clickMove(e)} template={this.state.cardLayout} data={this.state.cardData} />
                        </div>
                    </div>
                    <div style={{display: "table-cell", width: "49%", verticalAlign: "middle"}}>
                        {this.state.selectedElement ?
                        <div>
                            <label>Name</label><input type="text" value={this.state.selectedElementKey} /><br />
                            <label>Type</label>
                            <select value={this.state.selectedElement.type}>
                                <option value={"art"}>Art</option>
                                <option value={"text"}>Text</option>
                                <option value={"container"}>Container</option>
                            </select><br />
                            <label>Width</label><input type="text" value={this.state.selectedElement.width} /><br />
                            <label>Height</label><input type="text" value={this.state.selectedElement.height} /><br />
                            <label>X</label><input type="text" value={this.state.selectedElement.x} /><br />
                            <label>Y</label><input type="text" value={this.state.selectedElement.y} /><br />
                            <button>Center X</button><br />
                            <button>Center Y</button><br />
                        </div> : null }
                    </div>
                </div>
            </div>
        )
    }
}