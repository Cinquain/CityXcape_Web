function createBubbles() {

    const section = document.querySelector('section');
    const span = document.createElement('span')
    var size = Math.random() * 60 

    span.style.width = size + 'px'
    span.style.height = size + 'px'
    span.style.left = Math.random() * innerWidth + 'px'
    

    section.appendChild(span)

    setTimeout(() => {
        span.remove()
    }, 4000)
}


setInterval(createBubbles, 100)