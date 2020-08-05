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

  updater (node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
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