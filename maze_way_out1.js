class Queue {
    constructor() {
        this.queue = []
    }
    push(pos) {
        if (Math.random() < 0.5) {
            this.queue.push(pos)
        } else {
            this.queue.unshift(pos)
        }
    }
    pop() {
        if (Math.random() < 0.5) {
            return this.queue.pop()
        } else {
            return this.queue.shift()
        }
    }
    empty() {
        return !this.queue.length
    }
}

// 自动生成迷宫
class Maze {
    constructor(row, col, paintProgressTime, width = 500, height = 500) {
        // 类名
        this.class = Math.random().toFixed(2)
            // Maze行列
        this.row = row
        this.col = col
            // 迷宫的长宽
        this.width = width
        this.height = height
            // 设置路与墙
        this.road = ' '
        this.wall = '#'
            // 入口坐标（1, 0）
        this.ex = 1
        this.ey = 0
            // 出口坐标（倒数第二行， 最后一列）
        this.outX = row - 2
        this.outY = col - 1
            // 迷宫数据
        this.maze = []
            // 生成迷宫时各节点的遍历情况
        this.visited = []
            // 求解迷宫时各节点的遍历情况
        this.pathVisited = []
            // 设置上下左右的偏移坐标值（上右下左）
        this.offset = [
                [-1, 0],
                [0, 1],
                [1, 0],
                [0, -1]
            ]
            // 迷宫是否生成完成
        this.signalOne = false
            // 可视化展示间隔
        this.paintProgressTime = paintProgressTime
        this.viewPath = 0 // 可视化展示索引
        this.viewindex = 0
    }

    // 初始化迷宫数据
    initData() {
            for (let i = 0; i < this.row; i++) {
                this.maze[i] = new Array(this.col).fill(this.wall) //  初始化二维数组
                this.visited[i] = new Array(this.col).fill(false) // 初始化访问状态为false
                this.pathVisited[i] = new Array(this.col).fill(false) // 初始化访问状态为false

                for (let j = 0; j < this.col; j++) {
                    // 横纵坐标均为奇数 则是路
                    if (i % 2 === 1 && j % 2 === 1) {
                        this.maze[i][j] = this.road
                    }
                }
            }
            // 入口及出口 则是路
            this.maze[this.ex][this.ey] = this.road
            this.maze[this.outX][this.outY] = this.road
        }
        // 初始化迷宫DOM
    initDOM(maze) {
        let oDiv = document.createElement('div')
        oDiv.id = "map"
        oDiv.style.width = this.width + 'px'
        oDiv.style.height = this.height + 'px'
        oDiv.style.display = 'flex'
        oDiv.style.flexWrap = 'wrap'
        oDiv.style.marginBottom = '20px'
        for (let i = 0; i < this.maze.length; i++) {
            for (let j = 0; j < this.maze[i].length; j++) {
                let oSpan = document.createElement('span')
                oSpan.dataset.index = i + '-' + j + '-' + this.class
                oSpan.style.width = (this.width / this.col).toFixed(2) + 'px'
                oSpan.style.height = (this.height / this.row).toFixed(2) + 'px'
                    // 加边框
                    // oSpan.style.border = '1px solid #ccc'
                    // oSpan.style.boxSizing = 'border-box'
                oSpan.style.background = this.maze[i][j] === this.wall ? '#f08080' : '#fff'
                oDiv.appendChild(oSpan)
            }
        }
        //造小人
        let oman = document.createElement("div")
        oman.id = "man"
        oman.style.width = ((this.width / this.col) - 3).toFixed(2) + 'px'
        oman.style.height = ((this.height / this.row) - 3).toFixed(2) + 'px'
        oman.style.backgroundColor = 'brown'
        oman.style.position = 'absolute'
        oman.style.top = '25px'
        oman.style.left = '8px'
        oDiv.appendChild(oman)
        document.body.appendChild(oDiv)
    }

    // 初始化迷宫
    initMaze() {
        // 迷宫数据
        this.initData()
            // 初始迷宫DOM
        this.initDOM()
    }
    resetMazeShow(x, y, type) {
            if (!this.paintProgressTime) {
                this.resetMaze(x, y, type)
                return
            }
            this.viewindex++ //可视化展示
                setTimeout(() => {
                    this.resetMaze(x, y, type)
                }, this.viewindex * this.paintProgressTime);
        }
        // 重新渲染迷宫 改变的格子坐标为（i, j）
    resetMaze(x, y, type) {
        // 只有不越界的点才做后续处理
        if (this.isArea(x, y)) {
            // 改变逻辑迷宫
            this.maze[x][y] = type
                // 改变显示迷宫
            let changeSpan = document.querySelector(`span[data-index='${x}-${y}-${this.class}']`)
            changeSpan.style.background = type === this.wall ? '#f08080' : '#fff'
        }
    }

