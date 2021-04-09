const {
  LogicEngine, AsyncLogicEngine
} = require('./index')

const Yield = require('./structures/Yield')
const EngineObject = require('./structures/EngineObject')

const sync = new LogicEngine(undefined, { yieldSupported: true })
const nosync = new AsyncLogicEngine(undefined, { yieldSupported: true })

const yieldVar = (key, context, above, engine) => {
  if (Array.isArray(key)) {
    key = key[0]
  }

  let iter = 0
  while (key.startsWith('../') && iter < above.length) {
    context = above[iter++]
    key = key.substring(3)
  }

  if (typeof key === 'undefined' || key === '' || key === null) {
    return context
  }
  const subProps = String(key).split('.')
  for (let i = 0; i < subProps.length; i++) {
    if (context === null || context === undefined) {
      return new Yield({ message: 'Data is not found.' })
    }
    // Descending into context
    context = context[subProps[i]]
    if (context === undefined) {
      return new Yield({ message: 'Data is not found.' })
    }
  }

  if (engine.allowFunctions || typeof context[key] !== 'function') { return context }
  return null
}
sync.addMethod('yieldVar', yieldVar)
nosync.addMethod('yieldVar', yieldVar)

describe('Sync Yielding Iterator Test', () => {
  test('someYield', () => {
    const script = {
      someYield: [[true, false, true], { var: '' }]
    }

    expect(sync.run(script)).toBe(true)

    const script2 = {
      someYield: [[{ yieldVar: 'a' }, false, false], { var: '' }]
    }
    const instance = sync.run(script2)
    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(sync.run(instance.logic(), { a: 10 })).toBe(10)
    expect(sync.run(instance.logic(), { a: 0 })).toBe(false)
  })

  test('everyYield', () => {
    const script = {
      everyYield: [[true, true, true], { var: '' }]
    }

    expect(sync.run(script)).toBe(true)

    const script2 = {
      everyYield: [[true, true, { yieldVar: 'a' }], { var: '' }]
    }
    const instance = sync.run(script2)
    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(sync.run(instance.logic(), { a: false })).toBe(false)
    expect(sync.run(instance.logic(), { a: true })).toBe(true)
  })
})

describe('ifYield', () => {
  test('it should take the first branch if the first value is truthy', () => {
    const answer = sync.run({
      ifYield: [1, 2, 3]
    })

    expect(answer).toBe(2)
  })

  test('it should take the second branch if the first value is falsey', () => {
    const answer = sync.run({
      ifYield: [0, 2, 3]
    })

    expect(answer).toBe(3)
  })
})

describe('iterators', () => {
  test('some false', async () => {
    const answer = sync.run({
      someYield: [
        [1, 2, 3], {
          '>': [{
            var: ''
          }, 5]
        }
      ]
    })

    expect(answer).toBe(false)
  })

  test('some true', async () => {
    const answer = sync.run({
      someYield: [
        [1, 2, 3], {
          '>': [{
            var: ''
          }, 2]
        }
      ]
    })

    expect(answer).toBe(true)
  })

  test('every false', async () => {
    const answer = sync.run({
      everyYield: [
        [1, 2, 3], {
          '>': [{
            var: ''
          }, 5]
        }
      ]
    })

    expect(answer).toBe(false)
  })

  test('every true', async () => {
    const answer = sync.run({
      everyYield: [
        [1, 2, 3], {
          '<': [{
            var: ''
          }, 5]
        }
      ]
    })

    expect(answer).toBe(true)
  })

  test('map +1', async () => {
    const answer = sync.run({
      mapYield: [
        [1, 2, 3], {
          '+': [{
            var: ''
          }, 1]
        }
      ]
    })

    expect(answer).toStrictEqual([2, 3, 4])
  })

  test('filter evens', async () => {
    const answer = sync.run({
      filterYield: [
        [1, 2, 3], {
          '%': [{
            var: ''
          }, 2]
        }
      ]
    })

    expect(answer).toStrictEqual([1, 3])
  })

  test('map +above', () => {
    const answer = sync.run({
      mapYield: [
        [1, 2, 3], {
          '+': [{
            var: ''
          }, {
            var: '../../data'
          }]
        }
      ]
    }, {
      data: 1
    })

    expect(answer).toStrictEqual([2, 3, 4])
  })

  test('yielded selector map +above', () => {
    const instance = sync.run({
      mapYield: [
        [1, 2, 3, { yieldVar: 'x' }], {
          '+': [{
            var: ''
          }, {
            var: '../../data'
          }]
        }
      ]
    }, {
      data: 1
    })

    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(sync.run(instance.logic(), { data: 1, x: 4 })).toStrictEqual([2, 3, 4, 5])
  })

  test('yielded iterator map +above', () => {
    const instance = sync.run({
      mapYield: [
        [1, 2, 3, 4], {
          '+': [{
            var: ''
          }, {
            var: '../../data'
          }, {
            yieldVar: '../../x'
          }]
        }
      ]
    }, {
      data: 1
    })

    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(sync.run(instance.logic(), { data: 0.5, x: 0.5 })).toStrictEqual([2, 3, 4, 5])
  })
})

