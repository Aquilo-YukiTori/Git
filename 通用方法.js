// 分时函数
function timeChunk (ary, fn, count, interval) {
  let arr = ary,
      timer
  

  function start () {
    for (let i = 0, l = Math.min(count || 0, arr.length); i < l; i++) {
      fn(arr.shift())
    }
  }

  timer = window.setInterval(() => {
    if (arr.length === 0) {
      return window.clearInterval(timer)
    }
    start()
  }, interval)
}

// 防抖函数
function debounce (fn, timeout) {
  let timer = 0

  function start () {
    fn()
    timer = 0
  }
  if (timer !== 0) {
    window.clearTimeout(timer)
  }
  timer = window.setTimeout(() => {
    start()
  }, timeout);
}

// 节流函数
function throttle (fn, timeout) {
  let ifStart = false

  function start () {
    fn()
    ifStart = false
  }

  if (ifStart) {
    return
  }
  ifStart = true
  window.setTimeout(() => {
    start()
  }, timeout);
}

function throttle2 (fn, timeout) {
  let _self = fn,
  timer,
  firstTime = true

  return function () {
    let args = arguments,
    _me = this

    if (firstTime) {
      _self.apply(_me, args)
      return firstTime = false
    }

    if (timer) {
      return false
    }

    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      _self.apply(_me, args)
    }, timeout || 500)
  }
}

// 单例模式
// 保证一个类仅有一个实例·，并提供一个访问它的全局访问点

let getSingle = function (fn) {
  let result

  return function () {
    return result || ( result = fn.apply(this, arguments) )
  }
}

var doSomethingWithSingleMode = getSingle(function () {
  // do something
})

// 策略模式
// 定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换

// 策略类
let strategies = {
  strategyA: function () {},
  strategyB: function () {},
  strategyC: function () {},
}
// 环境类
let context = function (strategy, p1, p2) {
  return strategies[strategy](p1, p2)
}