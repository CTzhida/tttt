const cookieParser = process.server ? require('cookieparser') : undefined
const state = () => {
  return {
    user: null
  }
}

const mutations = {
  setUser (state,data) {
    state.user = data
  }
}

const actions = {
  //  特殊的action方法，会在服务器端渲染期间自动调用 
  nuxtServerInit ({commit}, { req }) {
    let auth = null
    if(req.headers.cookie) {
      const parsed = cookieParser.parse(req.headers.cookie)
      
      try {
        auth = JSON.parse(parsed.user)
        console.log(auth)
      } catch (err) {
        console.log(err)
      }
      commit('setUser',auth)
    }
  }
}

export default {
  state,
  mutations,
  actions
}