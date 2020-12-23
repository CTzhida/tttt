# 3-5作业

## 1. Vue3.0性能提升主要是通过哪几方面体现的？

1. vue3.0通过Proxy对象重写了响应式系统
   1. Proxy对象本身性能就比defineProperty的性能要更好；vue2 是通过在初始化的时候递归处理拦截属性的getter和setter，一些没有用到属性也会处理成响应式对象。Proxy对象可以拦截对象的访问赋值、删除的操作 不需要初始化的时候就递归遍历处理，只有访问到递归属性的时候才会。
   2. 功能升级：可以监听动态新增的属性；可以监听删除的属性；可以监听数组的索引和length属性

2. 编译优化
  vue3.0中标记和提升所有的静态根结点，diff的时候只需要对比动态节点内容
   1. 引入fragments的特性，模版中不需要唯一的根结点
   2. 静态提升，将所有的静态节点都进行了提升，被提升的节点只在初始化的创建一次，之后更新的时候可以重用
   3. patch flag,动态节点通过标记文本或者prop属性，之后diff的过程只会比较文本内容或prop变化
   4. 缓存事件处理函数 更新时会从缓存中获取之前生成的函数。
3. 源码体积的优化
   1. Vue.js 3.0中移除了一些不常用的API，如inline-template、filter等
   2. 对Tree-shaking更友好，Vue3中的没用到的模块不会被打包，但是核心模块会打包。Keep-Alive、transition等都是按需引入的

## 2. Vue3.0所采用的composition Api与vue2.x使用的Option Api有什么区别？
  
  1. option API是包含一个描述组件选项(data、methods、props等)的对象，不过功能的逻辑会写在一次，导致代码很长很混乱。
  2. Composition API组合式api，将不同的功能逻辑封装成一个setup，是代码更加整洁，更利于导出引用以及更好的支持typeScript

## 3. Proxy相对于Object.defineProperty有哪些优点？
  
  1. 本身的性能比defineProperty更好
  2. 可以监听动态新增的属性；可以监听删除的属性；可以监听数组的索引和length属性

## 4.Vue3.0在编译方面有哪些优化

  vue3.0中标记和提升所有的静态根结点，diff的时候只需要对比动态节点内容

   1. 引入fragments的特性，模版中不需要唯一的根结点
   2. 静态提升，将所有的静态节点都进行了提升，被提升的节点只在初始化的创建一次，之后更新的时候可以重用
   3. patch flag,动态节点通过标记文本或者prop属性，之后diff的过程只会比较文本内容或prop变化
   4. 缓存事件处理函数 更新时会从缓存中获取之前生成的函数。

## 5. Vue3.0响应式系统的实现原理
  
  1. 创建拦截器对象handler，设置对象的get/set/deleteProperty,并返回一个proxy对象
  2. 收集依赖的方法： 创建一个targetMap(weakMap)对象、depsMap(Map)以及dep(set)，其中targetMap用来记录目标对象和一个字典（即depsMap）,key就是目标对象，value即depsMap,depsMap的key是目标对象的属性名称，value是一个set集合，set存储的是effect函数。
  3. 属性的get方法中调用track方法收集依赖，track方法内部会检查是否有正在收集依赖的监听事件activeEffect，没有就直接返回。然后检查该对象是否已经存在targetMap中，如果不在就在targetMap中创建并指向一个存放属性的depsMap，再在这个对象的Map中找到这个属性的监听事件集合Set，如果不存在Set再先创建一个，然后将正在收集依赖的监听事件activeEffect加入到这个属性的事件集合Set中。
  4. 在属性的set方法、deleteProperty方法中调用trigger方法触发更新，trigger函数回去targetMap中查找对象存放属性的depsMap，如果找不到就直接返回，如果找到，就在depsMap中查找属性的监听事件集合dep,找不到直接返回，找到了就循环执行该属性的监听事件集合Set里的每一个事件监听函数activeEffect，执行更新
