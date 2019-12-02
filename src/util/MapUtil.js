var self = {
    setPath: (object, path, value) => {
        var p = [...path]
        var key = p.shift()

        if (!p || p.length === 0) {
            object.layout[key] = value
            return
        }

        if (!object.layout[key]) {
            throw "Unable to locate key in map"
        }
        
        self.setPath(object.layout[key], p, value)
    },
    getPath: (object, path) => {
        var p = [...path]
        var key = p.shift()

        if (!p || p.length === 0) {
            return object.layout[key]
        }

        if (!object.layout[key]) {
            throw "Unable to locate key in map"
        }

        return self.getPath(object.layout[key], p)
    },
    calculateTotalOffset: (object, path) => {
        var p = [...path]
        var key = p.shift()

        if (!p || p.length === 0) {
            return {
                x: object.layout[key].x, 
                y: object.layout[key].y
            }
        }

        if (!object.layout[key]) {
            throw "Unable to locate key in map"
        }

        var offset = self.calculateTotalOffset(object.layout[key], p)

        return {
            x: object.layout[key].x + offset.x, 
            y: object.layout[key].y + offset.y
        }
    }
}

export default self