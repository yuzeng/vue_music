// import jsonp from '../common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

export function getLyric (mid) {
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(), // 等同于new Date().getTime();+new Date是简略写法，得到毫秒
    loginUin: 0,
    hostUin: 0,
    g_tk: 210028655,
    platform: 'yqq.json',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
