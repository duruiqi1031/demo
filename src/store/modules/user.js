import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // 从缓存中读取初始值
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  removeToken(state) {
    // 删除Vuex的token
    state.token = null
    state.userInfo = {}
    removeToken()
  },

  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    console.log(state.userInfo, '当前登录的用户&&&&&&')
  }
}
const actions = {
  // context上下文，传入参数
  async login(context, payload) {
    // todo: 调用登录接口
    const { data } = await login(payload)
    // 返回一个token 123456\
    context.commit('setToken', data)
  },
  // 获取用户信息
  async getUserInfo(context) {
    const { data } = await getUserInfo()
    context.commit('setUserInfo', data)
  },
  // 登出
  async logout({ commit }) {
    commit('removeToken')
  }
}
export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
