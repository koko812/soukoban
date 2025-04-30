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

const canEnter = (x, y) => {
    if (map[y][x] & 1 || map[y][x] & 4) {
        return false
    }
    return true
}

const moveDirectionList = []
// これの位置を init の後にするか手前にするか問題があるんだが
// t-kihira はどのプログラムでも一貫して，init は onload の手前においてる
// で，最初は init の後に僕は置いてたんだが，やっぱり，onload と init は
// 近い方がいじりやすい感じがしたので，配置転換した
// onload で init の変数を使うことが多い（onpointerdown) ので，
// そっちの方が都合がいいような気がしてきた
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
        emptyMap[ty][tx] = false
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

let lugguageList = []
const push = (x, y) => {
    // なぜか壁に反応している？
    console.log('push!a');
    if (moveDirectionList.length) {
        // 動いてる途中の時は無視
        console.log('mdl_filled');
        return
    }
    if (canEnter(x, y)) {
        console.log('enter');
        // この return はなくても動く？
        // まあでも，ここで関数を止める必要があるのか？いやいらなくね？
        // いや，lugguage がない場合の処理なので必要だなこれ
        return move(x, y)
    }
    console.log('push!');
    for (const lugguage of lugguageList) {
        const lx = lugguage.x
        const ly = lugguage.y
        console.log('l', lx, ly, x, y);
        // こいつは変更するつもりなんだが，const でいいのか？
        // どうやらいいっぽい？？まあ中身の style をいじるだけなので気にしなくていいんだろう
        const element = lugguage.element
        // もし動こうとする位置が lugguage と同じならば，lugguage ごと動かしたい
        // lugguage のスペルミスが判明，luggage でした
        if (lx === x && ly === y) {
            // 動かす先の位置を定める
            dx = lx - heroX
            dy = ly - heroY
            tx = lx + dx
            ty = ly + dy


            // 動かす先が空いてるかを確認
            if (canEnter(tx, ty)) {
                // 荷物を今の位置から消す
                // 荷物を目的に動かす
                // 荷物のリストを更新する
                // ひよこを動かす
                map[ty][tx] |= 4
                // この xor 演算マジで天才すぎるでしょ
                map[ly][lx] ^= 4

                console.log('push!');

                element.style.top = `calc(var(--size) * ${ty})`
                element.style.left = `calc(var(--size) * ${tx})`

                // lagguageList の更新ってどうやるんだ・・・？
                // 別に更新しなくていいっぽい，普通に directionList をこうしんしたらいいだけっぽい
                // 嘘でしたここで更新してました
                lugguage.x = tx
                lugguage.y = ty

                // それ (pushDirectionList) を更新したらなんかいい感じに動くというのは，これ結構謎なんだけど
                // まあ move のところで一緒に処理されるというのはなんとなくわかるんだけど
                // じゃあ ^ はなんで move を使ってるのかという話が存在するような気がする

                // ここの push はあくまで direction なので，dx と dy を追加するだけ
                moveDirectionList.push([dx, dy])
                return
            }
        }
    }
}

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
                // 辞書に push する時は，キーの値を省略すると，変数名：値の形で格納されるっぽい
                // 前の何かで出てきた（tetoris or ブロック崩し）の疑問の解決
                lugguageList.push({ x: j, y: i, element: lugguage })
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

    let isDown = false
    // container の n がやたらと抜けがち
    // これを container にするか，document にするかで何か違いはあるんだろうか
    container.onpointerdown = (e) => {
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

        isDown = true
    }

    document.onpointerup = (e) => {
        isDown = false
    }

    container.onpointermove = (e) => {
        // こいつ忘れてた（が必要なのかはわからん）
        e.preventDefault()
        if (isDown) {
            const x = Math.trunc(e.offsetX / size)
            const y = Math.trunc(e.offsetY / size)
            // 本当にこれでドラッグを検知できるのか？という感じあり
            // 押されてる時，さらにpointer が動いた時のみ発動して，position をとってくる
            // これだと，ひよこをドラッグしなくても，隣接マスをテキトーにドラッグしても良さげ？？
            if (Math.abs(x - heroX) + Math.abs(y - heroY) === 1) {
                push(x, y)
            }
        }
    }

    //箱を押す動作を定義していく
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