export default class Preview {
  constructor (options) {
    let {
      width = '300px',
      height = '300px',
      accept
    } = options
    if (options.el instanceof HTMLElement) {
      this.el = options.el
    } else {
      this.el = document.querySelector(options.el)
    }
    if (this.el) {
      this.el.style.width = width
      this.el.style.height = height
      this.accept = accept
      this.addEventListener()
      this.img = null
      this.insertImage()
    }
  }

  addEventListener () {
    this.el._clickFunc = () => {
      if (this.img) return
      this.chooseImage()
    }
    this.el._mdFunc = (event) => {
      console.log('mousedown')
      event.stopPropagation()
      this.dragX = event.clientX
      this.dragY = event.clientY
      let imgRect = this.img.getBoundingClientRect()
      let rect = this.el.getBoundingClientRect()
      this.dragLeft = imgRect.left - rect.left
      this.dragTop = imgRect.top - rect.top
      document.addEventListener('mouseleave', this.el._mlFunc)
      document.addEventListener('mouseup', this.el._muFunc)
      document.addEventListener('mousemove', this.el._moFunc)
    }
    this.el._mlFunc = () => {
      removeListener()
    }
    this.el._muFunc = () => {
      removeListener()
    }
    this.el._moFunc = (event) => {
      console.log('this.el._moFunc')
      let deltaX = event.clientX - this.dragX
      let deltaY = event.clientY - this.dragY
      let left = this.dragLeft + deltaX
      let top = this.dragTop + deltaY

      this.img.style.left = `${left}px`
      this.img.style.top = `${top}px`
    }
    let removeListener = () => {
      document.removeEventListener('mouseup', this.el._muFunc)
      document.removeEventListener('mousemove', this.el._moFunc)
      document.removeEventListener('mouseleave', this.el._mlFunc)
    }

    this.el.addEventListener('click', this.el._clickFunc)
    this.el.addEventListener('mousedown', this.el._mdFunc)
  }

  removeEventListener () {
    this.el.removeEventListener('click', this.chooseImage)
  }



  newImage () {
    if (this.img) return
    let dom = document.createElement('div')
    this.el.appendChild(dom)
    dom.style.width = '100%'
    dom.style.height = '100%'
    dom.style.position = 'relative'

    this.img = new Image()
    this.img.onload = () => { this.setImageSize() }
    this.img.setAttribute('draggable', false)
    dom.appendChild(this.img)
    this.img.style.position = 'absolute'
  }

  insertImage () {
    this.newImage()
    this.img.src = 'http://file.wintc.top/7a21183ae1a8496d91096be580e55cd6'
  }

  setImageSize () {
    let rect = this.el.getBoundingClientRect()
    let rw = this.img.width / rect.width
    let rh = this.img.height / rect.height
    if (rw <= 1 && rh <= 1) return
    if (rw > rh) {
      this.img.style.width = '100%'
      this.img.style.height = 'auto'
    } else {
      this.img.style.width = 'auto'
      this.img.style.height = '100%'
    }
  }

/* 一下为对外接口　*/
  
  chooseImage () {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.onchange = () => {
      let reader = new FileReader()
      reader.onload = (e) => {
        this.newImage()
        this.img.src = e.target.result
      }
      reader.readAsDataURL(input.files[0])
    }
    input.click()
  }

  scale (shrink, ratio = 0.01) {
    console.log('scale')
    if (ratio <= 0 || ratio >= 1) return
    shrink = !shrink ? -1 : 1
    ratio = ratio * shrink + 1
    let imgRect = this.img.getBoundingClientRect()

    let w = imgRect.width * ratio
    let h = imgRect.height * ratio
    if (w <= 10 || h <= 10) return

    this.img.style.width = `${w}px`
    this.img.style.height = `${h}px`
  }

  clip () {
    if (!this.img) return null
    let rect = this.el.getBoundingClientRect()
    let imgRect = this.img.getBoundingClientRect()
    let canvas = document.createElement('canvas')
    
    let left = Math.max(rect.left, imgRect.left)
    let right = Math.min(rect.right, imgRect.right)
    let top = Math.max(rect.top, imgRect.top)
    let bottom = Math.min(rect.bottom, imgRect.bottom)
    
    let h = bottom - top
    let w = right - left
    if (h < 0 || w < 0) return null
    
    let ratioX = w / imgRect.width 
    let ratioY = h / imgRect.height

    canvas.width = this.img.width * ratioX
    canvas.height = this.img.width * ratioY
    let ctx = canvas.getContext('2d')

    // let sx, sy, dx, dy
    // if (left != imgRect.left) {
    //   sx = this.img.width * left  left
    // }
    ctx.drawImage(this.img, 0, 0)
  }

}