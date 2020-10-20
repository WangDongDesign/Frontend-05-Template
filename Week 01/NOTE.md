# TicTacToe

实现一个 Tic-Tac-Toe 三子棋游戏，设计算法计算出最佳落子点和胜负预期值，实现人机对战。
    
    
    
    
### 棋盘的数据结构

可用二位数组表示 3 * 3 棋盘，每个格子有三种状态：空（0）、甲方（1）、乙方（2）。

```javascript
let pattern = [
    [2, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
];
```

后期为简化数据结构，便于数据的处理和减小内存空间，用一维数组表示更佳。

```javascript
let pattern = [
    2, 0, 0,
    0, 1, 0,
    0, 0, 0
];
```

<br>

### 绘制棋盘

通过 `show()` 函数，遍历每个格子中的数值状态，在页面中进行相应的绘制。

```javascript
function show(){
    let board = document.getElementById("board");
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = 
                pattern[i][j] == 2 ? "❌" : 
                pattern[i][j] == 1 ? "⭕" : "";
            board.appendChild(cell);
        }
        board.appendChild(document.createElement("br"));
    }
}
```

<br>

### 更新落子

为每个格子添加 `click` 监听事件，当触发点击事件时调用 `move()` 函数，更新棋盘中的落子情况。

```javascript
cell.addEventListener("click", () => move(i, j));
```

```javascript
function move(x, y){
    pattern[x][y] = color;
    color = 3 - color;
    show();
}
```

<br>

### 判断胜负

通过 `check()` 函数，判断当前棋盘的输赢情况，其中包含 4 种情况的判断：

- 一行满 3 子
- 一列满 3 子
- 正对角线满 3 子
- 反对角线满 3 子

```javascript
function check(){
    for(let i = 0; i < 3; i++){
        let win = true;
        for(let j = 0; j < 3; j++){
            if(pattern[i][j] !== color){
                win = false;
            }
        }
        if(win){
            return true;
        }
    }
    for(let i = 0; i < 3; i++){
        let win = true;
        for(let j = 0; j < 3; j++){
            if(pattern[j][i] !== color){
                win = false;
            }
        }
        if(win){
            return true;
        }
    }
    {
        let win = true;
        for(let i = 0; i < 3; i++){
            if(pattern[i][i] !== color){
                win = false;
            }
        }
        if(win){
            return true;
        }
    }
    {
        let win = true;
        for(let i = 0; i < 3; i++){
            if(pattern[i][2 - i] !== color){
                win = false;
            }
        }
        if(win){
            return true;
        }
    }
    return false;
}
```

在 `move()` 函数中添加胜负判别，并在决出胜负时弹窗提示。

```javascript
if(check()){
    alert(color == 2 ? "❌ is winner!" : "⭕ is winner!");
}
```

<br>

### 预判胜方

通过 `willWin()` 函数，在某一方有落子即胜利的可能前，提示该方即将胜利。

```javascript
function willWin(pattern, color){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(pattern[i][j]){
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            if(check(tmp, color)){
                return true;
            }
        }
    }
    return false;
}
```

在 `move()` 函数中添加预判，并在日志区打印预判信息。

```javascript
if(willWin(pattern, color)){
    console.log(color == 2 ? "❌ will win!" : "⭕ will win!")
}
```

<br>

### 最优落子点

通过 `bestChoice()` 函数，判断在落子前提示最优落子点和结果预测。其原理为借助 `willWin()` 函数和 `bestChoice()` 函数递归，判断双方是否有胜利的落子路径：如果己方有，则最优落子点为该路径的第一个点；如果对方有，则最优落子点也为该路径的第一个点（阻止对方胜利）；若双方都没有，则没有无最优落子点。

```javascript
function bestChoice(pattern, color){
    let p;
    if(p = willWin(pattern, color)){
        return {
            point: p,
            result: 1
        }
    }
    let result = -2;
    let point = null;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(pattern[i][j]){
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            let r = bestChoice(tmp, 3 - color).result;

            if(- r > result){
                result = - r;
                point = [i, j];
            }
        }
    }
    return {
        point: point,
        result: point ? result : 0
    }
}
```

<br>

### 人机对战

通过 `computerMove()` 函数，让计算机在人落子后选择其最优落子点并下棋，实现人机对战。

```javascript
function computerMove(){
    let choice = bestChoice(pattern, color);
    if(choice.point){
        pattern[choice.point[0] * 3 + choice.point[1]] = color;
    }
    if(check(pattern, color)){
        alert(color == 2 ? "❌ is winner!" : "⭕ is winner!");
    }
    color = 3 - color;
    console.log(bestChoice(pattern, color).point, bestChoice(pattern, color).result);
    if(willWin(pattern, color)){
        console.log(color == 2 ? "❌ will win!" : "⭕ will win!")
    }
    show(pattern);
}
```

<br>

<br>

# TrafficLight

通过 Callback、Promise、async / await、Generator 四种方法，实现红绿灯依次按时闪烁的功能。

<br>

### Callback

使用 `setTimeout` 方法的嵌套，实现红绿灯的功能。

```javascript
function go(){
    green();
    setTimeout(() => {
        yellow();
        setTimeout(() => {
            red();
            setTimeout(() => {
                go();
            }, 500);
        }, 200);
    }, 1000);
}
```

<br>

### Promise

通过 `sleep` 函数返回  `Promise` 的方式，实现链式的代码，可读性和易维护性优于嵌套式结构。

```javascript
function sleep(t){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, t)
    });
}

function go(){
    green();
    sleep(1000).then(() => {
        yellow();
        return sleep(200);
    }).then(() => {
        red();
        return sleep(500);
    }).then(go);
}
```

<br>

### async / await

通过 `async / await` 方法，进一步优化代码结构，虽然是异步代码，但代码呈现形式与同步代码一致。

```javascript
async function go(){
    while(true){
        green();
        await sleep(1000);
        yellow();
        await sleep(200);
        red();
        await sleep(500);
    }
}
```

`async / await` 方法还能更好地进行代码修改，实现手动控制红绿灯的功能。

```javascript
function happen(element, eventName){
    return new Promise((resolve, reject) => {
        element.addEventListener(eventName, resolve, {once: true});
    })
}

async function go(){
    while(true){
        green();
        await happen(document.getElementById("next"), "click");
        yellow();
        await happen(document.getElementById("next"), "click");
        red();
        await happen(document.getElementById("next"), "click");
    }
}
```

<br>

### Generator

通过 `Generator` 函数，配合 `yield` 以同步代码的形式实现异步任务。

```javascript
function* go(){
    while(true){
        green();
        yield sleep(1000);
        yellow();
        yield sleep(200);
        red();
        yield sleep(500);
    }
}

function run(iterator){
    let {value, done} = iterator.next();
    if(done){
        return;
    }
    if(value instanceof Promise){
        value.then(() => {
            run(iterator);
        });
    }
}

function co(generator){
    return function(){
        return run(generator());
    }
}

go = co(go);
```


