import Promise from '../src/index'

const promise = new Promise((resolve, reject) => {
  const a = Math.random() * 10
  if (a > 5) {
    resolve('a')
  } else {
    reject('b')
  }
})

console.log('a')

promise.then((value) => {
  console.log('onFulfilled()1', value)
})

promise.then((value) => {
  console.log('onFulfilled()2', value)
})

promise.catch(reason => {
  console.log("onRejected()1", reason)
})
