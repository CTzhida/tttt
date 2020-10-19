import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0356c1ef = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _1909a8e4 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _0863bc04 = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _578b9b84 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _2b27e5a8 = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _10f02f9c = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _3e55ded1 = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _0356c1ef,
    children: [{
      path: "",
      component: _1909a8e4,
      name: "home"
    }, {
      path: "login",
      component: _0863bc04,
      name: "login"
    }, {
      path: "register",
      component: _0863bc04,
      name: "register"
    }, {
      path: "profile/:username",
      component: _578b9b84,
      name: "profile"
    }, {
      path: "settings",
      component: _2b27e5a8,
      name: "settings"
    }, {
      path: "editor",
      component: _10f02f9c,
      name: "editor"
    }, {
      path: "article/:slug",
      component: _3e55ded1,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
