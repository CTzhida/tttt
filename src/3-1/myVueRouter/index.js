export default class VueRouter {
  constructor (options) {
    this.options = options
    this.routeMap = {}
    // 默认hash模式
    this.mode = options.mode || 'hash'
    this.app = new _Vue({
      data: {
        current: '/'
      }
    })
  }

  static install (Vue) {
    if (VueRouter.install.installed && _Vue === Vue) return

    VueRouter.install.installed = true
    _Vue = Vue

    Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      },
    })
  }

  init () {
    this.initRouteMap()
    this.initEvents()
    this.initCompoents()
  }

  initRouteMap() {
    // routes => [{name: '', path: '', component }]
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射关系
      this.routeMapp[route.path] = route.component
    })
  }

  initEvents () {
    if(this.mode === 'hash') {
      window.addEventListener('hashchange', this.onHashChange.bind(this))
      window.addEventListener('load', this.onHashChange.bind(this))
    } else if(this.mode === 'history') {
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    }
  }

  onHashChange () {
    this.app.current = window.location.hash.substr(1) || '/'
  }

  initCompoents () {
    _Vue.component('RouterLink', {
      props: {
        to: String
      },
      render(h) {
        return h ('a', {
          attrs: {
            // 根据模式生成a标签的href属性
            href: self.mode === 'hash' ? '#' + this.to : this.to
          },
          on: {
            click: this.handleClick
          }
        }, [this.$slot.default])
      }
    })

    const self = this

    _Vue.component('RouterView', {
      render(h) {
        const component = self.routeMap[self.app.current]
        return h(component)
      }
    })
  }

}