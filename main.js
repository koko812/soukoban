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
                // ここで heroElement を再宣言して，スコープがバグって tick よびだしでひっかかった
                heroElement = document.createElement('div')
                heroElement.className = 'hero'
                heroElement.textContent = '🐥'
                heroElement.style.top = `calc(var(--size) * ${i})`
                heroElement.style.left = `calc(var(--size) * ${j})`
                container.appendChild(heroElement);
                heroX = j
                heroY = i
            }
        }
    }

    document.ondblclick = (e) => {
        e.preventDefault()
    }

    document.onpointerdown = (e) => {
        e.preventDefault()
        // ここの書くことが意外にわからん
        // タイルを指すのか，座標を返すのか，一体どれなんだ
        // しかもどの変数に格納すればいいんだ，heroX とかに格納するのもおかしい話
        // pointerX とか作るのか？
        // 普通に，x,y でした
        // pageX じゃなくて offsetX でした，どう違うの？
        const x = Math.trunc(e.offsetX / size)
        const y = Math.trunc(e.offsetY / size)
        // 当たり前なんだけど，先に関数名を書いて後から中身を書く感じはプロっぽくてかっこいい
        console.log(x, y);
        // css の pointer-event はマジで殺しておく必要がある
        // これで，タイルごとのタップ判定を撮ってこれるってわけ，さすがすぎ
        move(x, y)
    }
}

const canEnter = (x, y) => {
    if (map[y][x] & 1 || map[y][x] & 4) {
        return false
    }
    return true
}

const moveDirectionList = []
const move = (dx, dy) => {
    // まず何の処理を書くべきか
    // 核心部なので頑張ろう
    // 基本的に通った位置と進んだ方向みたいなのが帰ってこればおk？
    // 紀平氏のプログラムが最適なのかは判断が必要だが

    if (moveDirectionList.length) {
        return
    }

    // まず，押された場所が壁と荷物じゃないことを確認する
    // そのマップを作る（押された，というより指定された，だな）
    const emptyMap = []
    for (let y = 0; y < height; y++) {
        emptyMap[y] = []
        for (let x = 0; x < width; x++) {
            emptyMap[y][x] = canEnter(x, y)
        }
    }

    // 幅優先の初期条件
    // 今いる場所と，進む方向のリストが必要
    // 幅優先は queue を使うという強い思想が必要
    // 幅優先はまず頭を取り出す，その後・・・というところを頭に入れておけ
    // 深さ優先は stack だな
    const positionQueue = [[heroX, heroY, []]]
    // ここ 二重の配列にしておく必要あり
    // dx と dy を入れるんじゃなくて，heroX と heroY をいれろ（初期条件なのであたりまえ）
    while (positionQueue.length) {
        console.log('positions');
        // 最初から分けて取り出した方が楽
        const [tx, ty, pathlist] = positionQueue.shift()
        // canenter で判定しても意味ない
        // emptyMap を作ったのは，一度訪れた場所を記録するため
        if (!emptyMap[ty][tx]) {
            continue 
        }

        // これを入れないと，一度行った場所を何度も探索して無限ループする
        emptyMap[ty][tx]=false
        if (tx === dx && ty === dy) {
            moveDirectionList.push(...pathlist)
            return
        }
        positionQueue.push([tx + 1, ty, [...pathlist, [1, 0]]])
        positionQueue.push([tx - 1, ty, [...pathlist, [-1, 0]]])
        positionQueue.push([tx, ty + 1, [...pathlist, [0, 1]]])
        positionQueue.push([tx, ty - 1, [...pathlist, [0, -1]]])
    }
}

window.onload = () => {
    init()
    console.log(heroElement);
    const tick = () => {
        if (moveDirectionList.length) {
            console.log('moving');
            const [dx, dy] = moveDirectionList.shift()
            heroX += dx
            heroY += dy
            heroElement.style.left = `calc(var(--size)*${heroX})`
            heroElement.style.top = `calc(var(--size)*${heroY})`
        }
        requestAnimationFrame(tick)
    }
    tick()
}