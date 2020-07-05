const fp = require('lodash/fp')

const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 70000, in_stock: true },
    { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true },
    { name: 'Pageni Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false }
]

//Exercise 1
//使用函数组合fp.flowRight()重新实现这个函数
// let isLastInStock = function (cars) {
//     let last_car = fp.last(cars)
//     return fp.prop('in_stock', last_car)
// }


// 函数作用：获取最后一种车的in_stock 状态
// fp.flowRight从右开始执行，并返回值当作左边的参数，先执行fp.last,再执行fp.prop,代码如下
const isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars))

//Exercise 2
//使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

// 与练习一一样，将fp.last换成fp.first 即可,代码如下
const isFirstInStock = fp.flowRight(fp.prop('in_stock'), fp.first)
console.log(isFirstInStock(cars))

//Exercise 3
// 使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现
let _avarage = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
// let averageDollarValue = function (cars) {
//     let dollar_values = fp.map(function (car) {
//         return car.dollar_value
//     },cars)
//     return _avarage(dollar_values)
// } 
// console.log(averageDollarValue(cars))

// 函数作用，获取cars数组中的所有car的dollar_value,通过reduce方法累加，结果求平均
// 首先第一步获取dollar_value,然后返回值做为_avarage的参数即可，代码如下
let averageDollarValue = fp.flowRight(_avarage,fp.map(fp.prop('dollar_value')))
console.log(averageDollarValue(cars))

//Exercise 4
//是用flowRight写一个sanitiziNames()函数，返回一个下划线链接的小写字符串，并把数组中的name转换为这种格式：
//sanitiziName(["Hello World"]) => ["hello_world"]
let _underscore = fp.replace(/\W+/g, '_')

//首先遍历获取cars数组中的name,然后遍历names数组，对内容转小写fp.lowerCase,然后对产生的值遍历调用_underscore
//由于每一次结果都需要遍历 可以换成在外面一层遍历 每次遍历执行上述过程，减少遍历次数，代码如下
let sanitiziName = function (cars) {
    return fp.map(fp.flowRight(_underscore, fp.lowerCase, fp.prop('name')))(cars)
}
console.log(sanitiziName(cars))