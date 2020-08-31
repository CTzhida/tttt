### 一、简答题

### 1、请简述 Vue 首次渲染的过程。
> 首先是vue实例的初始化，在构造函数中调用this._init()方法进行初始化;接着在this._init()函数中调用了this.$mounted()方法将用户的template或者自定义的render方法编译成render函数;接着调用mountConponent()方法，触发实例的beforeMount生命钩子;接着创建Watcher对象，进行对数据的劫持监听数据的变化，当数据发生变化的时候，render函数执行生成Vnoded对象，并通过patch方法，对新旧Vnode对象进行对比，增加、修改、删除dom元素；最后触发生命周期的mounted，到此挂载结束。

### 2、请简述 Vue 响应式原理。
> 在Observer对象中通过Object.defindeProperty中的getter和setter方法，对在初始化时候传入的options.data中的每一个数据都进行深层的遍历以及进行劫持，其中数组因为性能的问题并没有对所有的属性进行监听，而是通过改造数组中的方法，类似pop、push、shift等来进行数组的响应修改。当数据放生变化时，通过dep.notify()去进行通知，从而使它关联的组件更新渲染。

### 3、请简述虚拟 DOM 中 Key 的作用和好处。
> 作用：便于虚拟DOM能够追踪到每个节点的身份；好处：会基于key的变化来进行对元算的更新操作而不必对每个元素都进行深层的对比，减少了dom元素的操作和diff算法的时间，提高性能。

### 4、请简述 Vue 中模板编译的过程。
> 首先将模版解析成AST抽象语法树，然后调用optimize对抽象书进行优化，标记语法树上的静态根节点，最后调用generate函数，将AST对象转化为渲染函数。