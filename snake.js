var snakeGame = snakeGame || {};

const load = () =>{

    const stage = new Konva.Stage({
        container: 'container',
        width: 400,
        height: 400,
    });
    
    snakeGame.layer = new Konva.Layer();

    snakeGame.Gameover = false;

    snakeGame.screenDimension = {
        width: 400,
        height: 400
    };

    snakeGame.snake = [new Konva.Rect({
        x: 200,
        y: 200,
        width: 20,
        height: 20,
        fill: '#27AE60',
    })];

    snakeGame.apple = new Konva.Rect({
        x: Math.round(Math.random() * 10)*20,
        y: Math.round(Math.random() * 10)*20,
        width: 20,
        height: 20,
        fill: '#E74C3C',
    });
    
    const bg = new Konva.Rect({
        width: 800,
        height: 800,
        fill: '#34495E'
    }); 

    snakeGame.layer.add(bg);
    snakeGame.layer.add(snakeGame.snake[0]);
    snakeGame.layer.add(snakeGame.apple);

    stage.add(snakeGame.layer);

	snakeGame.layer.draw();
    snakeGame.direction = "Right";

    setInterval(() => {
        if (!snakeGame.Gameover) {
            snakeGame.gameLoop();
        }      
    }, 200);
    
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 37) { //left
            snakeGame.direction = "Left";
        } else if (e.keyCode === 38) {  //top
            snakeGame.direction = "Up";
        } else if (e.keyCode === 39) {  //right
            snakeGame.direction = "Right";
        } else if (e.keyCode === 40) {  //bottom
            snakeGame.direction = "Down";
        } else {
            return;
        }
        e.preventDefault();
    });
};

snakeGame.gameLoop = () => {
    const newSnakePosition = {
        x: snakeGame.snake[0].x(),
        y: snakeGame.snake[0].y()
    };

    if (snakeGame.direction === "Right") {
        newSnakePosition.x += 20;
    } else if (snakeGame.direction === "Left") {
        newSnakePosition.x -= 20;
    } else if (snakeGame.direction === "Up") {
        newSnakePosition.y -= 20;
    } else if (snakeGame.direction === "Down") {
        newSnakePosition.y += 20;
    }

    if (snakeGame.checkWall(newSnakePosition)) {
        return;
    }
    if (snakeGame.getApple(newSnakePosition)) {
        return;
    } 
    snakeGame.snakeMovement(newSnakePosition);
};

snakeGame.checkWall = (newSnakePosition) => {
    if (newSnakePosition.x < 0 || 
            newSnakePosition.x >= snakeGame.screenDimension.width || 
            newSnakePosition.y >= snakeGame.screenDimension.height || 
            newSnakePosition.y < 0) {
        alert('DEAD');
        snakeGame.Gameover = true;
        snakeGame.scores.push(snakeGame.snake.length)
        return true;
    }
    return false;
};

snakeGame.getApple = (newSnakePosition) => {
    if (newSnakePosition.x === snakeGame.apple.x() && newSnakePosition.y === snakeGame.apple.y()) {
        
        snakeGame.snake.unshift(new Konva.Rect({
            x: snakeGame.apple.x(),
            y: snakeGame.apple.y(),
            width: 20,
            height: 20,
            fill: '#27AE60',
        }));
        
        snakeGame.layer.add(snakeGame.snake[0]);
        
        snakeGame.apple.x(Math.round(Math.random() * 10)*20);
        snakeGame.apple.y(Math.round(Math.random() * 10)*20);
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
};

const loadEvent = () => {
    load()
};

window.addEventListener('load', loadEvent)