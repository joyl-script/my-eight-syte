const overlay = document.getElementById('overlay')
const modalLogin = document.getElementById('modal-login')
const closeLogin = document.getElementById('closeLogin')
const openLoginBtn = document.getElementById('btn-login')
const modalSign = document.getElementById('modal-sign')
const openSignBtn = document.getElementById('btn-sign')
const closeSign = document.getElementById('closeSign')

const openModalLogin = () => {
  modalLogin.classList.add('active')
  overlay.classList.add('active')
}

const closeModalLogin = () => {
  modalLogin.classList.remove('active')
  overlay.classList.remove('active')
}

openLoginBtn.addEventListener('click', openModalLogin)
closeLogin.addEventListener('click', closeModalLogin)
overlay.addEventListener('click', closeModalLogin)

modalLogin.addEventListener('click', (event) => {
  event.stopPropagation()
})

const openModalSign = () => {
  modalSign.classList.add('active')
  overlay.classList.add('active')
}

const closeModalSign = () => {
  modalSign.classList.remove('active')
  overlay.classList.remove('active')
}

openSignBtn.addEventListener('click', openModalSign)
closeSign.addEventListener('click', closeModalSign)
overlay.addEventListener('click', closeModalSign)

modalSign.addEventListener('click', (item) => {
  item.stopPropagation()
})


const login = document.getElementById('login')
const sign = document.getElementById('sign')

login.addEventListener('click', () => {
  window.location.href = 'main.html'
})

sign.addEventListener('click', () => {
  window.location.href = 'main.html'
})
