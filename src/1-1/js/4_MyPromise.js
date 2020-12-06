    const { reject } = require("lodash")

/**
 * promise使用： new Promise((resolve, reject) => {}).then(res => {}, e => {}).catch((e) => {}).finally(() => {})
 * 由上可以看出Promise首先是一个类，创建的过程传入一个执行器函数立即执行，并且带有两个参数resolve和reject，
 * 且每个promise且有then、catch、finally方法
 * Promise的静态方法包括 .all .resolve
 * 从使用方法确定需要需要实现MyPromise内部的结构
 * 
 * promise的特性
 * 两个参数 resolve,reject，且都是function，负责修改Promise的状态,内部实现这两个方法 并在构造函数处使用
 * 三个状态 pengding、fulfilled、rejected,并且只能从pending=>fulfilled, pending => rejected，修改之后不可改变
 * resolve修改状态为fulfilled,reject修改状态为rejected
 * 由使用方法可看出then方法接收两个参数，分别为成功的回调函数和失败的回调函数
 * 成功的回调函数会接收resolve()产生的结果作为参数，失败的回调函数会接受reject()产生的结果作为参数
 * 以上实现基本核心功能
 * 
 * 
 * 并且Promise可链式调用 所以then方法执行之后返回的结果也应该是一个Promise对象
 */
const PENDING = 'PENGDING'
const FUIFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// 调用then里面返回的resolve和reject方法，实现then的链式调用
function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x) { // 解决循环调用本身
        reject(new TypeError('Chaining cycle detected for promise'))
    }
    // 当回调函数调用之后如果返回的是MyPromise的话，则直接调用上一个then方法中返回的Mypromise的then方法
    if(x instanceof MyPromise) {
        x.then(resolve, reject)
    } else { // 如果是执行结果不是MyPromise的话，直接返回该结果
        resolve(x)
    }
}

class MyPromise {
    constructor(fn) {
        try {
            fn(this.resolve, this.reject)
        } catch(e) {
            this.reject(e)

        }
    }

    //创建时 状态为pending
    // 初始化状态、成功值和失败值
    status = PENDING
    value = null
    error = null
    successCallbackQuery = [] // 成功回调函数队列
    failCallbackQuery = []  // 失败回调函数队列

    resolve = (value) => {
        // 如果是pengding状态修改状态，否则不变
        if(this.status !== PENDING) return
        this.status = FUIFILLED
        this.value = value
        // 开始执行异步成功回调函数队列
        while(this.successCallbackQuery.length > 0) {
            this.successCallbackQuery.shift()()
        }
    }
    reject = (error) => {
        // 如果是pengding状态修改状态，否则不变
        if(this.status !== PENDING) return
        this.status = REJECTED
        this.error = error
        // 开始执行异步失败回调函数队列
        while(this.failCallbackQuery.length > 0) {
            this.failCallbackQuery.shift()()
        }
    }
    then = (successCallback, failCallback) => {
        // successcallback和failcallback默认值，实现promise.then内无回调函数产生的值穿透
        successCallback =  successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback: err => {throw err}

        let promise2 = new MyPromise((resolve, reject) => {
            if(this.status === FUIFILLED) {
                process.nextTick(() => { // 模拟微任务异步函数
                    try {
                        let x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })                           
            } else if(this.status === REJECTED) {
                process.nextTick(() => {
                    try{
                        let x = failCallback(this.error)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            } else {
                this.successCallbackQuery.push(() => {  // 保存异步成功函数队列
                    process.nextTick(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }catch (e) {
                            reject(e)
                        }
                    })             
                })
                this.failCallbackQuery.push(() => { // 保存异步失败函数队列
                    process.nextTick(() => {
                        try {
                            let x = failCallback(this.error)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
        });
        return promise2;
    }

    // catch方法只执行错误的回调，相当于then方法中没有成功的回调，可以直接then方法复用
    catch = callback => {
        this.then(undefined, callback)
    }

    finally (callback) {
        return this.then((value) => {
            // 返回新的MyPromise处理callback回调函数，解决在finally里面处理异步函数 
            return MyPromise.resolve(callback()).then(res => value)
        }, err => {
            return MyPromise.resolve(callback()).then(() => { throw err})
        })
    }
    static all (array) {
        let result = []
        let index = 0
        return new MyPromise((resolve, reject) => {
            function addData(i, value) {
                result[i] = value
                index++ 
                if(index === array.length) {
                    resolve(result)
                }
            }
            for(let i = 0; i < array.length; i++) {
                let current = array[i]
                if(current instanceof MyPromise) {
                    current.then(res => {
                        addData(i, res)
                    }, err => {
                        reject(err)
                    })
                } else [
                    addData(i, array[i])

                ]
            }
        })
    }

    static resolve(value) {
        if(value instanceof MyPromise) return value
        return MyPromise(resolve => {
            resolve(value)
        })
    }
}
