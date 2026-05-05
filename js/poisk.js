const btnPoisk = document.querySelector('.btn-poisk')
const formPoisk = document.getElementById('form-poisk')

btnPoisk.addEventListener("click", () => {
  if (formPoisk.style.display === 'none') {
    formPoisk.style.display = 'block'
  } else {
    formPoisk.style.display = 'none'
  }
})