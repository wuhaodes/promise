(function (window) {

    // Promise函数是一个构造函数
    // Promise 实例对象是用来封装异步操作并获取结果的
    // 支持链式调用，可解决回调地狱

    // 如何中断一个promise链
    // then的成功或者失败的回调函数或者catch的失败回调函数中返回一个pending状态的promise对象即可中断promsie链

    // 异常传透 reason=>{throw reason}

    const PENDING = "pending"
    const RESOLVED = "resolved"
    const REJECTED = "rejected"


    /**
     * Promise 构造函数
     * @param {*} executor 执行器函数 (resolve,reject)=>{}
     */
    function Promise(executor) {
        const self = this;

        self.status = PENDING;
        self.data = undefined;
        self.callbacks = [];

        function resolve(value) {
            if (self.status != PENDING) {
                return;
            }

            self.status = RESOLVED;
            self.data = value;
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onResolved(value);
                    })
                });
            }
        }

        function reject(reason) {
            if (self.status != PENDING) {
                return;
            }

            self.status = REJECTED;
            self.data = reason;
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onRejected(reason);
                    })
                });
            }
        }

        try {
            executor(resolve, reject)
        }
        catch (error) {
            reject(error)
        }
    }

    /**
     * Promise实例对象的then函数 指定成功和失败的回调函数
     * @param {*} onResolved 成功的回调函数
     * @param {*} onRejected 失败的回调函数
     * @returns 返回一个promise对象
     */
    Promise.prototype.then = function (onResolved, onRejected) {
        const self = this;
        onResolved = typeof onResolved === "function" ? onResolved : value => value
        onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason }

        return new Promise((resolve, reject) => {
            function handle(callback) {
                try {
                    const result = callback(self.data)
                    if (result instanceof Promise) { // 如果是promise对象
                        result.then(resolve, reject)
                    }
                    else {
                        resolve(result)
                    }
                }
                catch (error) { // 异常处理
                    reject(error)
                }
            }

            if (self.status === PENDING) { // 如果当前状态为pending
                self.callbacks.push({
                    onResolved() {
                        handle(onResolved)
                    },
                    onRejected() {
                        handle(onRejected)
                    }
                })
            }
            else if (self.status === RESOLVED) { // 如果当前状态为resolved
                setTimeout(() => handle(onResolved));
            }
            else { // rejected
                setTimeout(() => handle(onRejected)); 如果当前状态为rejected
            }
        })
    }

    /**
     * Promise实例对象的catch函数 指定失败的回调函数
     * @param {*} onRejected 失败的回调函数
     * @returns 返回一个promise对象
     */
    Promise.prototype.catch = function (onRejected) {
        this.then(undefined, onRejected)
    }

    /**
     * Promise函数对象的resolve函数
     * @param {*} value 成功的结果
     * @returns 返回一个成功或失败的promise对象
     */
    Promise.resolve = function (value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(resolve, reject)
            }
            else {
                resolve(value)
            }
        })
    }

    /**
     * Promise函数对象的resolveDelay函数
     * @param {*} value 成功的结果
     * @param {*} ms 延时时间
     * @returns 返回一个指定的时间后成功或失败的promise对象
     */
    Promise.resolveDelay = function (value, ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (value instanceof Promise) {
                    value.then(resolve, reject)
                }
                else {
                    resolve(value)
                }
            }, ms);
        })
    }

    /**
     * Promise函数对象的reject函数
     * @param {*} reason 失败的原因
     * @returns 返回一个失败的promise对象
     */
    Promise.reject = function (reason) {
        return new Promise((resolve, reject) => reject(reason))
    }

    /**
     * Promise函数对象的rejectDelay函数
     * @param {*} reason 失败的原因
     * @param {*} ms 失败的原因
     * @returns 返回一个指定的时间后失败的promise对象
     */
    Promise.rejectDelay = function (reason, ms) {
        return new Promise((resolve, reject) => setTimeout(() => reject(reason), ms))
    }

    /**
     * Promise函数对象的all函数
     * @param {*} promises 一个可迭代的对象 例如promises数组
     * @returns 返回包含一组成功的结果或者reject(异步的返回)失败结果的promise实例对象
     */
    Promise.all = function (promises) {
        const promisesLen = promises.length
        const values = []
        let resolvedCount = 0
        return new Promise((resolve, reject) => {
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(value => {
                    resolvedCount++
                    values[index] = value
                    if (resolvedCount === promisesLen) {
                        resolve(values)
                    }
                }, reason => reject(reason))
            })

        })
    }

    /**
     * Promise函数对象的race函数
     * @param {*} promises 一个可迭代的对象 例如promises数组
     * @returns 返回包含第一个成功的结果或者失败的原因的promise实例对象
     */
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => promises.forEach(promise => Promise.resolve(promise).then(resolve, reject)))
    }

    // 向外暴露 Promise函数
    window.Promise = Promise;

})(window);
