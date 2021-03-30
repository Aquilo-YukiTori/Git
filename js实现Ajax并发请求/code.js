// 我的解决方案
//   resobj保存详细结果，statArr保存每个请求的状态
function multiRequest (urls = [], maxNum) {
  let resObj = [],
  statArr = new Array(urls.length).fill('wait'),
  index = 0
  // 用一个总体的Promise来控制流程
  new Promise((resolve, reject) => {
    function makePromise () {
      // 在无剩余待执行的情况下处理并行的结果
      if (index >= urls.length) {
        // 在所有请求都结束后
        !statArr.includes('wait') && resolve()
        return
      }
      let i = index++
      let item = urls[i]
      // params适配axios的GET和POST的格式
      let params = item.type === 'GET' ? {params: item.params} : item.params
      axios[item.type](item.url, params).then((res) => {
        resObj[i] = res
        statArr[i] = true
        // 请求成功后新增新的请求
        makePromise()
      }).catch((err) => {
        resObj[i] = err
        statArr[i] = false
      })
    }
  }).then((res) => {
    console.log(statArr)
  }).catch((err) => {})

  // 达到并行最大数量
  while (index < maxNum) {
    makePromise()
  }
}

// 数据结构
urls = [
  {
    type: 'GET',
    url: 'xxxxx/xxxxx',
    params: {
      x1: 1,
      x2: 2
    }
  },
  {
    type: 'POST',
    url: 'xxxx/xxxxx',
    params: {}
  }
]




// ---------------------
// 第三方包async-pool实现并发限制的源码
//   (充分的利用了promise的机制
function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0;
  // ret保存promise实例
  const ret = [];
  // executing保存pending状态的promise实例的then方法返回的promise实例
  const executing = [];
  const enqueue = function () {
      if (i === array.length) {
          return Promise.resolve();
      }
      const item = array[i++];
      const p = Promise.resolve().then(() => iteratorFn(item, array));
      ret.push(p);
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      let r = Promise.resolve();
      if (executing.length >= poolLimit) {
          r = Promise.race(executing);
      }
      return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}

//使用方法
const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
return asyncPool(2, [1000, 5000, 3000, 2000], timeout).then(results => {
  // ...
});


// 重复调用enqueue函数初始化多个请求，达到最大并行数
// 将请求本身的promise存放在ret里，将请求的then方法的promise存放在executing里
// 请求成功后触发then，在executing中删除自己并使自己改变状态，从而触发promise.race改变状态，触发其then，重新调用enqueue函数
// 无新请求可创建时，enqueue函数直接返回，改变自身的状态，触发then，用promise.all返回全部结果

// 一些细节，增加理解：
// promise.race的参数是executing数组，但他绑定的是数组中的promise实例，所以即使这些实例在改变状态前就把自己从executing中删除了，也不影响race监听
//   (promise改变状态的时间点 在显式调用resolve或reject或return时)
// promise.all的作用在于在触发时，已经没有待新增的请求，但还可能有未处理完毕的请求，all会等待所有请求处理完毕后再改变状态