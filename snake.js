var snakeGame = snakeGame || {};

// hány pixel egy cella
snakeGame.cellPixels = 20;
// hány cella van x vagy y irányba
snakeGame.numCells = 10;
snakeGame.fullScreenLength = snakeGame.numCells*snakeGame.cellPixels;

snakeGame.getSnakeCoord = () => {
    return snakeGame.cellPixels*(snakeGame.numCells/2);
}

const load = () =>{
    const stage = new Konva.Stage({
        container: 'container',
        width: snakeGame.fullScreenLength,
        height: snakeGame.fullScreenLength,
    });
    
    snakeGame.layer = new Konva.Layer();

    snakeGame.Gameover = false;

    snakeGame.bg = new Konva.Rect({
        width: snakeGame.fullScreenLength,
        height: snakeGame.fullScreenLength,
        fill: `#99b704`
    }); 
    snakeGame.layer.add(snakeGame.bg);


    snakeGame.snake = [new Konva.Rect({
        x: snakeGame.getSnakeCoord(),
        y: snakeGame.getSnakeCoord(),
        width: snakeGame.cellPixels,
        height: snakeGame.cellPixels,
        fill: '#000000',
        stroke: '#99b704',
        strokeWidth: 1,
    })];
    snakeGame.layer.add(snakeGame.snake[0]);


    /* snakeGame.snake = [];
    for(let i=0;i<snakeGame.numCells;i++) {
        for(let j=0;j<snakeGame.numCells-1;j++) {
            let snakePiece = new Konva.Rect({
                x: i*snakeGame.cellPixels,
                y: j*snakeGame.cellPixels,
                width: snakeGame.cellPixels,
                height: snakeGame.cellPixels,
                fill: '#000000',
                stroke: '#99b704',
                strokeWidth: 1,
            });
            console.log(snakePiece.x() + ' ' + snakePiece.y())
            snakeGame.snake.push(snakePiece);
            snakeGame.layer.add(snakePiece);
        }
    } */

    snakeGame.apple = new Konva.Rect({
        x: snakeGame.snake[0].x() + snakeGame.cellPixels*3,
        y: snakeGame.snake[0].y(),
        width: snakeGame.cellPixels,
        height: snakeGame.cellPixels,
        fill: '#E74C3C',
    });

    snakeGame.layer.add(snakeGame.apple);

    stage.add(snakeGame.layer);

	snakeGame.layer.draw();
    snakeGame.direction = "Right";

    setInterval(() => {
        if (!snakeGame.Gameover) {
            snakeGame.gameLoop();
        }      
    }, 300);
    
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 37) { //left
            if (snakeGame.direction !== "Right") {
                snakeGame.direction = "Left";
            }            
        } else if (e.keyCode === 38) {  //top
            if (snakeGame.direction !== "Down") {
                snakeGame.direction = "Up";
            }   
        } else if (e.keyCode === 39) {  //right
            if (snakeGame.direction !== "Left") {
                snakeGame.direction = "Right";
            }
        } else if (e.keyCode === 40) {  //bottom
            if (snakeGame.direction !== "Up") {
                snakeGame.direction = "Down";
            }            
        } else {
            return;
        }
        e.preventDefault();
    });
};

snakeGame.gameLoop = () => {
    if(snakeGame.checkWin()) {
        return;
    }

    const newSnakePosition = {
        x: snakeGame.snake[0].x(),
        y: snakeGame.snake[0].y()
    };

    if (snakeGame.direction === "Right") {
        newSnakePosition.x += snakeGame.cellPixels;
    } else if (snakeGame.direction === "Left") {
        newSnakePosition.x -= snakeGame.cellPixels;
    } else if (snakeGame.direction === "Up") {
        newSnakePosition.y -= snakeGame.cellPixels;
    } else if (snakeGame.direction === "Down") {
        newSnakePosition.y += snakeGame.cellPixels;
    }

    if (snakeGame.checkWall(newSnakePosition)) {
        return;
    }
    if (snakeGame.checkSnake(newSnakePosition)) {
        return;
    }
    if (snakeGame.getApple(newSnakePosition)) {
        return;
    } 
    snakeGame.snakeMovement(newSnakePosition);
};

snakeGame.checkWall = (newSnakePosition) => {
    if (newSnakePosition.x < 0 || 
            newSnakePosition.x >= snakeGame.fullScreenLength || 
            newSnakePosition.y >= snakeGame.fullScreenLength || 
            newSnakePosition.y < 0) {
        alert('DEAD');
        snakeGame.Gameover = true;
        return true;
    }
    return false;
};

snakeGame.checkSnake = (newSnakePosition) => {

    for (let i = 0; i < snakeGame.snake.length-1; i++) {
        if (snakeGame.snake[i].x() === newSnakePosition.x && snakeGame.snake[i].y() === newSnakePosition.y) {
            alert('DEAD');
            snakeGame.Gameover = true;
            return true;
        }
    };
    return false;
};

snakeGame.checkWin = () => {
    if (snakeGame.numCells*snakeGame.numCells === snakeGame.snake.length) {
        alert('WIN');
        snakeGame.Gameover = true;
        return true;
    }
    return false;
};

snakeGame.getApple = (newSnakePosition) => {
    if (newSnakePosition.x === snakeGame.apple.x() && newSnakePosition.y === snakeGame.apple.y()) {
        
        snakeGame.snake.unshift(new Konva.Rect({
            x: snakeGame.apple.x(),
            y: snakeGame.apple.y(),
            width: snakeGame.cellPixels,
            height: snakeGame.cellPixels,
            fill: '#000000',
            stroke: '#99b704',
            strokeWidth: 1,
        }));
        
        snakeGame.layer.add(snakeGame.snake[0]);

        let goodPosition = true;
        do {
            snakeGame.apple.x(Math.round(Math.random() * (snakeGame.numCells-1))*snakeGame.cellPixels);
            snakeGame.apple.y(Math.round(Math.random() * (snakeGame.numCells-1))*snakeGame.cellPixels);
            
            goodPosition = true;
            for (let i = 0; i < snakeGame.snake.length; i++) {
                if (snakeGame.snake[i].x() === snakeGame.apple.x() && snakeGame.snake[i].y() === snakeGame.apple.y()) {
                    goodPosition = false;
                    break;
                }
            }
        } while(goodPosition === false)

        snakeGame.snakeColor()
        snakeGame.apple.moveToTop()
        return true;
    }
    return false;
};

snakeGame.snakeMovement = (newSnakePosition) =>{
    const lastSnake = snakeGame.snake.pop();

    lastSnake.x(newSnakePosition.x);
    lastSnake.y(newSnakePosition.y);

    snakeGame.snake.unshift(lastSnake);

    document.getElementById('score').innerHTML = snakeGame.snake.length
    snakeGame.snakeColor()
};

snakeGame.snakeColor = () => {
    snakeGame.snake[0].fill('#000000');
    for(let i = 1; i < snakeGame.snake.length; i++) {
        snakeGame.snake[i].fill(`#828282`)
    }
};

const loadEvent = () => {
    load()
};

window.addEventListener('load', loadEvent)