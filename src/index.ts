const PENDING = "PENDING"
const RESOLVED = "resolved"
const REJECTED = "REJECTED"

export default class Promise {
  private status = PENDING
  private callbacks = [] as ((res: any) => any)[]
  private data = undefined as any
  constructor(executor: (reslove: (value: any) => any, reject?: (reason: any) => any) => any) {
    function resolve(value: any) {

    }

    function reject(reason: any) {
    }

    executor(resolve, reject)
  }

  then(onResolved?: (value: any) => any, onRejected?: (reason: any) => any) {

  }
  catch(onRejected: (reason: any) => any) {

  }
  static resolve(value: any) {

  }
  static resolveDelay(value: any) {

  }
  static reject(reason: any) {

  }
  static rejectDelay(reason: any) {

  }
  static all(promises: any[]) {

  }
  static race(promises: any[]) {

  }
}