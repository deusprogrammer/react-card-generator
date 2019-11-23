import React from 'react'

import { Container, Text, Sprite } from "@inlet/react-pixi"
import Rectangle from "../elements/Rectangle"

export default class CardElement extends React.Component {
    render() {
        let data = this.props.cardData[this.props.elementKey]
        console.log(this.props.elementKey + " => " + JSON.stringify(this.props.element))
        console.log(this.props.cardData[this.props.elementKey])

        let width = this.props.element.width || this.props.parent.width
        let height = this.props.element.height || this.props.parent.height

        if (width.indexOf("%") !== -1) {
            width = width.substring(0, width.length - 1)
            console.log("WIDTH PERCENT: " + width)
            width = width/100.0 * this.props.parent.width
        }

        if (height.indexOf("%") !== -1) {
            height = height.substring(0, height.length - 1)
            console.log("HEIGHT PERCENT: " + height)
            height = height/100.0 * this.props.parent.height 
        }

        width *= this.props.scale
        height *= this.props.scale

        let x = this.props.element.x
        let y = this.props.element.y

        if (x.indexOf("%") !== -1) {
            x = x.substring(0, x.length - 1)
            console.log("X PERCENT: " + x)
            x = x/100.0 * this.props.parent.width
        }

        if (y.indexOf("%") !== -1) {
            y = y.substring(0, y.length - 1)
            console.log("Y PERCENT: " + y)
            y = y/100.0 * this.props.parent.height
        }

        x *= this.props.scale
        y *= this.props.scale

        console.log("SCALE: " + this.props.scale)
        console.log("COORD: " + x + ", " + y)
        console.log("DIMS:  " + width + " X " + height)

        let contents = null
        if (this.props.element.type === "image") {
            contents = <Sprite 
                            image={data} 
                            x={0} 
                            y={0} 
                            width={width} 
                            height={height} />
        } else if (this.props.element.type === "text") {
            let fontStyle = {...this.props.element.fontStyle}
            fontStyle.fontSize *= this.props.scale
            fontStyle.wordWrapWidth *= this.props.scale
            contents = <Text 
                            anchor={this.props.element.anchor} 
                            x={0} 
                            y={0} 
                            text={data} 
                            style={fontStyle} />
        } else if (this.props.element.type === "container" && this.props.element.background) {
            contents = <Rectangle 
                            fill={this.props.element.background} 
                            x={0} 
                            y={0} 
                            width={width} 
                            height={height} />
        }

        return (
            <Container 
                x={x} 
                y={y} 
                width={width} 
                height={height}
                zIndex={this.props.zIndex}
                interactiveChildren={true}
                interactive={true}
                pointerdown={() => {this.props.onElementClicked(this.props.elementKey)}}>
                {contents}
                {
                    Object.keys(this.props.element.layout).map((key) => {
                        let element = this.props.element.layout[key]

                        return (
                            <CardElement
                                key={this.elementKey + "." + key}
                                elementKey={key}
                                element={element}
                                onElementClicked={this.props.onElementClicked}
                                zIndex={this.props.zIndex + 1}
                                scale={this.props.scale}
                                parent={this.props.element}
                                cardData={this.props.cardData} 
                                />)
                    })
                }
            </Container>
        )
    }
}