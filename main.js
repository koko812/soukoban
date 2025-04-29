size = 25
width = 12
height = 12

const map = [
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 8, 1, 0, 0, 1, 1, 0],
    [1, 0, 1, 4, 0, 4, 0, 4, 0, 1, 1, 0],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
]

let heroElement = null
let heroX, heroY;

const init = () => {
    document.body.style.setProperty('--size', `${size}px`)
    const container = document.createElement('div')
    container.className = 'container'
    container.style.width = `calc(var(--size) * ${width})`
    container.style.height = `calc(var(--size) * ${height})`
    document.body.appendChild(container)

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const panel = document.createElement('div')
            panel.className = 'panel'
            panel.style.top = `calc(var(--size) * ${i})`
            panel.style.left = `calc(var(--size) * ${j})`
            // 何回も書くのがめんどくさそうなものは，変数化しておこう
            data = map[i][j]
            panel.style.backgroundColor = (data & 1) ? '#f80' : (data & 2) ? '#cc0' : '#000'
            container.appendChild(panel)

            if (data & 4) {
                const lugguage = document.createElement('div')
                lugguage.className = 'lugguage'
                lugguage.textContent = '📦' 
                lugguage.style.top = `calc(var(--size) * ${i})`
                lugguage.style.left = `calc(var(--size) * ${j})`
                container.appendChild(lugguage)
            }

            if (data & 8) {
                const lugguage = document.createElement('div')
                lugguage.className = 'hero'
                lugguage.textContent = '🐥' 
                lugguage.style.top = `calc(var(--size) * ${i})`
                lugguage.style.left = `calc(var(--size) * ${j})`
                container.appendChild(lugguage)
            }
        }
    }
}

window.onload = () => {
    init()
}