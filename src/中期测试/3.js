var User = {
  count: 1,
  action: {
    getCount: function () {
      return this.count
    }
  }
}

var getCount = User.action.getCount;
setTimeout(() => {
  console.log('result 1', User.action.getCount())
})

console.log('result 2', getCount())
// result 2, undefined //  this指向window，无count变量
// result 1，undefined  // this 指向user.action,无count属性