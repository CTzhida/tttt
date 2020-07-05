const { replace } = require("lodash/fp");

const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

// Exercise 1
// 是用fp.add(x, y)和fp.map(f,x)创建一个能让functor力的值增加的函数ex1
// map方法是函子的一个转换关系，在这里的转换关系为遍历数组中的每一个值，并且增加，代码如下
let maybe = Maybe.of([5, 6, 1])

let ex1 = (num) => {
    return maybe.map(fp.map(fp.add(num)))
}

console.log(ex1(1)._value)
console.log(ex1(10)._value)

// Exercise 2
// 实现一个函数ex2,能够是用fp.first获取列表的第一个元素
// 转换关系就是fp.first
let xs = Container.of(['do', 'ray','me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    return xs.map(fp.first)
}
console.log(ex2()._value)

// Exercise 3
// 实现一个函数ex3, 是用safeProp和fp.first找到user的名字的首字母

//通过safeProo生成一个函子容器,value为user.name,转换关系为fp.first

let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
    let xs1 = safeProp('name', user)
    return xs1.map(fp.first)
}
console.log(ex3()._value)

// Exercise 3
// 使用MayBe重写ex4,不要有if语句
let ex4 = function (n) {
    if(n) {
        return parseInt(n)
    }
}

// 首先生成一个Maybe函子容器，确定转换关系为parseInt,代码如下
let rewriteEx4 = function(n) {
    let maybe4 = Maybe.of(n)
    return maybe4.map(parseInt)
}
console.log(rewriteEx4('1123123'))
console.log(rewriteEx4('112xasx'))
console.log(rewriteEx4(null))
console.log(rewriteEx4(undefined))
