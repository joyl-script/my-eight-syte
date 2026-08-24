const rows = [
  {
    row: document.getElementById('popular-container'),
    prev: document.getElementById('btn-prev-popular'),
    next: document.getElementById('btn-next-popular'),
  },
  {
    row: document.getElementById('movies-container'),
    prev: document.getElementById('btn-prev-movies'),
    next: document.getElementById('btn-next-movies'),
  },
  {
    row: document.getElementById('series-container'),
    prev: document.getElementById('btn-prev-series'),
    next: document.getElementById('btn-next-series'),
  },
  {
    row: document.getElementById('cartoons-container'),
    prev: document.getElementById('btn-prev-cartoons'),
    next: document.getElementById('btn-next-cartoons'),
  },
]

const scrollAmount = 780

rows.forEach(({ row, prev, next }) => {
  if (!row) return

  if (prev) {
    prev.addEventListener('click', () => {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    })
  }

  if (next) {
    next.addEventListener('click', () => {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    })
  }

  enableDragToScroll(row)
})

function enableDragToScroll(row) {
  let isDown = false
  let startX = 0
  let startScrollLeft = 0
  let dragged = false

  row.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return
    isDown = true
    dragged = false
    startX = e.clientX
    startScrollLeft = row.scrollLeft
  })

  window.addEventListener('pointermove', (e) => {
    if (!isDown) return
    const dx = e.clientX - startX
    if (!dragged && Math.abs(dx) > 6) {
      dragged = true
      row.classList.add('dragging')
    }
    if (dragged) {
      row.scrollLeft = startScrollLeft - dx
    }
  })

  window.addEventListener('pointerup', () => {
    if (!isDown) return
    isDown = false
    requestAnimationFrame(() => row.classList.remove('dragging'))
  })

  row.addEventListener('click', (e) => {
    if (dragged) {
      e.preventDefault()
      e.stopPropagation()
      dragged = false
    }
  }, true)
}
