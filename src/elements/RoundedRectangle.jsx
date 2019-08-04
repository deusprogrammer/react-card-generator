import { Graphics } from 'pixi.js'
import { PixiComponent } from '@inlet/react-pixi'

export default PixiComponent('RoundedRectangle', {
  create: props => {
    return new Graphics()
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { fill, x, y, width, height, radius } = newProps
    instance.clear()
    instance.beginFill(fill)
    console.log("FN: " + instance.drawRoundedRect)
    instance.drawRoundedRect(x, y, width, height, radius)
    instance.endFill()
  },
})