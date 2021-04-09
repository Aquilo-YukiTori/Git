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
// ------

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
// ------

// 代理模式
// 为一个对象提供一个代用品或占位符，以便控制对他的访问
//   保护代理：根据条件过滤请求
//   虚拟代理：为对象提供代用品，在使用者无区别体验的前提下，对请求进行处理，如延迟处理开销大的操作，或缓存结果等

// 本体
let sourceItem = {
  inputMessage: function (para1) {
    // input message
  }
}

// 代理者
let agent = {
  inputMessage: function (para1) {
    // do something before
    sourceItem.inputMessage(para1)
  }
}

agent.inputMessage('123')

// 代理对象和本体都显式的实现同一个接口，代理对象和本体可以替换使用
// 具体情境
//   加载图片占位
//   合并请求
//   缓存数据
//   ...
// ------

// 迭代器模式
// 提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
// 现代语言一般已经内置实现