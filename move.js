let oDiv = document.createElement('div')
oDiv.id = "map"
oDiv.style.width = '500px'
oDiv.style.height = '500px'
oDiv.style.display = 'flex'
oDiv.style.flexWrap = 'wrap'
oDiv.style.marginBottom = '20px'
oDiv.style.backgroundColor = "aquamarine"

let oman = document.createElement("div")
oman.id = "man"
oman.style.width = '5px'
oman.style.height = '5px'
oman.style.backgroundColor = 'brown'
oman.style.position = 'absolute'
oman.style.top = '10px'
oman.style.left = '10px'
oDiv.appendChild(oman)
document.body.appendChild(oDiv)

var body = document.getElementById("man")
document.onkeydown = keydown

function keydown(ev) {
    let event = window.event || ev
    switch (event.keyCode) {
        case 65: //a
            body.style.left = body.offsetLeft - 20 + "px"
            break
        case 68: //d
            body.style.left = body.offsetLeft + 20 + "px"
            break
        case 83: //s
            body.style.top = body.offsetTop + 20 + "px"
            break
        case 87: //w
            body.style.top = body.offsetTop - 20 + "px"
            break
        default:
            break;
    }
}