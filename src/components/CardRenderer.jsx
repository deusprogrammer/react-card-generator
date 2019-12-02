import React from 'react'

import { Stage, Container } from "@inlet/react-pixi"

import Rectangle from "../elements/Rectangle"
import CardElement from "./CardElement"

export default (props) => {
    if (props.cardLayout && props.cardData) {
        let scale = 1.0

        if (props.scale) {
            scale = props.scale
        } else if (props.width) {
            scale = props.width/props.cardLayout.width
        } else if (props.height) {
            scale = props.height/props.cardLayout.height
        }

        let width = scale * parseInt(props.cardLayout.width)
        let height = scale * parseInt(props.cardLayout.height)
        return (
            <span 
                onMouseDown={props.onMouseDown} 
                onMouseUp={props.onMouseUp} 
                onClick={props.onClick} 
                onMouseMove={props.onMouseMove}>
                <Stage options={{ transparent: true }} width={width} height={height}>
                    <Container 
                        x={0} 
                        y={0} 
                        width={width} 
                        height={height}
                        interactiveChildren={true} >
                        <Rectangle 
                            x={0} 
                            y={0} 
                            fill={props.cardLayout.background} 
                            width={width} 
                            height={height}
                            zIndex={0}
                            interactiveChildren={true} />
                        {
                            Object.keys(props.cardLayout.layout).map((key) => {
                                let element = props.cardLayout.layout[key]
                                return (
                                    <CardElement
                                        key={key}
                                        elementPath={[key]}
                                        elementKey={key}
                                        element={element}
                                        scale={scale}
                                        zIndex={10}
                                        onElementClicked={props.onElementClicked}
                                        parent={props.cardLayout}
                                        cardData={props.cardData} 
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