    // 渲染迷宫
    paintMaze() {
        this.initMaze()

        let queue = new Queue()
        queue.push({ x: this.ex, y: this.ey + 1 })
        this.visited[this.ex][this.ey + 1] = true

        while (!queue.empty()) {
            let curPos = queue.pop()
            for (let i = 0; i < 4; i++) {
                let newX = curPos.x + this.offset[i][0] * 2 // 两步是 *2
                let newY = curPos.y + this.offset[i][1] * 2
                    // 坐标没有越界 而且 没有被访问过
                if (this.isArea(newX, newY)) {
                    if (!this.visited[newX][newY]) {
                        this.resetMaze((newX + curPos.x) / 2, (newY + curPos.y) / 2, this.road) // 打通两个方块之间的墙
                        queue.push({ x: newX, y: newY })
                        this.visited[newX][newY] = true
                    } else if (Math.random() < 0.03) {
                        this.resetMaze((newX + curPos.x) / 2, (newY + curPos.y) / 2, this.road)
                    }
                }
            }
        }
        this.signalOne = true
        return this
    }

    // 判断坐标是否越界
    isArea(x, y) {
            return x > 0 && x < this.row - 1 && y > 0 && y < this.col - 1 || x == this.ex && y == this.ey || x == this.outX && y == this.outY
        }
        //手动走迷宫
    walk(x, y) {

        }
        // 迷宫自动求解
    findPath() {
            while (!this.signalOne) {}
            if (!this.seeker(this.ex, this.ey)) throw new Error('迷宫无解！')
        }
        // 递归遍历 渲染迷宫求解路径
    seeker(x, y) {
            if (this.isArea(x, y)) {
                this.findPathReset(x, y, '#ff0')
                if (x == this.outX && y == this.outY) return true // 已找到出口 递归终止

                // 遍历该点的四个方向是否可继续遍历
                for (let i = 0; i < 4; i++) {
                    let newX = x + this.offset[i][0]
                    let newY = y + this.offset[i][1]
                    if (!this.isArea(newX, newY) || this.maze[newX][newY] === this.wall || this.pathVisited[newX][newY])
                        continue
                    this.pathVisited[newX][newY] = true
                    this.findPathReset(newX, newY)
                    let flag = this.seeker(newX, newY)

                    if (flag)
                        return true
                    this.findPathReset(newX, newY, '#fff')
                }
                // 回溯 遍历完四个方向的点均没有找到出口 则表示该点不是解的路径上的点 变回路的颜色
                this.findPathReset(x, y, '#fff')
                return false
            }
        }
        // 渲染迷宫指定位置
    findPathReset(x, y, color = '#2f4f4f') {
        if (!this.paintProgressTime) {
            this.findPathSpan(x, y, color)
            return
        }
        this.viewindex++ // 可视化展示
            setTimeout(() => { // 可视化展示
                this.findPathSpan(x, y, color)
            }, this.viewindex * this.paintProgressTime);
    }
    findPathSpan(x, y, color) {
        // 只有不越界的点才做后续处理
        if (this.isArea(x, y)) {
            // 改变dom中对应的节点颜色
            let changeSpan = document.querySelector(`span[data-index='${x}-${y}-${this.class}']`)
            changeSpan.style.background = color
        }
    }
}


let mazeee = new Maze(45, 45, 10, 675, 675).paintMaze()
mazeee.findPath()
let body = document.getElementById("man")
x = 1
y = 0
document.onkeydown = function(ev) {
    console.log(x, y)
    let event = window.event || ev
    switch (event.keyCode) {
        case 65: //a
            newx = x + mazeee.offset[3][0]
            newy = y + mazeee.offset[3][1]
            if (mazeee.isArea(newx, newy) && mazeee.maze[newx][newy] === mazeee.road) {
                //body.style.left = body.offsetLeft - (mazeee.width / mazeee.col).toFixed(2) + "px"
                body.style.left = body.offsetLeft - 15 + "px"
                x = x + mazeee.offset[3][0]
                y = y + mazeee.offset[3][1]
            } else
                alert('No way')


            break
        case 68: //d
            newx = x + mazeee.offset[1][0]
            newy = y + mazeee.offset[1][1]
            if (mazeee.isArea(newx, newy) && mazeee.maze[newx][newy] === mazeee.road) {
                body.style.left = body.offsetLeft + 15 + "px"
                x = x + mazeee.offset[1][0]
                y = y + mazeee.offset[1][1]
            } else
                alert('No way')

            break
        case 83: //s
            newx = x + mazeee.offset[2][0]
            newy = y + mazeee.offset[2][1]
            if (mazeee.isArea(newx, newy) && mazeee.maze[newx][newy] === mazeee.road) {
                body.style.top = body.offsetTop + 15 + "px"
                x = x + mazeee.offset[2][0]
                y = y + mazeee.offset[2][1]
            } else
                alert('No way')

            break
        case 87: //w
            newx = x + mazeee.offset[0][0]
            newy = y + mazeee.offset[0][1]
            if (mazeee.isArea(newx, newy) && mazeee.maze[newx][newy] === mazeee.road) {
                body.style.top = body.offsetTop - 15 + "px"
                x = x + mazeee.offset[0][0]
                y = y + mazeee.offset[0][1]
            } else
                alert('No way')

            break
        default:
            break;
    }
}