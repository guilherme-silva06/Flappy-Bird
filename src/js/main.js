function createElement(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false){
    this.element = createElement('div', 'barrier')

    const border = createElement('div','barrier_border')
    const body = createElement('div','barrier_body')

    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}


function CreateBarriers(height, opening, x){
    this.element = createElement('div','barriers')

    this.superior = new Barrier(true)
    this.inferior = new Barrier(false)

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.randomOpening = () =>{
        const superiorHeight = Math.random() * (height - opening)
        const inferiorHeight = height - opening - superiorHeight
        this.superior.setHeight(superiorHeight)
        this.inferior.setHeight(inferiorHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.randomOpening()
    this.setX(x)
}

function Barriers(height, width, opening, space_between, point){
    this.pairs=[
        new CreateBarriers(height, opening, width),
        new CreateBarriers(height, opening, width + space_between),
        new CreateBarriers(height, opening, width+ space_between*2),
        new CreateBarriers(height, opening, width+ space_between*3)
    ]
    const moving = 4
    this.animate = () =>{
        this.pairs.forEach(pair =>{
            pair.setX(pair.getX() - moving)

            if (pair.getX() < -pair.getWidth()){
                pair.setX(pair.getX() + space_between * this.pairs.length)
                pair.randomOpening()
            }
            const mid = width / 2
            const crossedMiddle = pair.getX() + moving >= mid
                && pair.getX() < mid
            if (crossedMiddle) point()

        })
    }
}

function Bird(gameHeight){
    let flying = true
    this.element = createElement('img', 'bird')
    this.element.src = 'src/images/bird.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying=true
    window.onkeyup = e => flying=false

    this.animate = () =>{
        const newY = this.getY() + (flying ? 8: -5)
        const maxHeight = gameHeight - this.element.clientHeight

        if (newY <= 0){
            this.setY(0)
        } else if (newY >=maxHeight){
            this.setY(maxHeight)
        } else{
            this.setY(newY)
        }
    }
    this.setY(gameHeight/2)
}


function Progress(){
    this.element = createElement('span', 'progress')
    this.point = points =>{
        this.element.innerHTML = points
    }
    this.point(0)
}

function superposition(elementA, elementB){
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >=a.left
    const vertical = a.top + a.height >=b.top && b.top + b.height >=a.top
    return horizontal && vertical
}
function Colision(bird, barriers){
    let colision = false
    barriers.pairs.forEach(pairOfBarriers =>{
        if (!colision){
            const superior = pairOfBarriers.superior.element
            const inferior = pairOfBarriers.inferior.element

            colision = superposition(bird.element, superior) || superposition(bird.element,inferior)

        }
    })
    return colision
}


function FlappyBird(){
    let points = 0

    const gameArea = document.querySelector('[flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers (height, width, 200, 400, 
        () => progress.point(++points))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () =>{
        const timer = setInterval(() =>{
            barriers.animate()
            bird.animate()

            if (Colision(bird,barriers)) {
                clearInterval(timer)
            }
        },20)
    }
}

new FlappyBird().start()

// const barr = new Barriers(600, 1000, 300, 400)
// const bird = new Bird(520)

// const area = document.querySelector('[flappy')

// area.appendChild(bird.element)
// area.appendChild(new Progress().element)
// barr.pairs.forEach(pair => area.appendChild(pair.element))
// setInterval(() =>{
//     barr.animate()
//     bird.animate()
// },20)