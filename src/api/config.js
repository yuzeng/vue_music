const base = (typeof baseUrl !== 'undefined') ? baseUrl : "";

export const commonParams = {
  g_tk: 5381,
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

export const options = {
  param: 'jsonpCallback'
}

export const ERR_OK = 0

export const URLS = {
  getMusic: base + '/api/getMusic',
  search: base + '/api/search',
  getDiscList: base + '/api/getDiscList',
  getLyric: base + '/api/getLyric',
  getSongList: base + '/api/getSongList'
}