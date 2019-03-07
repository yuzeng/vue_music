import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 每一个存储都要定义个一个key
const SEARCH_MAX_LENGTH = 15

// 封装插入数组的方法
function insertArray (arr, val, compare, maxLen) { // (存储的数组，存储的值，比较函数：用来比较插入的值是否存在于当前数组，最大值)
  const index = arr.findIndex(compare) // 查找当前数组是否有某一个元素
  if (index === 0) {
    return // 如果已经有，并且是第一个，什么都不做
  }
  if (index > 0) {
    arr.splice(index, 1) // 如果有，不是第一个，先删除
  }
  arr.unshift(val) // 然后在数组最前面去插入这个值
  if (maxLen && arr.length > maxLen) {
    arr.pop() // 如果len大于最大值的话，就删除最后一个值
  }
}

// 封装删除数组的方法
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/**
 *操作和localStorage相关的一些逻辑
 *保存搜索结果
 */
export function saveSearch (query) {
  // 第一个参数key 第二个默认值
  let searches = storage.get(SEARCH_KEY, []) // 查看当前存储空间的情况，如果没有，就是一个空数组
  insertArray(searches, query, (item) => {
    return item === query // searches里面的每一条(item)和query比较
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches) // 设置storage
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, []) // 取storage
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, item => {
    return item === query
  })
  // 调用deleteFromArray方法后，数组改变，所以要设置缓存
  storage.set(SEARCH_KEY, searches) // 设置storage
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
