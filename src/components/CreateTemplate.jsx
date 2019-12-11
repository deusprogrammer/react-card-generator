import React from 'react'

import CardRenderer from './CardRenderer'
import MapUtil from '../util/MapUtil'

export default class CreateTemplate extends React.Component {
    state = {
        mode: "CREATE",
        index: 0,
        selectedElement: null,
        selectedElementPath: null,
        selectedElementName: "",
        cardLayout: {
            width: 400,
            height: 560,
            background: 0,
            layout: {}
        },
        cardData: {
            dummy: ""
        },
        vSplit: 2,
        hSplit: 2,
        start: {x: 0, y: 0},
        end: {x: 0, y: 0},
        totalOffset: {x: 0, y: 0}
    }

    clickStart = (event) => {
        if (this.parentElementPath === undefined || this.parentElementPath === null) {
            this.parentElementPath = []
        }
        if (this.parentElement === undefined || this.parentElement === null) {
            this.parentElement = this.state.cardLayout
        }
        switch(this.state.mode) {
            case "CREATE":
                this.editData = {
                    x1: event.nativeEvent.offsetX, 
                    y1: event.nativeEvent.offsetY, 
                    x2: null, 
                    y2: null
                }
                break
            case "SELECT":
                if (!this.elementWasClicked) {
                    return
                }
                this.selectData = {
                    startX: event.nativeEvent.offsetX,
                    startY: event.nativeEvent.offsetY,
                    origX: parseInt(this.state.selectedElement.x),
                    origY: parseInt(this.state.selectedElement.y)
                }
                break
            default:
                break
        }
    }

