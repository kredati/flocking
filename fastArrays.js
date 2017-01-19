'use strict'

// Rewrite several common Array.prototype functions to be faster
// These are probably much more fragile
//

let FastArrays = (() => {

  let methods = {

    'fast': true,

    filter (f, ctx) {
      if (ctx) return Array.prototype.map.call(this, f, ctx)

      let myLength = this.length,
        index = 0,
        filtered = []

      for (index; index < myLength; ++index) {
        let element = this[index]

        if (f(element, index, this)) filtered.push(this[index])
      }

      return filtered
    },

    forEach (f, ctx) {
      if (ctx) return Array.prototype.forEach.call(this, f, ctx)

      let myLength = this.length,
        index = 0

      for (index; index < myLength; ++index) {
        f(this[index], index, this)
      }

      return null

    },

    map (f, ctx) {
      if (ctx) return Array.prototype.map.call(this, f, ctx)

      let myLength = this.length,
        index = 0,
        mapped = []

      for (index; index < myLength; ++index) {
        mapped[index] = f(this[index], index, this)
      }

      return mapped
    },

    reduce (f, initialValue) {
      let myLength = this.length,
        index = 0,
        accumulator = initialValue

      if (!accumulator) {
        accumulator = this[0]
        ++index
      }

      for (index; index < myLength; ++index) {
        accumulator = f(accumulator, this[index], index, this)
      }

      return accumulator
    }
  }

  return {

    makeFast (arr) {
      return Object.assign(arr, methods)
    },

    methods,

    newFast () {
      return Object.assign([], methods)
    }

  }

})()