describe('Async Yielding Iterator Test', () => {
  test('someYield', async () => {
    const script = {
      someYield: [[true, false, true], { var: '' }]
    }

    expect(await nosync.run(script)).toBe(true)

    const script2 = {
      someYield: [[{ yieldVar: 'a' }, false, false], { var: '' }]
    }
    const instance = await nosync.run(script2)
    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(await nosync.run(instance.logic(), { a: 10 })).toBe(10)
    expect(await nosync.run(instance.logic(), { a: 0 })).toBe(false)
  })

  test('everyYield', async () => {
    const script = {
      everyYield: [[true, true, true], { var: '' }]
    }

    expect(await nosync.run(script)).toBe(true)

    const script2 = {
      everyYield: [[true, true, { yieldVar: 'a' }], { var: '' }]
    }
    const instance = await nosync.run(script2)
    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(await nosync.run(instance.logic(), { a: false })).toBe(false)
    expect(await nosync.run(instance.logic(), { a: true })).toBe(true)
  })
})

describe('ifYield', () => {
  test('it should take the first branch if the first value is truthy', async () => {
    const answer = await nosync.run({
      ifYield: [1, 2, 3]
    })

    expect(answer).toBe(2)
  })

  test('it should take the second branch if the first value is falsey', async () => {
    const answer = await nosync.run({
      ifYield: [0, 2, 3]
    })

    expect(answer).toBe(3)
  })
})

describe('iterators', () => {
  test('some false', async () => {
    const answer = await nosync.run({
      someYield: [
        [1, 2, 3], {
          '>': [{
            var: ''
          }, 5]
        }
      ]
    })

    expect(answer).toBe(false)
  })

  test('some true', async () => {
    const answer = await nosync.run({
      someYield: [
        [1, 2, 3], {
          '>': [{
            var: ''
          }, 2]
        }
      ]
    })

    expect(answer).toBe(true)
  })

  test('every false', async () => {
    const answer = await nosync.run({
      everyYield: [
        [1, 2, 3], {
          '>': [{
            var: ''
          }, 5]
        }
      ]
    })

    expect(answer).toBe(false)
  })

  test('every true', async () => {
    const answer = await nosync.run({
      everyYield: [
        [1, 2, 3], {
          '<': [{
            var: ''
          }, 5]
        }
      ]
    })

    expect(answer).toBe(true)
  })

  test('map +1', async () => {
    const answer = await nosync.run({
      mapYield: [
        [1, 2, 3], {
          '+': [{
            var: ''
          }, 1]
        }
      ]
    })

    expect(answer).toStrictEqual([2, 3, 4])
  })

  test('filter evens', async () => {
    const answer = await nosync.run({
      filterYield: [
        [1, 2, 3], {
          '%': [{
            var: ''
          }, 2]
        }
      ]
    })

    expect(answer).toStrictEqual([1, 3])
  })

  test('map +above', async () => {
    const answer = await nosync.run({
      mapYield: [
        [1, 2, 3], {
          '+': [{
            var: ''
          }, {
            var: '../../data'
          }]
        }
      ]
    }, {
      data: 1
    })

    expect(answer).toStrictEqual([2, 3, 4])
  })

  test('yielded selector map +above', async () => {
    const instance = await nosync.run({
      mapYield: [
        [1, 2, 3, { yieldVar: 'x' }], {
          '+': [{
            var: ''
          }, {
            var: '../../data'
          }]
        }
      ]
    }, {
      data: 1
    })

    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(await nosync.run(instance.logic(), { data: 1, x: 4 })).toStrictEqual([2, 3, 4, 5])
  })

  test('yielded iterator map +above', async () => {
    const instance = await nosync.run({
      mapYield: [
        [1, 2, 3, 4], {
          '+': [{
            var: ''
          }, {
            var: '../../data'
          }, {
            yieldVar: '../../x'
          }]
        }
      ]
    }, {
      data: 1
    })

    expect(instance instanceof EngineObject || instance instanceof Yield).toBe(true)
    expect(await nosync.run(instance.logic(), { data: 0.5, x: 0.5 })).toStrictEqual([2, 3, 4, 5])
  })
})
