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

	// var sizeX = canvas.height/rows;
	// var sizeY = canvas.width/cols;

	for (var r=0; r<rows; r++){
		var currentRow = [];
		grid.push(currentRow);
		for (var c=0; c<cols; c++){
			var currentCol = new Object();
			currentRow.push(currentCol);
		}
	}

	// set every column in the top and bottm edges to occuppied

	var topEdge = grid[0];
	var bottomEdge = grid[grid.length-1];

	[topEdge, bottomEdge].forEach(function(edgeArray){
		edgeArray.forEach(function(square){
			square.occuppied = true;
		})
	});

	for (var r=0; r<rows; r++){
		var row = grid[r];
		var firstSquare = row[0];
		firstSquare.occuppied = true;
		var lastSquare = row[row.length-1];
		lastSquare.occuppied = true;
		}
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

var Snake = function(blockArray){
	var path = blockArray;
	// start the snake moving to the right, for convenience.  this can be changed later by the developer at will.
	var direction = "right";

	var move = function(direction){
		// add a test condition to prevent the snake from "turning" back on itself by reversing direction 
		var moveDirection = controller.directions[direction];
		// grab old head so we can use its x and y coordinates to set the new head
		var oldTail = path.pop();
		oldTail.erase(canvas);
		var oldHead = path[0];
		var newHead = new Block(oldHead.x, oldHead.y ,  gameBlockXSize, gameBlockYSize, "black", canvas)
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


var collisionCheckGrid = function(x, y, canvas, grid){
	var col = Math.floor(x * ((grid[0].length) / canvas.width));
	var row = Math.floor(y * ((grid.length) / canvas.height));
	
	var gridBox = grid[row][col];
	if (gridBox.occuppied){
		endGame();
	}
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

	var initializeSnakePath = function(x, y, length, direction){
		var path = [];
		var initX = x;
		var initY = y;
		// start building the blocks at (x, y) and make each variable bigger accordingly
		for (var l=0; l<length; l++){
			var bodyBlock = new Block(x, y, sizeX, sizeY, color, canvas);
			path.push(bodyBlock);
		}
	}

	var keyPressDirections = {
	"37" : "left",
	"38" : "up",
	"39" : "right",
	"40" : "down"
	}

	var directions = {
		"up": {x:0, y:-gameBlockYSize},
		"down": {x:0, y:+gameBlockYSize},
		"left": {x:-gameBlockXSize, y:0},
		"right": {x:+gameBlockXSize, y:0}
	}

	this.directions = directions;
	this.keyPressDirections = keyPressDirections;

}


// instantiate game objects

// block array gameboard canvas
var canvas = new Canvas("snakeGameCanvas", "white");

// var rowNumber = canvas.height/totalGameRowNumber;
// var colNumber = canvas.width/totalGameColumnNumber;

rowNumber = 50;
colNumber = 50;

var gameBlockXSize = canvas.width/rowNumber;
var gameBlockYSize = canvas.height/colNumber;

var startingSnake = [new Block(120, 10, gameBlockXSize, gameBlockYSize, "black", canvas), new Block(100, 10,  gameBlockXSize, gameBlockYSize, "black", canvas), new Block(80, 10,  gameBlockXSize, gameBlockYSize, "black", canvas), new Block(60, 10,  gameBlockXSize, gameBlockYSize, "black", canvas), new Block(40, 10,  gameBlockXSize, gameBlockYSize, "black", canvas)];


var snake = new Snake(startingSnake);
var grid = new VirtualGrid(rowNumber, colNumber, canvas);
var view = new GameBoardView(canvas, grid, snake);
var controller = new GameController(snake, canvas, grid, view);


document.body.addEventListener("keydown", function(press){
	// press.which will be a number, translate it to one of our directions, so we can pass it to the snake to move it
	var directionSignal = press.which;

	snake.direction = controller.keyPressDirections[directionSignal.toString()];

})

var endGame = function(){
	window.clearInterval(gameLoop);
}

var cycleGame = function(){
	if (collisionCheck(snake.path.slice(1, snake.path.length), snake.path[0])){
		endGame();
	}

	// the snake head should get its row and column calculated instead of as raw x, y (or in addition)

	collisionCheckGrid(snake.path[0].x, snake.path[0].y, canvas, grid);
	snake.move(snake.direction);
	view.updateView();
}

var refreshRate = 50;

var gameLoop = window.setInterval(cycleGame, refreshRate);

var killGameButton = document.getElementById("killGameButton");
killGameButton.addEventListener("click", function(){window.clearInterval(gameLoop);})
