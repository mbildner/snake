;(function(){
  var GridBox = function(row, col, width, height){
	  this.row = row;
	  this.col = col;
	  this.width = width;
	  this.height = height;
	  this.collideable = false;

	  this.render = function(color){
		  context.fillStyle = color;
		  context.fillRect(row*height, col*width, width, height, color)
	  }

	  this.erase = function(){
		  this.render(canvas.backgroundColor);
	  }
  }

  var GridModel = function(rows, cols, colWidth, rowHeight){
	  this.rows = rows;
	  this.cols = cols;

	  var grid = [];

	  for (var row=0; row<rows; row++){
		  var currentRow = [];
		  grid.push(currentRow);
		  for (var col=0; col<cols; col++){
			  var box = new GridBox(row, col, colWidth, rowHeight);
			  currentRow.push(box);
			  // currentRow.collideable = (row == ( 0 || rows-1)) ? true : false;
		  }
	  }

    this.getBox = function(row, col) {
      return grid[row][col];
    };

	  this.randomBox = function(){
		  var randBox = {};
		  randBox.collideable = true;

		  while (randBox.collideable){
			  var randRow = Math.floor(Math.random()*grid.length);
			  var randCol = Math.floor(Math.random()*grid[0].length);
			  var randBox = grid[randRow][randCol];
		  }

		  console.log(randBox);
		  return randBox;
	  }

	  // Canvas setup code - put it in a this.init function

	  // set edges to collideable and render them black
	  grid[0].forEach(function(box){
		  box.collideable = true;
		  box.render("black");
	  });

	  grid[grid.length-1].forEach(function(box){
		  box.collideable = true;
		  box.render("black");
	  });

	  grid.forEach(function(row){
		  row[0].collideable = true;
		  row[row.length-1].collideable = true;
		  row[0].render("black");
		  row[row.length-1].render("black");
	  });

	  // set a block to have food, make it collideable, and render it blue
	  var foodBlock = this.randomBox();
	  foodBlock.collideable = true;
	  foodBlock.food = true;
	  foodBlock.render("blue");
  }



  var SnakeModel = function(snakeLength){
	  // this.body = [];

	  // for (var bodyBlock=0; bodyBlock<snakeLength; bodyBlock++){
	  // 	this.body.push({});
	  // }


	  this.directionsDict = {
		  "Up": {"col": -1, "row":0},
		  "Down":{"col": 1, "row":0},
		  "Left": {"col": 0, "row":-1},
		  "Right": {"col": 0, "row":1}
	  }



	  this.body = [
		  {row:1,col:3},
		  {row:1,col:4},
		  {row:1,col:5},
		  {row:1,col:6},
		  {row:1,col:7},
		];


	  this.collisionCheck = function(){
		  head = this.body[0];
		  var headGridBox = gridModel.getBox(head.row, head.col);
		  var collision = headGridBox.collideable;
		  if (collision){
			  if (headGridBox.food){
				  // grow the snake; it ate food
				  snake.grow();
				  // set the food key to false and reset it randomly
				  headGridBox.food = false;
				  headGridBox.collideable = false;
				  var newFood = gridModel.randomBox();
				  newFood.collideable = true;
				  newFood.food = true;
				  newFood.render("blue");
			  } else {
				  // kill the snake, it hit something it shouldn't
				  window.clearInterval(gameLoopHandle);
				  alert("God you suck at snake");
			  }
		  }
	  }

	  this.grow = function(){
		  var tail = this.body[this.body.length-1];
		  var directionDelta = this.directionsDict[this.direction];
		  var newTail = {
			  "row": tail.row + directionDelta.row,
			  "col": tail.col + directionDelta.col
		  }

		  this.body.push(newTail);
		  var newTailBlock = gridModel.getBox(newTail.row, newTail.col);
		  newTailBlock.render("lime");

	  }

	  this.direction = "Right";
	  this.body.forEach(function(block){
		  var gridBox = gridModel.getBox(block.row, block.col);
		  gridBox.render("lime");
	  })

	  this.move = function(direction){
		  var tail = this.body.pop();

		  gridModel.getBox(tail.row, tail.col).erase();

		  // var directionsDict = {
		  // 	"Left": {"col": -1, "row":0},
		  // 	"Right":{"col": 1, "row":0},
		  // 	"Up": {"col": 0, "row":-1},
		  // 	"Down": {"col": 0, "row":1}
		  // }

		  // Hack to get around weird grid inversion

		  var directionsDict = {
			  "Up": {"col": -1, "row":0},
			  "Down":{"col": 1, "row":0},
			  "Left": {"col": 0, "row":-1},
			  "Right": {"col": 0, "row":1}
		  }

		  var oldHead = this.body[0];

		  var newHead = {
			  "row": oldHead.row,
			  "col": oldHead.col
		  };

		  newHead.row += this.directionsDict[direction]["row"];
		  newHead.col += this.directionsDict[direction]["col"];
		  this.body = [newHead].concat(this.body);

		  gridModel.getBox(newHead.row, newHead.col).render("lime");

	  }
  }

	this.canvas = document.getElementById('snakeGameCanvas');
	this.canvas.backgroundColor = "white";
	this.context = canvas.getContext('2d');

  var rows = 40, cols = 40;
	this.gridModel = new GridModel(rows, cols,
                                 canvas.height/rows, canvas.width/cols);
	this.snake = new SnakeModel(10);

	document.addEventListener("keydown", function(keyPress){
		snake.direction = keyPress.keyIdentifier;
	});

  var gameLoop = function(){
	  snake.move(snake.direction);
	  snake.head = snake.body[0];
	  snake.collisionCheck();
  }

  var gameLoopHandle = window.setInterval(gameLoop, 50);
})(this)
