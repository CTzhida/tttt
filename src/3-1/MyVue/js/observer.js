class Observer{
  constructor (data) {
    this.walk(data)
  }
  // 遍历对象的所有属性
  walk(data) {
    // 1. 判断data是不是对象
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
    // 2. 遍历data对象的所有属性
  }

  defineReactive (data, key, val) {  // data对象
    const _this = this
    // 收集依赖 发送通知
    let dep = new Dep()
    this.walk(val)
 
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (newValue === val) {
          return
        }
        _this.walk(newValue)
        val = newValue
        // 发送通知
        dep.notify()
      }
    })
  }
}