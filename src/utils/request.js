import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { data, success, message } = response.data
    if (success) {
      Message({
        type: 'success',
        duration: 3 * 1000,
        message
      })
      return response.data
    } else {
      Message({
        type: 'error',
        duration: 3 * 1000,
        message
      })
      return Promise.reject(message)
    }
    // if the custom code is not 20000, it is judged as an error.
  },
  async error => {
    if (error.response.status === 401) {
      Message({ type: 'warning', message: '登录态已失效，请重新登录！' })
      // 说明token超时了
      await store.dispatch('user/logout') // 调用action 退出登录
      //  主动跳到登录页
      router.push('/login') // 跳转到登录页
      return Promise.reject(error)
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
