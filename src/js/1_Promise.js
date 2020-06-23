// 直接链式调用
Promise.resolve('hello').then(res => {
    return Promise.resolve(res + ' lagou')
}).then(res => {
    console.log(res + ' I love you')
})

// 使用Promise.all
const a = new Promise(resolve => {
    resolve('hello')
})
const b = new Promise(resolve => {
    resolve('lagou')
})
const c = new Promise(resolve=> {
    resolve('I love you')
})

Promise.all([a,b,c]).then(res => {
  console.log(res.join(' '))  
})
