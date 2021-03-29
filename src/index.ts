enum STATUS {
  PENDING,
  FULFILLED,
  REJECTED
}

interface VoidFn<T = any> {
  (res: T): void
}

export default class Promise {
  private status = STATUS.PENDING
  private onFulfilledCallBack = [] as any[]
  private onRejectedCallBack = [] as any[]

  constructor (exec: (
    resolve: (res: any) => void, reject?: (err: any) => void) => void) {

    const resolve = (res: any) => {
      this.status = STATUS.FULFILLED
      console.log(this)
      this.onFulfilledCallBack.forEach(cb => {
        console.log('ccc')
      })
    }

    const reject = (err: any) => {
      this.status = STATUS.REJECTED
      this.onRejectedCallBack.forEach(cb => cb(err))
    }
    exec(resolve, reject)
  }

  then (onFulfilled?: (res: any) => void, onRejected?: (err: any) => void) {
    console.log('d',onFulfilled)
    onFulfilled && this.onFulfilledCallBack.push(onFulfilled)
    onRejected && this.onRejectedCallBack.push(onFulfilled)
  }

  catch (f: (error: any) => void) {

  }
}