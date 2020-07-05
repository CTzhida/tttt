// 第一题
// var a = []
// for (var i = 0; i < 10; i++) {
//   a[i] = function() {
//     console.log(i)
//   }
// }
// a[6]()

// 第二题
// var tmp = 123;

// if (true) {
//   console.log(tmp)
//   let tmp
// }

// 第三题
// var arr = [12,34,32,89,4]
// const findMinInArr = (arr) => { return Math.min(...arr) }
// console.log(findMinInArr(arr));

// 第四题为叙述题 无具体代码

// 第五题
var a = 10
var obj = {
  a: 20,
  fn () {
    setTimeout(() => {
      console.log(this.a)
    });
  }
}

obj.fn()



