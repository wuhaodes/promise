const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 定义回调函数类型
interface callbackType<T = any> {
  (data: T): T
}

// 定义回调函数类型
type callbackType1<T = any> = (data: T) => T
export default class Promise {
  private status = PENDING
  private callbacks = [] as any[]
  private data: any
  /**
   * Promise构造函数
   * @param executor 执行器函数 同步
   */
  constructor(executor: (reslove: callbackType, reject: callbackType) => any) {
    const self = this
    function handle(data: any, key: string, status: string) {
      if (self.status != PENDING) {
        return
      }
      self.status = status;
      self.data = data;
      if (self.callbacks.length > 0) {
        setTimeout(() => self.callbacks.forEach(callbackObj => callbackObj[key]()));
      }
    }
    function resolve(value: any) {
      handle(value, "onFulfilled", FULFILLED)
    }

    function reject(reason: any) {
      handle(reason, "onRejected", REJECTED)
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }

  }

  /**
   * Promise实例对象的then函数
   * @param onFulfilled 成功的回调函数 异步
   * @param onRejected 失败的回调函数 异步
   * @returns 一个新的Promise实例对象
   */
  then(onFulfilled = (value: any) => value, onRejected: callbackType = (reason: any) => { throw reason }) {
    const self = this;
    return new Promise((resolve, reject) => {
      function handle(callback: callbackType) {
        try {
          const result = callback(self.data)
          result instanceof Promise ? result.then(resolve, reject) : resolve(self.data)
        } catch (error) {
          reject(error)
        }
      }
      if (self.status === FULFILLED) {
        setTimeout(() => handle(onFulfilled));
      }
      else if (self.status === REJECTED) {
        setTimeout(() => handle(onRejected));
      }
      else { // PENDING
        self.callbacks.push({
          onFulfilled() {
            handle(onFulfilled)
          },
          onRejected() {
            handle(onRejected)
          }
        })
      }
    })
  }

  /**
   * Promise实例对象的catch函数
   * @param onRejected 失败的回调函数 异步
   * @returns 一个新的Promise实例对象
   */
  catch(onRejected: callbackType) {
    return this.then(undefined, onRejected)
  }

  /**
   * Promise类方法resolve
   * @param value 成功的结果
   * @returns 一个新的promise实例对象
   */
  static resolve(value: any) {
    return new Promise((resolve, reject) => value instanceof Promise ? value.then(resolve, reject) : resolve(value))
  }

  /**
   * Promise 类方法resolveDelay
   * @param value 成功的结果
   * @param ms 延时时间
   * @returns 一个指定时间后成功或失败的Promise实例对象
   */
  static resolveDelay(value: any, ms: number) {
    return new Promise((resolve, reject) => setTimeout(() => value instanceof Promise ? value.then(resolve, reject) : resolve(value), ms))
  }

  /**
   * Promise 类方法reject
   * @param reason 失败的原因
   * @returns 失败的Promise实例对象
   */
  static reject(reason: any) {
    return new Promise((_, reject) => reject(reason))
  }

  /**
   * Promise 类方法rejectDelay
   * @param reason 失败的原因
   * @param ms 延时时间
   * @returns 一个指定时间后失败的Promise对象
   */
  static rejectDelay(reason: any, ms: number) {
    return new Promise((_, reject) => setTimeout(() => reject(reason), ms))
  }

  /**
   * Promise 类方法all
   * @param promises 一组Promise实例对象
   * @returns 返回一个新的Promise实例对象 如果promises中包含失败的Promise实例对象则返回最快失败的结果组成的Promise实例对象，否则返回按照包含按照promises数组顺序成功的结果数组的promise实例对象
   */
  static all(promises: any[]) {
    const promisesLen = promises.length
    const values = new Array(promisesLen)
    let resolvedCount = 0
    return new Promise((resolve, reject) => promises.forEach((promise, index) => Promise.resolve(promise).then(value => {
      resolvedCount++
      values[index] = value
      resolvedCount === promisesLen && resolve(value)
    }, reject)))
  }

  /**
   * Promise 类方法race
   * @param promises 一组Promise实例对象
   * @returns 返回一个包含最快执行的成功或失败的Promise实例对象
   */
  static race(promises: any[]) {
    return new Promise((resolve, reject) => promises.forEach(promise => Promise.resolve(promise).then(resolve, reject)))
  }
}