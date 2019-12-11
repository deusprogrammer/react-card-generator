import React from 'react'

import { Container, Text, Sprite } from "@inlet/react-pixi"
import Rectangle from "../elements/Rectangle"
import CardElement from './CardElement'

export default (props) => {
    let data = props.element.data || props.cardData[props.elementKey]
    console.log(props.elementKey + " => " + JSON.stringify(props.element))
    console.log(props.cardData[props.elementKey])
    console.log("PATH: " + props.elementPath)

    let width = props.element.width || props.parent.width
    let height = props.element.height || props.parent.height

    if (width.indexOf("%") !== -1) {
        width = width.substring(0, width.length - 1)
        console.log("WIDTH PERCENT: " + width)
        width = width/100.0 * props.parent.width
    }

    if (height.indexOf("%") !== -1) {
        height = height.substring(0, height.length - 1)
        console.log("HEIGHT PERCENT: " + height)
        height = height/100.0 * props.parent.height 
    }

    width *= props.scale
    height *= props.scale

    let x = props.element.x
    let y = props.element.y

    if (x.indexOf("%") !== -1) {
        x = x.substring(0, x.length - 1)
        console.log("X PERCENT: " + x)
        x = x/100.0 * props.parent.width
    }

    if (y.indexOf("%") !== -1) {
        y = y.substring(0, y.length - 1)
        console.log("Y PERCENT: " + y)
        y = y/100.0 * props.parent.height
    }

    x *= props.scale
    y *= props.scale

    console.log("SCALE: " + props.scale)
    console.log("COORD: " + x + ", " + y)
    console.log("DIMS:  " + width + " X " + height)

    let contents = null
    if (props.element.type === "image") {
        contents = <Sprite 
                        image={data} 
                        anchor={props.element.anchor}
                        x={0} 
                        y={0} 
                        width={width} 
                        height={height} />
    } else if (props.element.type === "text") {
        let fontStyle = {...props.element.fontStyle}
        fontStyle.fontSize *= props.scale
        fontStyle.wordWrapWidth *= props.scale
        contents = <Text 
                        anchor={props.element.anchor} 
                        x={0} 
                        y={0} 
                        text={data} 
                        style={fontStyle} />
    } else if (props.element.type === "container" && props.element.background !== null) {
        contents = <Rectangle 
                        fill={props.element.background} 
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
            zIndex={props.zIndex}
            interactiveChildren={true}
            interactive={true}
            pointerdown={(e) => {
                props.onElementClicked(props.elementKey, props.elementPath)
                e.stopPropagation()
            }}>
            {contents}
            {
                Object.keys(props.element.layout).map((key) => {
                    let element = props.element.layout[key]

                    return (
                        <CardElement
                            key={props.elementKey + "." + key}
                            elementKey={key}
                            element={element}
                            elementPath={[...props.elementPath, key]}
                            onElementClicked={props.onElementClicked}
                            zIndex={props.zIndex + 1}
                            scale={props.scale}
                            parent={props.element}
                            cardData={props.cardData} 
                            />)
                })
            }
        </Container>
    )
}