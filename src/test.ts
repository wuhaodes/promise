import Promise from './index'

const promise = new Promise(resolve => {
  const a = Math.random() * 10
  if (a > 5) {
    resolve('a')
  } else {
    resolve('b')
  }
})

promise.then((a) => {
  console.log('c',a)
})

promise.then((c) => {
  console.log(c)
})

promise.catch(error => {
  console.log(error)
})
