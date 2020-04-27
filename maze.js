/*开发计划步骤：
    1. 生成随机迷宫
    2. 深度遍历找出路
    3. 手动控制1个小人走
    4. 一台机器两个人相对走
    5. 设置墙以外的障碍物
    4. 双人登录相对走，加入射击功能（不能穿墙），这一步需要后台
 */
//迷宫的宽高设为550px
class Queue {
    constructor() {
        this.queue = []
    }
    push(pos) {
        if (Math.random() < 0.5) //random加不加括号好像效果不一样
            this.queue.push(pos)
        else
            this.queue.unshift(pos) //means push_front
    }
    pop() {
        /*随机选出一个与队列头交换
        let randomIndex = Math.floor(Math.random() * this.queue.length)
        let temp = this.queue[0]
        this.queue[0] = this.queue[randomIndex]
        this.queue[randomIndex] = temp*/
        if (Math.random() < 0.5)
            return this.queue.pop()
        else
            return this.queue.shift() // means pop_front()
    }
    empty() {
        return !this.queue.length
    }
}
class Maze {
    constructor(row, col, paintProgressTime, width = 550, height = 550) {
        this.class = Math.random().toFixed(2) //四舍五入为两位小数
        this.row = row
        this.col = col
        this.width = width
        this.height = height
        this.road = ' '
        this.wall = '#'
        this.ex = 1
        this.ey = 0
        this.outx = row - 2
        this.outy = col - 1
        this.maze = [] //应当是一个二维数组, 值为墙或者路
        this.visited = [] //生成迷宫时使用
        this.pathVisited = [] //找路时使用
        this.offset = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ]
        this.signalOne = false //是否生成完迷宫
        this.paintProgressTime = paintProgressTime
        this.viewindex = 0
        this.viewPath = 0
    }

    initData() {
            for (let i = 0; i < this.row; i++) {
                this.maze[i] = new Array(this.col).fill(this.wall)
                this.visited[i] = new Array(this.col).fill(false)
                this.pathVisited[i] = new Array(this.col).fill(false)
                for (let j = 0; j < this.col; j++) {
                    //横纵坐标均为奇数，就是路
                    if (i % 2 === 1 && j % 2 === 1) {
                        this.maze[i][j] = this.road
                    }
                }
            }
            this.maze[this.ex][this.ey] = this.road
            this.maze[this.outx][this.outy] = this.road
        }
        //init maze DOM
    initDOM(maze) {
        let oDiv = document.createElement('div')
        oDiv.style.width = this.width + 'px'
        oDiv.style.height = this.height + 'px'
        oDiv.style.display = 'flex'
        oDiv.style.flexWrap = 'wrap'
        oDiv.style.marginBottom = '20px'

        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
                let oSpan = document.createElement('span')
                    //下面这句啥意思啊？
                    //toFixed()是干嘛的
                oSpan.dataset.index = i + '-' + j + '-' + this.class
                oSpan.style.width = (this.width / this.col).toFixed(2) + 'px'
                oSpan.style.height = (this.height / this.row).toFixed(2) + 'px'
                    //墙和路用不同的颜色
                oSpan.style.background = maze[i][j] === this.wall ? '#f08080' : '#fff'
                    //查一下appendChild()
                oDiv.appendChild(oSpan)
            }
        }
        document.body.appendChild(oDiv)
    }
    initMaze() {
        //先初始化逻辑上的迷宫
        this.initData()
            //根据逻辑上的迷宫再初始化网页上呈现的迷宫
        this.initDOM(this.maze)
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

    resetMaze(x, y, type) {
            //如果是type墙，渲染成红色，否则白色
            if (this.isArea(x, y)) {
                this.maze[x][y] = type
                    //CSS选择器
                let changeSpan = document.querySelector(`span[data-index='${x}-${y}-${this.class}']`)
                changeSpan.style.background = type === this.wall ? '#f08080' : '#fff'
            }
        }
        //随机渲染迷宫


    paintMaze() {
        this.initMaze() //调试ok

        let queue = new Queue()
        queue.push({ x: this.ex, y: this.ey + 1 })
        this.visited[this.ex][this.ey + 1] = true

        console.log(queue)

        while (!queue.empty()) {
            let curPos = queue.pop()
                //i为什么小于4, 四个方向四种选择
            console.log(queue)
            for (let i = 0; i < 4; i++) {
                let newx = curPos.x + this.offset[i][0] * 2 //走两步防止开辟出大片空地
                let newy = curPos.y + this.offset[i][1] * 2

                if (this.isArea(newx, newy)) {
                    if (!this.visited[newx][newy]) {
                        //坐标没有越界而且没有被访问过
                        this.resetMazeShow((newx + curPos.x) / 2, (newy + curPos.y) / 2, this.road) //打通两个方块之间的墙
                        queue.push({ x: newx, y: newy })
                        this.visited[newx][newy] = true
                    } else if (Math.random() < 0.05) {
                        //坐标没有越界但是被访问过
                        //而且随机数值小于0.05
                        this.resetMazeShow((newx + curPos.x) / 2, (newy + curPos.y) / 2, this.road)
                    }
                }

            }
        }
        //this.signalOne = true
        //return this
    }
    isArea(x, y) {
            return x > 0 && x < this.row - 1 && y > 0 && y < this.col - 1 || x == this.ex && y == this.ey || x == this.outx && y == this.outy
        }
        /*
    findPath() {
        while (!this.signalOne) {
            alert('waiting')
        }
        alert('checking way')
        if (!this.seeker(this.ex, this.ey))
            throw new Error('No way out!')
    }
    seeker(x, y) {
        //alert('seeker')
        if (this.isArea(x, y)) {
            //alert(`${x},${y}`)
            this.pathVisited[x][y] = true
            this.resetPathShow(x, y, '#ffff00')
            alert('yellow')
            if (x === this.outx && y === this.outy) {
                return true
            }
            for (let i = 0; i < 4; i++) {
                let newx = x + this.offset[i][0]
                let newy = y + this.offset[i][1]
                if (this.isArea(x, y) && !this.pathVisited[newx][newy] && this.maze[newx][newy] === this.road)
                //continue
                //this.pathVisited[newx][newy] = true
                //this.resetPathShow(newx, newy, '#ff0')
                    if (this.seeker(newx, newy))
                        return true
                            //this.pathVisited[newx][newy] = false
                            //this.resetPathShow(newx, newy, '#fff')

            }
            this.resetPathShow(x, y, '#fff')
            alert('white')
            return false
        }

    }
    resetPathShow(x, y, color) {
        if (!this.paintProgressTime) {
            this.resetPath(x, y, color)
            return
        }
        this.viewPath++
            setTimeout(() => {
                this.resetPath(x, y, color)
            }, this.viewPath * this.paintProgressTime);
    }

    resetPath(x, y, color) {
        //未出界时
        if (this.isArea(x, y)) {
            let path = document.querySelector(`span[data-index='${x}-${y}-${this.class}']`)
            path.style.background = color
        }
    }*/

}
//let mazeHasDown = new Maze(25, 25, 0, 200, 200).paintMaze()
let maze = new Maze(25, 25, 100).paintMaze() //必须是奇数
alert('buildmap')
    //maze.findPath()