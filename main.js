size = 25
width = 12
height = 12

const map = [
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 4, 0, 4, 0, 4, 0, 0, 1, 0],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
]

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
            panel.style.width = `calc(var(--size))`
            panel.style.height = `calc(var(--size))`
            panel.style.backgroundColor = (map[i][j] & 1) ? '#f80' : (map[i][j] & 2) ? '#cc0': '#000'
            panel.textContent = (map[i][j] & 4) ? '📦' : (map[i][j] & 8) ? '🐥' : ''
            panel.style.fontSize = `calc(var(--size)*${0.8})`
            container.appendChild(panel)
        }
    }
}

window.onload = () => {
    init()
}