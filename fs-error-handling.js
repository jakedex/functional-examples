const fs = require('fs')

const Right = x =>
  ({
    // like map but returns "unboxed" value
    chain: f => f(x),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    inspect: () => `Right(${x})`
  })

const Left = x =>
  ({
    chain: f => Left(x),
    map: f => Left(x),
    fold: (f, g) => f(x),
    inspect: () => `Left(${x})`
  })

const fromNullable = x =>
  x != null ? Right(x) : Left(null)

const tryCatch = (f) => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

const getPort = fileName =>
  tryCatch(() => fs.readFileSync(fileName))
    .map(c => JSON.parse(c))
    .fold(
      e => 3000,
      c => c.port
    )

console.log(getPort())
console.log(getPort('con.json'))
console.log(getPort('config.json'))


const getPortNew = fileName =>
  tryCatch(() => fs.readFileSync(fileName))
  .chain(c => tryCatch(() => JSON.parse(c)))
  .fold(
    e => 3000,
    c => c.port
  )


console.log(getPortNew())
console.log(getPortNew('con.json'))

console.log(getPortNew('configBad.json'))
console.log(getPort('config.json'))
