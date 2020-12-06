function red() {
  console.log('red',Date.parse(new Date()))
}
function green() {
  console.log('green',Date.parse(new Date()))
}
function yellow() {
  console.log('yellow',Date.parse(new Date()))
}

function light (cb, time) {
  return new Promise(resolve => {
    setTimeout(()=> {
      cb();
      resolve()
    }, time)
  })
}

//绿黄红 绿黄红循环
function cycleLight() {
  Promise.all([
    light(red, 3000),
    light(green, 1000),
    light(yellow, 2000)
  ]).then(() => {
    cycleLight()
  })
}

// 绿 绿黄 绿红 绿黄 绿 绿黄红 循环
function cycleLight1() {
  function lightGreen () {
    light(green, 1000).then(() => {
      lightGreen()
    })
  }

  function lightYellow () {
    light(yellow, 2000).then(() => {
      lightYellow()
    })
  }

  function lightRed () {
    light(red, 3000).then(() => {
      lightRed()
    })
  }
  lightGreen()
  lightYellow()
  lightRed()
}

cycleLight1()

