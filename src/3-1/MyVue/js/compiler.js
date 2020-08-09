class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el) 
  } 
  // 变异模版处理文本节点和元素节点

  // 编译元素节点，处理指令 
  compile (el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(this.isTextNode(node)) {
        this.compileText(node)
      } else if(this.isElementNode(node)) {
        this.compileElement(node)
      }

      // 判断node节点，是否有字节点，如果有字节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })

  }
  // 编译文本节点，处理差值表达式
  compileText(node) {
    // console.dir(node)
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if(reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // 去除v-
        attrName = attrName.substr(2)
        let key = attr.value
        this.updater(node, key, attrName)
      }
    })
  }
  // 修改updater适配v-on:event
  updater (node, key, attrName) {
    // 其他指令的value值
    let value = this.vm[key]
    if(attrName.startsWith('on')) {
      // 提取on指令的事件名称
      value  = attrName.replace('on:', '')
      attrName = 'on'
    }
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node,value, key)
  }

  textUpdater (node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  modelUpdater (node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // v-html
  htmlUpdater (node, value, key) {
    node.innerHTML = value;
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue
    })
  }

  // v-on
  /**
   * 
   * @param node: this.vm 
   * @param { string } event: 事件名称  
   * @param { string } method: 事件处理方法 
   */ 
  onUpdater (node, event, method) {
    let argument = ''
    let reg = /(.+?)\((.+?)\)/;   // 提取小括号前的内容当作方法名称，提取小括号内的内容作为参数
    if (reg.test(method)) {
      argument = RegExp.$2.trim()
      method = RegExp.$1.trim()
    }
    argument = argument.split(',')
    // 判断传入是否函数名称
    if(/^[^\d]\w+$/.test(method)) {
      node.addEventListener(event, () => {
        // 绑定this对象是vue实例
        this.vm.$methods[method].apply(this.vm, argument)
      })
    } else {
      let index = method.indexOf('=')
      if (index >= 0) {
        // 简单处理赋值语句
        const key = method.substr(0, index).trim()
        const value = method.substr(index+1).trim()
        node.addEventListener(event, () => {
          this.vm[key] = value
        })
      } else {
        node.addEventListener(event, () => {
          // 使用eval简单执行 
          eval(key)
        })
      }
    }    
  }

  isTextNode (node) {
    return node.nodeType === 3
  }

  isDirective (attrName) {
    return attrName.startsWith('v-')
  }

  isElementNode (node) {
    return node.nodeType === 1

  }
}