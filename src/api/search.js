import jsonp from '../common/js/jsonp'
import {commonParams, options,URLS} from './config'
import axios from 'axios'

// 热门搜索
export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 1818603455,
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 搜索
export function search (query, page, zhida, perpage) {
  const url = URLS.search
  const data = Object.assign({}, commonParams, {
    g_tk: 8818375,
    w: query,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    needNewCode: 1,
    uin: 0,
    platform: 'h5',
    format: 'json'

  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
