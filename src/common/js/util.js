// 洗牌函数
export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRndomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function getRndomInt (min, max) {
  // Math.random()，返回0~1之间的随机数
  // 加1保证可以取到上限的值
  // Math.random() * (max - min + 1) 取到 max-min中间的一个数，加min,就在max和min之间
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 节流海曙
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      /**
       * func绑定到this
       * 这时候this具备了func的属性和方法。
       */
      func.apply(this, args) // 此时args 被... 扩展成为一个数组
    }, delay)
  }
}