    clickMove = (event) => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var maxX = cardLayout.width
        var maxY = cardLayout.height
        switch(this.state.mode) {
            case "CREATE":
                if (!this.editData) {
                    return
                }
        
                let index = this.state.index
                
                // Calculate max x and y
                if (this.parentElement) {
                    maxX = this.parentElement.width
                    maxY = this.parentElement.height
                }

                // Calculate start and end as well as size
                var startX = this.editData.x1
                var startY = this.editData.y1
                var endX = event.nativeEvent.offsetX
                var endY = event.nativeEvent.offsetY

                // Calcuate offset if nested
                if (this.parentElement && this.totalOffset) {
                    startX -= this.totalOffset.x
                    startY -= this.totalOffset.y
                    endX -= this.totalOffset.x
                    endY -= this.totalOffset.y
                }

                // Enforce maximum size
                endX = Math.min(endX, maxX)
                endY = Math.min(endY, maxY)

                var width = endX - startX
                var height = endY - startY

                var newElementKey = "container" + index
                var newElement = {
                    type: "container",
                    x: startX.toString(),
                    y: startY.toString(),
                    width: width.toString(),
                    height: height.toString(),
                    background: 0xffffff,
                    layout: {}
                }

                // Alternate background colors for nested elements
                if (this.parentElement) {
                    if (this.parentElement.background === 0xffffff) {
                        newElement.background = 0x000000
                    } else {
                        newElement.background = 0xffffff
                    }
                }
                    
                MapUtil.setPath({layout}, [...this.parentElementPath, newElementKey], newElement)

                cardLayout.layout = layout
        
                this.setState({
                    cardLayout, 
                    selectedElement: newElement,
                    selectedElementPath: [...this.parentElementPath, newElementKey],
                    selectedElementName: newElementKey,
                    start: {x: this.editData.x1, y: this.editData.y1},
                    end: {x: this.editData.x2, y: this.editData.y2},
                    totalOffset: this.totalOffset ? this.totalOffset : {x: 0, y: 0}
                })
                break
            case "SELECT":
                if (!this.selectData) {
                    return
                }

                var selectedElement = {...this.state.selectedElement}
                var xDelta = event.nativeEvent.offsetX - this.selectData.startX
                var yDelta = event.nativeEvent.offsetY - this.selectData.startY
                var adjustedX = this.selectData.origX + xDelta
                var adjustedY = this.selectData.origY + yDelta

                // Calculate max x and y
                maxX -= selectedElement.width
                maxY -= selectedElement.height
                if (this.parentElement) {
                    maxX = this.parentElement.width - selectedElement.width
                    maxY = this.parentElement.height - selectedElement.height
                }

                console.log(`MAX: ${maxX}, ${maxY}`)

                // Min/Maxing
                adjustedX = Math.min(adjustedX, maxX)
                adjustedY = Math.min(adjustedY, maxY)
                adjustedX = adjustedX >= 0 ? adjustedX : 0
                adjustedY = adjustedY >= 0 ? adjustedY : 0

                selectedElement.x = (adjustedX).toString()
                selectedElement.y = (adjustedY).toString()

                MapUtil.setPath({layout}, this.state.selectedElementPath, selectedElement)
                cardLayout.layout = layout

                this.setState({cardLayout, selectedElement})
                break
            default:
                break
        }
    }

    clickEnd = (event) => {
        switch(this.state.mode) {
            case "CREATE":
                if (!this.editData) {
                    return
                }

                this.setState({index: this.state.index + 1})
                break
            case "SELECT":
                break
            default:
                break
        }

        this.editData = null
        this.selectData = null
        this.parentElement = this.state.cardLayout
        this.parentElementPath = []
        this.elementWasClicked = false
        this.totalOffset = {x: 0, y: 0}
    }

    elementClicked = (elementName, path) => {
        this.totalOffset = MapUtil.calculateTotalOffset(this.state.cardLayout, path)
        this.elementWasClicked = true

        var layout = {...this.state.cardLayout.layout}

        console.log("OFFSET: " + JSON.stringify(this.totalOffset, null, 5))
        switch(this.state.mode) {
            case "CREATE":
                this.parentElementPath = path
                this.parentElement = MapUtil.getPath({layout}, path)
                break
            case "SELECT":
                var selectedElementPath = path
                var selectedElement = MapUtil.getPath({layout}, path)
                var parentPath = [...path]
                parentPath.pop()
                this.parentElementPath = parentPath
                this.parentElement = MapUtil.getPath({layout}, parentPath)
                this.setState({selectedElement, selectedElementPath, selectedElementName: elementName})
                break
            default:
                break
        }
    }

    onTypeChange = (type) => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}
        var cardData = {...this.state.cardData}
        if (type === "image") {
            cardData[this.state.selectedElementName] = `https://cors-anywhere.herokuapp.com/https://dummyimage.com/100x100/fff/000&text=image`
        } else if (type === "text") {
            selectedElement.fontStyle = {
                fontFamily: "Arial",
                fontSize: 18,
                fill: 0,
                align: "center",
                wordWrap: true,
                wordWrapWidth: selectedElement.width
            }
            cardData[this.state.selectedElementName] = "Text"
        }

        selectedElement.type = type

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, cardData, selectedElement})
    }

    onCenterX = () => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}

        var parentPath = [...this.state.selectedElementPath]
        parentPath.pop()
        var parentElement = MapUtil.getPath({layout}, parentPath) || this.state.cardLayout
        var parentWidth = parentElement.width

        selectedElement.x = ((parentWidth - selectedElement.width) / 2).toString()

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, selectedElement})
    }

    onCenterY = () => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}

        var parentPath = [...this.state.selectedElementPath]
        parentPath.pop()
        var parentElement = MapUtil.getPath({layout}, parentPath) || this.state.cardLayout
        var parentHeight = parentElement.height

        selectedElement.y = ((parentHeight - selectedElement.height) / 2).toString()

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, selectedElement})
    }

    changeX = (x) => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}

        selectedElement.x = x

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, selectedElement})
    }

    changeY = (y) => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}

        selectedElement.y = y

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, selectedElement})
    }

    changeWidth = (width) => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}

        selectedElement.width = width

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, selectedElement})
    }

    changeHeight = (height) => {
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}
        var selectedElement = {...this.state.selectedElement}

        selectedElement.height = height

        MapUtil.setPath({layout}, [...this.state.selectedElementPath], selectedElement)
        cardLayout.layout = layout

        this.setState({cardLayout, selectedElement})
    }

    onCardDataChanged = (cardData) => {
        this.setState({cardData})
    }

    onCardLayoutChanged = (cardLayout) => {
        this.setState({cardLayout})
    }

    splitV = () => {
        var blocks = this.state.vSplit
        var selectedElement = this.state.selectedElement
        var index = this.state.index
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}

        var blockHeight = selectedElement.height / blocks
        this.parentElement = selectedElement
        this.parentElementPath = this.state.selectedElementPath

        for (var i = 0; i < blocks; i++) {
            var newElementKey = "container" + (index + i)
            var newElement = {
                type: "container",
                x: (0).toString(),
                y: (i * blockHeight).toString(),
                width: this.parentElement.width.toString(),
                height: blockHeight.toString(),
                background: 0xffffff,
                layout: {}
            }

            // Alternate background colors for nested elements
            if (this.parentElement) {
                if (this.parentElement.background === 0xffffff) {
                    newElement.background = 0x000000
                } else {
                    newElement.background = 0xffffff
                }
            }

            MapUtil.setPath({layout}, [...this.parentElementPath, newElementKey], newElement)
        }
        cardLayout.layout = layout

        this.setState({cardLayout, vSplit: 2, index: index + blocks})
    }

    splitH = () => {
        var blocks = this.state.hSplit
        var selectedElement = this.state.selectedElement
        var index = this.state.index
        var cardLayout = {...this.state.cardLayout}
        var layout = {...this.state.cardLayout.layout}

        var blockWidth = selectedElement.width / blocks
        this.parentElement = selectedElement
        this.parentElementPath = this.state.selectedElementPath

        for (var i = 0; i < blocks; i++) {
            var newElementKey = "container" + (index + i)
            var newElement = {
                type: "container",
                x: (i * blockWidth).toString(),
                y: (0).toString(),
                width: blockWidth.toString(),
                height: this.parentElement.height.toString(),
                background: 0xffffff,
                layout: {}
            }

            // Alternate background colors for nested elements
            if (this.parentElement) {
                if (this.parentElement.background === 0xffffff) {
                    newElement.background = 0x000000
                } else {
                    newElement.background = 0xffffff
                }
            }

            MapUtil.setPath({layout}, [...this.parentElementPath, newElementKey], newElement)
        }
        cardLayout.layout = layout

        this.setState({cardLayout, hSplit: 2, index: index + blocks})
    }
    
    render() {
        return (
            <div>
                <h1>Create Card Template</h1>
                <div style={{display: "table"}}>
                    <div style={{display: "table-cell", width: "49%", verticalAlign: "middle"}}>
                        <div>
                            {this.state.mode} mode
                        </div>
                        <div>
                            <button onClick={() => {this.setState({mode: "CREATE"})}} disabled={this.state.mode === "CREATE"}>Create</button>
                            <button onClick={() => {this.setState({mode: "SELECT"})}} disabled={this.state.mode === "SELECT"}>Select</button>
                        </div>
                        <div>
                            <CardRenderer 
                                onMouseDown={e => this.clickStart(e)} 
                                onMouseUp={e => this.clickEnd(e)} 
                                onMouseMove={e => this.clickMove(e)}
                                onElementClicked={(elementName, path) => {this.elementClicked(elementName, path)}}
                                cardLayout={this.state.cardLayout}
                                cardData={this.state.cardData} />
                        </div>
                    </div>
                    <div style={{display: "table-cell", width: "49%", verticalAlign: "middle"}}>
                        {this.state.selectedElement ?
                        <div>
                            <label>Name</label><input type="text" value={this.state.selectedElementName} /><br />
                            <label>Type</label>
                            <select value={this.state.selectedElement.type} onChange={(e) => {this.onTypeChange(e.target.value)}}>
                                <option value={"image"}>Image</option>
                                <option value={"text"}>Text</option>
                                <option value={"container"}>Container</option>
                            </select><br />
                            <label>Width</label><input onChange={(e) => {this.changeWidth(e.target.value)}} type="text" value={this.state.selectedElement.width} /><br />
                            <label>Height</label><input onChange={(e) => {this.changeHeight(e.target.value)}} type="text" value={this.state.selectedElement.height} /><br />
                            <label>X</label><input onChange={(e) => {this.changeX(e.target.value)}} type="text" value={this.state.selectedElement.x} /><br />
                            <label>Y</label><input onChange={(e) => {this.changeY(e.target.value)}} type="text" value={this.state.selectedElement.y} /><br />
                            <button onClick={() => {this.onCenterX()}}>Center X</button><br />
                            <button onClick={() => {this.onCenterY()}}>Center Y</button><br />
                            <button onClick={() => {this.splitV()}}>Split Vertically Into</button><input type="number" value={this.state.vSplit} onChange={(e) => {this.setState({vSplit: e.target.value})}} /> blocks<br />
                            <button onClick={() => {this.splitH()}}>Split Horizontally Into</button><input type="number" value={this.state.hSplit} onChange={(e) => {this.setState({hSplit: e.target.value})}} /> blocks<br />
                        </div> : null }
                    </div>
                </div>
                <div style={{display: "inline-block", margin: "2px"}}>
                    <h2>Layout JSON:</h2>
                    <textarea style={{textAlign: "left", height: "200px", width: "400px", margin: "auto", background: "grey", color: "white", overflowX: "scroll"}} onChange={(e) => {this.onCardLayoutChanged(JSON.parse(e.target.value))}} value={JSON.stringify(this.state.cardLayout, null, 5)} />
                </div>
                <div style={{display: "inline-block", margin: "2px"}}>
                    <h2>Data JSON:</h2>
                    <textarea style={{textAlign: "left", height: "200px", width: "400px", margin: "auto", background: "grey", color: "white", overflowX: "scroll"}} onChange={(e) => {this.onCardDataChanged(JSON.parse(e.target.value))}} value={JSON.stringify(this.state.cardLayout, null, 5)} value={JSON.stringify(this.state.cardData, null, 5)} />
                </div>
            </div>
        )
    }
}