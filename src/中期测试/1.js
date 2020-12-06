const man = {
  name: 'jscoder',
  age: '22'
}

const proxy = new Proxy(man, {
  get(obj, key) {
    if(Object.keys(obj).includes(key)) {
      return obj[key]
    } else {
      return `property ${key} does not exist`
    }
  },
  set(obj, key, val) {
    obj[key] = val
  }
})

console.log(proxy.name)
console.log(proxy.age)
console.log(proxy.location)