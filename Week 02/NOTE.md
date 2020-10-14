# 寻路算法（Pathfinding）

寻路，是指由计算机应用程序规划两点之间的最短路线。通俗地讲，就是走迷宫。这里尝试广度优先搜索和启发式搜索两种方法。

<br>

### 实现地图编辑器

绘制一个 100 * 100 的地图，通过 `localStorage` 得到本地上次保存的地图数据。未设置情况下，每个格点初始状态为空（0），鼠标左键点击后变为墙（1），鼠标右键点击可以清空（0）。通过 `mousedown` 和 `mouseup` 判断鼠标点击与释放， `mousemove` 判断鼠标移动， `MouseEvent.which === 3` 判断是否为鼠标右键，来实时更新重绘地图。

```js
let map = localStorage["map"] ? JSON.parse(localStorage["map"]) : Array(10000).fill(0);
let container = document.getElementById("container");

for(let y = 0; y < 100; y++){
    for(let x = 0; x < 100; x++){
        let cell = document.createElement("div");
        cell.classList.add("cell");

        if(map[100 * y + x] == 1){
            cell.style.backgroundColor = "black";
        }
        cell.addEventListener("mousemove", () => {
            if(mousedown){
                if(clear){
                    cell.style.backgroundColor = "";
                    map[100 * y + x] = 0;
                } else {
                    cell.style.backgroundColor = "black";
                    map[100 * y + x] = 1;
                }
            }
        });
        container.appendChild(cell);
    }
}

let mousedown = false;
let clear = false;
document.addEventListener("mousedown", e => {
    mousedown = true;
    clear = (e.which === 3);
});
document.addEventListener("mouseup", () => mousedown = false);
document.addEventListener("contextmenu", e => e.preventDefault());
```

<br>

### 广度优先搜索

编写 `path(map, start, end)` 函数进行路径查询和判断，采用先进先出的队列 `queue` 的数据结构，从起点 `start` 开始，若未抵达终点 `end`，则将当前进行判断的点的上下左右四点 `insert(x, y)` 入 `queue` 中，在 `queue` 中依次判断，直指匹配到终点则停止返回 `true` ，若 `queue` 全部判断完都未匹配到终点，则寻路失败返回 `false` 。

```javascript
function path(map, start, end){
    var queue = [start];

    function insert(x, y){
        if(x < 0 || x >= 100 || y < 0 || y >= 100) return;
        if(map[100 * y + x]) return;
        map[100 * y + x] = 2;
        queue.push([x, y]);
    }

    while(queue.length){
        let [x, y] = queue.shift();
        console.log(x, y);
        if(x === end[0] && y === end[1]){
            return true;
        }
        insert(x - 1, y);
        insert(x + 1, y);
        insert(x, y - 1);
        insert(x, y + 1);
    }

    return false;
}
```

<br>

### 通过异步编程可视化寻路算法

引入 `Promise` 和 `async/await` 进行异步编程，将已寻格点设置为淡绿色，设置 10 毫秒的格点移动时间，以便于观察。

```javascript
function sleep(t){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, t)
    });
}

async function path(map, start, end){
    var queue = [start];

    async function insert(x, y){
        if(x < 0 || x >= 100 || y < 0 || y >= 100) return;
        if(map[100 * y + x]) return;

        await sleep(10);
        container.children[100 * y + x].style.backgroundColor = "lightgreen";

        map[100 * y + x] = 2;
        queue.push([x, y]);
    }

    while(queue.length){
        let [x, y] = queue.shift();
        // console.log(x, y);
        if(x === end[0] && y === end[1]){
            return true;
        }
        await insert(x - 1, y);
        await insert(x + 1, y);
        await insert(x, y - 1);
        await insert(x, y + 1);
    }

    return false;
}
```

<br>

### 处理路径问题

增加 `table` 数组来存储所有已寻格点的父辈格点，其排序与 `map` 数组中的格点一一对应。当遍历到终点时，从终点开始在 `table` 中寻找父辈格点，将其设置为紫色并保存到 `path` 数组中，不断循环直至寻找到起点，则 `path` 数组表示了一条最优路径的倒序排列。

```javascript
async function findPath(map, start, end){
    let table = Object.create(map);
    let queue = [start];

    async function insert(x, y, pre){
        if(x < 0 || x >= 100 || y < 0 || y >= 100) return;
        if(table[100 * y + x]) return;

        container.children[100 * y + x].style.backgroundColor = "lightgreen";

        table[100 * y + x] = pre;
        queue.push([x, y]);
    }

    while(queue.length){
        let [x, y] = queue.shift();
        // console.log(x, y);
        if(x === end[0] && y === end[1]){
            let path = [];

            while(x != start[0] || y != start[1]){
                path.push(map[100 * y + x]);
                [x, y] = table[100 * y + x];
                await sleep(10);
                container.children[100 * y + x].style.backgroundColor = "purple";
            }
            console.log(path);
            console.log(path.length);
            return path;
        }
        await insert(x - 1, y, [x, y]);
        await insert(x + 1, y, [x, y]);
        await insert(x, y - 1, [x, y]);
        await insert(x, y + 1, [x, y]);

        await insert(x + 1, y + 1, [x, y]);
        await insert(x - 1, y + 1, [x, y]);
        await insert(x + 1, y - 1, [x, y]);
        await insert(x - 1, y - 1, [x, y]);
    }

    return null;
}
```

<br>

### 启发式搜索

编写一个 `Sorted` 数据结构，相较之前的搜索方式，可以不断调整方向，始终优先 `take()` 选择离终点最近的格点进行 `insert(x, y)`，搜索格点数更少且路径更短。

```javascript
class Sorted {
    constructor(data, compare){
        this.data = data.slice();
        this.compare = compare || ((a, b) => a - b);
    }
    take(){
        if(!this.data.length) return;
        let min = this.data[0];
        let minIndex = 0;

        for(let i = 1; i < this.data.length; i++){
            if(this.compare(this.data[i], min) < 0){
                min = this.data[i];
                minIndex = i;
            }
        }

        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop();
        return min;
    }
    give(v){
        this.data.push(v);
    }
    get length(){
        return this.data.length;
    }
}
```

```javascript
let queue = new Sorted([start], (a, b) => distance(a) - distance(b));

function distance(point){
    return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
}

while(queue.length){
    let [x, y] = queue.take();
		......
}
```

