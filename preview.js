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
      this.clickContainer = this._clickContainer.bind(this)
      this.addEventListener()
      this.img = null
      this.insertImage()
    }
  }

  addEventListener () {
    this.el.addEventListener('click', this.clickContainer)
  }

  removeEventListener () {
    this.el.removeEventListener('click', this.clickContainer)
  }

  _clickContainer (event) {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.onchange = () => {
      let reader = new FileReader()
      reader.onload = (e) => {
        this.img = new Image()
        this.img.src = e.target.result
        this.img.onload = () => { this.setImageSize() }
        this.el.appendChild(this.img)
      }
      reader.readAsDataURL(input.files[0])
    }
    input.click()
  }

  insertImage () {
    this.img = new Image()
    this.img.src = 'http://file.wintc.top/7a21183ae1a8496d91096be580e55cd6'
    this.img.onload = () => { this.setImageSize() }
    this.el.appendChild(this.img)
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
    this.img.style.position = 'relative'
  }

  scale (shrink, ratio = 0.01) {
    console.log('scale')
    if (ratio <= 0 || ratio >= 1) return
    shrink = !shrink ? -1 : 1
    ratio = ratio * shrink + 1
    let rect = this.el.getBoundingClientRect()
    let imgRect = this.img.getBoundingClientRect()
    let oldLeft = imgRect.left - rect.left
    let oldTop = imgRect.top - rect.top
    let w = imgRect.width * ratio
    let h = imgRect.height * ratio
    if (w <= 5 || h <= 5) return
    let detaX = w - imgRect.width
    let detaY = h - imgRect.height

    let centerX = rect.left + rect.width / 2
    let centerY = rect.top + rect.height / 2
    let ratioX = (centerX - imgRect.left) / imgRect.width
    let ratioY = (centerY - imgRect.top) / imgRect.height


    this.img.style.width = `${w}px`
    this.img.style.height = `${h}px`
    let left = centerX - (w * ratioX + imgRect.left)
    let top = centerY - (h * ratioY + imgRect.top)
    this.img.style.left = `${oldLeft - detaX / 2}px`
    this.img.style.top = `${oldTop - detaY / 2}px`
  }
}