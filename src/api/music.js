// import jsonp from 'common/js/jsonp'
import {commonParams,URLS} from './config'
import axios from 'axios'

export function getMusic (mid) {
  const url = URLS.getMusic
  // const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: 'C400' + mid + '.m4a',
    guid: 6442406400,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    uin: 0,
    cid: 205361747,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
