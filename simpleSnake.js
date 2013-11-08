;(function(){
  var GridBox = function(row, col, gridView){
	  this.row = row;
	  this.col = col;
    this.gridView = gridView;
    this.food = false;
	  this.collideable = false;
  }

  GridBox.prototype = {
    setAsFood: function() {
      this.collideable = true;
      this.food = true;
      this.gridView.renderBox(this, "blue");
    },

    setAsWall: function() {
      this.collideable = true;
      this.gridView.renderBox(this, "black");
    },

    setAsSnake: function() {
      this.gridView.renderBox(this, "lime");
    },

    reset: function() {
      this.collideable = false;
      this.food = false;
      this.gridView.eraseBox(this);
    }
  };

  var GridView = function(colWidth, rowHeight, backgroundColor) {
    this.renderBox = function(box, color) {
		  context.fillStyle = color;
		  context.fillRect(box.row*rowHeight, box.col*colWidth,
                       colWidth, rowHeight,
                       color);
    };

    this.eraseBox = function(box) {
      this.renderBox(box, backgroundColor);
    };
  };

  var GridModel = function(rows, cols, gridView){
	  var grid = [];

	  for (var row=0; row<rows; row++){
		  var currentRow = [];
		  grid.push(currentRow);
		  for (var col=0; col<cols; col++){
			  var box = new GridBox(row, col, gridView);
			  currentRow.push(box);
		  }
	  }

    this.getBox = function(row, col) {
      return grid[row][col];
    };

    this.randomBox = function() {
			var randRow = Math.floor(Math.random()*grid.length);
			var randCol = Math.floor(Math.random()*grid[0].length);
			return grid[randRow][randCol];
    };

    this.setUpWalls(grid);
	  this.createNewFoodBlock();
  };

  GridModel.prototype = {
    createNewFoodBlock: function() {
      var box = this.randomBox();
		  while (box.collideable){
			  box = randomBox();
		  }

	    box.setAsFood();
    },

    setUpWalls: function(grid) {
	    grid[0].forEach(function(box){
		    box.setAsWall()
	    });

	    grid[grid.length-1].forEach(function(box){
		    box.setAsWall()
	    });

	    grid.forEach(function(row){
        row[0].setAsWall();
        row[row.length-1].setAsWall();
	    });
    }
  };

  var SnakeModel = function(gridModel, snakeLength){
    this.gridModel = gridModel;
	  this.direction = "Right";

	  this.body = [
		  {row:1,col:3},
		  {row:1,col:4},
		  {row:1,col:5},
		  {row:1,col:6},
		  {row:1,col:7},
		];

	  this.body.forEach(function(block){
		  var gridBox = gridModel.getBox(block.row, block.col);
		  gridBox.setAsSnake();
	  })
  }

  SnakeModel.prototype = {
	  collisionCheck: function(){
		  var head = this.body[0];
		  var headGridBox = this.gridModel.getBox(head.row, head.col);
		  var collision = headGridBox.collideable;
		  if (collision){
			  if (headGridBox.food){
				  // grow the snake; it ate food
				  snake.grow();
				  // set the food key to false and reset it randomly
				  headGridBox.reset();
				  this.gridModel.createNewFoodBlock();
			  } else {
				  // kill the snake, it hit something it shouldn't
				  window.clearInterval(gameLoopHandle);
				  alert("God you suck at snake");
			  }
		  }
	  },

	  move: function(direction){
		  var tail = this.body.pop();

		  this.gridModel.getBox(tail.row, tail.col).reset();
		  var oldHead = this.body[0];
		  var newHead = {
			  "row": oldHead.row,
			  "col": oldHead.col
		  };

		  newHead.row += this.directionsDict[direction]["row"];
		  newHead.col += this.directionsDict[direction]["col"];
		  this.body = [newHead].concat(this.body);

		  this.gridModel.getBox(newHead.row, newHead.col).setAsSnake();
	  },

	  directionsDict: {
		  "Up": {"col": -1, "row":0},
		  "Down":{"col": 1, "row":0},
		  "Left": {"col": 0, "row":-1},
		  "Right": {"col": 0, "row":1}
	  },

	  grow: function(){
		  var tail = this.body[this.body.length-1];
		  var directionDelta = this.directionsDict[this.direction];
		  var newTail = {
			  "row": tail.row + directionDelta.row,
			  "col": tail.col + directionDelta.col
		  }

		  this.body.push(newTail);
		  var newTailBlock = this.gridModel.getBox(newTail.row, newTail.col);
		  newTailBlock.setAsSnake();
	  }
  };

	var canvas = document.getElementById('snakeGameCanvas');
	canvas.backgroundColor = "white";
	this.context = canvas.getContext('2d');

  var rows = 40, cols = 40;
  var gridView = new GridView(canvas.height/rows, canvas.width/cols,
                              canvas.backgroundColor)
	var gridModel = new GridModel(rows, cols, gridView);
	var snake = new SnakeModel(gridModel, 10);
  console.log(this)
	document.addEventListener("keydown", function(keyPress){
		snake.direction = keyPress.keyIdentifier;
	});

  var gameLoop = function(){
	  snake.move(snake.direction);
	  snake.head = snake.body[0];
	  snake.collisionCheck(gridModel);
  }

  var gameLoopHandle = window.setInterval(gameLoop, 50);
})(this)
