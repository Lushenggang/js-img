
import Preview from '../preview'

import './style.styl'

const preview = new Preview({
  el: '#container',
})

let btn1 = document.querySelector('.btn1')
let btn2 = document.querySelector('.btn2')
let btn3 = document.querySelector('.btn3')
let btn4 = document.querySelector('.btn4')
let timer

btn1.onmousedown = () => {
  preview.scale(true)
  timer = setInterval(() => {
    preview.scale(true)
  }, 20)
}

btn2.onmousedown = () => {
  preview.scale(false)
  timer = setInterval(() => {
    preview.scale(false)
  }, 20)
}

let func = () => {
  console.log('clear')
  clearInterval(timer)
}

btn1.onmouseup = func
btn1.onmouseleave = func
btn2.onmouseleave = func
btn2.onmouseup = func

