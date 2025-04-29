size = 25
width = 12
height = 12

const init = () => {
    document.body.style.setProperty('--size', `${size}px`)
    const container = document.createElement('div')
    container.className = 'container'
    container.style.width = `calc(var(--size) * ${width})`
    container.style.height = `calc(var(--size) * ${height})`
    document.body.appendChild(container)

}

window.onload = () => {
    init()
}