// model
// view
// controller


var Canvas = function(canvasID, background){
	var canvas = document.getElementById(canvasID);
	// don't make the actual canvas node public, the game doesn't need to know about it
	this.width = canvas.getAttribute('width');
	this.height = canvas.getAttribute('height');
	this.ctx = canvas.getContext('2d');
	this.background = background;
	return this;
}

var VirtualGrid = function(rows, cols, canvas){
	var grid = [];

	for (var r=0; r<rows; r++){
		var currentRow = [];
		grid.push(currentRow);
		for (var c=0; c<cols; c++){
			var currentCol = new Object();
			currentRow.push(currentCol);
		}
	}

	var topEdge = grid[0];
	var bottomEdge = grid[grid.length-1];

	// fill the top and bottom edges with blocks then call them to render in the view

	return grid;
}

var Block = function(x, y, sizeX, sizeY, color, canvas){
	var context = canvas.ctx;

	var render = function(canvas){
		context.fillStyle = color;
		context.fillRect(x, y, sizeX, sizeY);
	}

	var erase = function(canvas){
		context.fillStyle = canvas.background;
		context.fillRect(x, y, sizeX, sizeY);
	}

	this.render = render;
	this.erase = erase;
	this.x = x;
	this.y = y;

	return this;
}


var keyPressDirections = {
	"37" : "left",
	"38" : "up",
	"39" : "right",
	"40" : "down"
}

var snakeBlockSize = 20;

var directions = {
	"up": {x:0, y:-20},
	"down": {x:0, y:+20},
	"left": {x:-20, y:0},
	"right": {x:+20, y:0}
}


var Snake = function(blockArray){
	var path = blockArray;

	// start the snake moving to the right, for convenience.  this can be changed later by the developer at will.
	var direction = "right";

	var move = function(direction){

		// add a test condition to prevent the snake from "turning" back on itself by reversing direction 
		var moveDirection = directions[direction];

		// grab old head so we can use its x and y coordinates to set the new head
		var oldTail = path.pop();
		oldTail.erase(canvas);
		var oldHead = path[0];
		var newHead = new Block(oldHead.x, oldHead.y , snakeBlockSize, snakeBlockSize, "black", canvas)
		newHead.x += moveDirection.x;
		newHead.y += moveDirection.y;

		path.reverse();
		path.push(newHead);
		path.reverse();

		// newHead.render(canvas);

	}
	// make move and path public functions so they can be referred to by the controller
	this.move = move;
	this.path = path;
	this.direction = direction;

	return this;
}

var collisionCheck = function(blockArray, block){
	for (var t=0; t<blockArray.length; t++){
		var testBlock = blockArray[t];
		if (testBlock.x==block.x){
			if (testBlock.y==block.y){
				return true;
			}
		}
	}

	return false;
}


var GameBoardView = function(canvas, grid, snake){
	var updateView = function(){
		snake.path.forEach(function(block){
			block.render(canvas);
		});
	}

	this.updateView = updateView;
	return this
}


function GameController(snake, canvas, grid, view){

}


// instantiate game objects

// block array gameboard cnvas
var canvas = new Canvas("snakeGameCanvas", "white");

// var Block = function(x, y, sizeX, sizeY, color, canvas){

var startingSnake = [new Block(120, 10, snakeBlockSize, snakeBlockSize, "black", canvas), new Block(100, 10, snakeBlockSize, snakeBlockSize, "black", canvas), new Block(80, 10, snakeBlockSize, snakeBlockSize, "black", canvas), new Block(60, 10, snakeBlockSize, snakeBlockSize, "black", canvas), new Block(40, 10, snakeBlockSize, snakeBlockSize, "black", canvas)];

var snake = new Snake(startingSnake);

// the canvas should have height/10 rows and width/10 columns

var rowNumber = canvas.height/10;
var colNumber = canvas.width/10;

var grid = new VirtualGrid(rowNumber, colNumber, canvas);
var view = new GameBoardView(canvas, grid, snake);


document.body.addEventListener("keydown", function(press){
	// press.which will be a number, translate it to one of our directions, so we can pass it to the snake to move it
	var direction = keyPressDirections[press.which.toString()];
	snake.direction = direction;

})


var endGame = function(){
	window.clearInterval(gameLoop);
}

var cycleGame = function(){
	if (collisionCheck(snake.path.slice(1, snake.path.length), snake.path[0])){
		endGame();
	}
	snake.move(snake.direction);
	view.updateView();
}


var frameRate = 50;

var gameLoop = window.setInterval(cycleGame, frameRate);

var killGameButton = document.getElementById("killGameButton");
killGameButton.addEventListener("click", function(){window.clearInterval(gameLoop);})
