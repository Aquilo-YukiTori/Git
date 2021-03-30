function ajax () {
  let xmlhttp
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
  }

  xmlhttp.open('GET', 'test1.txt', true)
  xmlhttp.send()
}



function multiRequest (urls, maxNum) {
  let resObj = {},
  index = 0
  function callback (res, i) {
    resObj[i] = res
    if (Object.prototype.toString.call(res).indexOf('Error') !== -1) {
      resObj[i].status = false
    } else {
      resObj[i].status = true
    }
    if (index === urls.length) {
      return
    }
    makePromise(index++)
  }
  function makePromise (index) {
    new Promise((resolve, reject) => {
      let item = urls[index]
      let params = item.type === 'GET' ? {params: item.params} : item.params
      axios[item.type](item.url, params).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    }).then((res) => {
      callback(res, index)
    }).catch((err) => {
      callback(err, index)
    })
  }
  for (; index < maxNum; index++) {
    makePromise(index)
  }
}

function multiRequest1 (urls = [], maxNum) {
  let resObj = [],
  statArr = new Array(urls.length).fill('wait'),
  index = 0
  new Promise((resolve, reject) => {
    function makePromise () {
      if (i >= urls.length) {
        !statArr.includes('wait') && resolve()
        return
      }
      let i = index++
      let item = urls[i]
      let params = item.type === 'GET' ? {params: item.params} : item.params
      axios[item.type](item.url, params).then((res) => {
        resObj[i] = res
        statArr[i] = true
        makePromise()
      }).catch((err) => {
        resObj[i] = err
        statArr[i] = false
      })
    }
  }).then((res) => {
    console.log(statArr)
  }).catch((err) => {})

  while (index < maxNum) {
    makePromise()
  }
}


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

11233