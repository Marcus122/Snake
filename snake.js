var KEY = {
    'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16,
    'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27,
    'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36,
    'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40,
    'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59,
    'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93,
    'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107,
    'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110,
    'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145,
    'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189,
    'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192,
    'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220,
    'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222
};
(function () {
	/* 0 - 9 */
	for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
	}
	/* A - Z */
	for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
	}
	/* NUM_PAD_0 - NUM_PAD_9 */
	for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
	}
	/* F1 - F12 */
	for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
	}
})();
var Snake = {};
Snake.Color = {
    BACKGROUND  : "#000000"
};
Snake.FPS = 10;
var gridWidth = 20;
var gridHeight = 20;
Snake.GRID = new Array();
var i=0, j=0;
while( j <= gridHeight ){
	i=0;
	while( i <= gridWidth ){
		grid = [i,j];
		i++;
		Snake.GRID.push(grid);
	}
	j++;
}
Snake.Consts = [
  {name: "State", consts: ["WAITING", "PAUSED", "PLAYING", "DYING"]},
  {name: "Dir",   consts: ["UP", "DOWN","LEFT","RIGHT"]}
];
Snake.User = function (params) {

    var _score = 0,
        position = null,
		_currentDirection = null;
		_trail = null;

    function finished() {
        if (_score > bestScore()) {
            localStorage.bestScore = _score;
        }
    }

    function bestScore() {
      return parseInt(localStorage.bestScore || 0, 10);
    }
	function currentDirection() {
        return _currentDirection;
    }

    function score() {
        return _score;
    }

    function reset() {
        _score = 0;
        _trail = [[2,12],[3,12],[4,12]];
		position = [5,12];
		_direction = Snake.State.RIGHT;
    }

    function move(direction) {
		var oldposition = new Array();
		oldposition[0] = position[0];
		oldposition[1] = position[1];
		_trail.push(oldposition);
		var newposition = new Array();
		newposition[0] = position[0];
		newposition[1] = position[1];
		switch(direction)
		{
			case Snake.Dir.UP:
				newposition[1] = (( newposition[1] + gridHeight+1 )-1)%(gridHeight+1);
			  break;
			case Snake.Dir.DOWN:
			    newposition[1] = (( newposition[1] + gridHeight+1 )+1)%(gridHeight+1);
			  break;
			case Snake.Dir.LEFT:
			    newposition[0] = (( newposition[0] + gridWidth+1 )-1)%(gridWidth+1);
			  break;
			case Snake.Dir.RIGHT:
			    newposition[0] = (( newposition[0] + gridWidth+1 )+1)%(gridWidth+1);
			  break;
		}
		position[0] = newposition[0];
		position[1] = newposition[1];
        return newposition;
    }

    function trail() {
        return _trail;
    }
	function deletelasttrail(){
		_trail.shift();
	}
	
	function addScore(){
		_score++;
	}

    return {
        "reset":reset,
        "move":move,
        "finished":finished,
        "bestDistance":bestScore,
		"trail":trail,
		"deletelasttrail":deletelasttrail,
		"score":score,
		"addScore":addScore
    };
};
Snake.Food = function(){
	var _position;
	
	function position(){
		return _position;
	}
	
	function create(trail){
		var available = new Array();
		for (var i = 0; i < Snake.GRID.length; i++) {
			var grid_pos = Snake.GRID[i];
			var add = true;
			for (var j = 0; j < trail.length; j++) {
				var trail_pos = trail[j];
				if(grid_pos[0] == trail_pos[0] && grid_pos[1] == trail_pos[1]){
					add = false;
				}
			}
			if(add === true){
				available.push(grid_pos);
			}
		}
		var random = Math.floor(Math.random()*available.length);
		_position = available[random];
		
	}
	
	return{
		"position":position,
		"create":create
	};
}
Snake.Screen = function(width1,height1){

	var _width       = width1,
        _height      = height1;
	var squareHeight = (height()-100) / (gridHeight+1);
	var squareWidth = width() / (gridWidth +1);
	var image = new Image();
	image.src = 'photo.png';

    function width()  { return _width; }
    function height() { return _height; }

	function draw(ctx) {
        ctx.fillStyle = Snake.Color.BACKGROUND;
		ctx.fillRect(0, 0, _width, _height-100);
        ctx.fill();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, _height-100, _width, 100);
        ctx.fill();
    }
	function drawUser(ctx, user, pos,dead) {
		ctx.fillStyle="#00FF00";
		if(dead!=true){
			var a = pos[0] * squareWidth;
			var b = pos[1] * squareHeight;
			ctx.fillRect(a,b,squareWidth,squareHeight);
			//ctx.drawImage(image,a,b);
		}
		var trail = user.trail();
		for (var i = 0; i < trail.length; i++) {			
			var t_pos = trail[i];
			var c = t_pos[0] * squareWidth;
			var d = t_pos[1] * squareHeight;
			ctx.fillRect(c,d,squareWidth,squareHeight);
		}
    }

    function collided(pos, trail) {
		for (var i = 0; i < trail.length; i++) {
			var trail_pos = trail[i];
			if( pos[0] == trail_pos[0] && pos[1] == trail_pos[1]){
				return true;
			}
		}
		for (var i = 0; i < Snake.GRID.length; i++) {
			var grid_pos = Snake.GRID[i];
			if( pos[0] == grid_pos[0] && pos[1] == grid_pos[1]){
				return false;
			}
		}
		return true;
    }
	
	function drawFood(ctx,food){
		var pos = food.position();
		ctx.fillStyle="#FF0000";
		var a = pos[0] * squareWidth;
		var b = pos[1] * squareHeight;
		ctx.fillRect(a,b,squareWidth,squareHeight);
	}
	
	function drawScore(ctx,score){
		ctx.fillStyle = '#000000';
		ctx.font="16px Arial";
		var text = "Score:" + score;
		ctx.fillText(text, 20, 520);
	}
	
	function eat(pos,food_pos){
		if(pos[0] === food_pos[0] && pos[1] == food_pos[1]){
			return true;
		}
		else{
			return false;
		}
	}
	
	return {
        "draw":draw,
        "drawUser":drawUser,
		"drawFood":drawFood,
		"drawScore":drawScore,
        "collided":collided,
		"eat":eat,
        "width":width,
		"height":height
    };
}
var SNAKE = (function() {

    /* Generate Constants from Heli.Consts arrays */
    (function (glob, consts) {
        for (var x, i = 0; i < consts.length; i += 1) {
            glob[consts[i].name] = {};
            for (x = 0; x < consts[i].consts.length; x += 1) {
                glob[consts[i].name][consts[i].consts[x]] = x;
            }
        }
    })(Snake, Snake.Consts);
	
	var direction = null,
		state = Snake.State.WAITING,
		user = null,
		screen = null,
		ctx,
		timer = null;
	
	function keyDown(e) {
		switch(e.keyCode)
		{
			case KEY.ARROW_UP:
				if(direction != Snake.Dir.DOWN){ 
					direction = Snake.Dir.UP;
				}
			  break;
			case KEY.ARROW_DOWN:
				if(direction != Snake.Dir.UP){
					direction = Snake.Dir.DOWN;
				}
			  break;
			case KEY.ARROW_LEFT:
				if(direction != Snake.Dir.RIGHT){
					direction = Snake.Dir.LEFT;
				}
			  break;
			case KEY.ARROW_RIGHT:
				if(direction != Snake.Dir.LEFT){
					direction = Snake.Dir.RIGHT;
				}
			  break;
			case KEY.ENTER:
				if (state === Snake.State.WAITING)
				{
					newGame();
				}
			 break;
			case KEY.P:
				if(state === Snake.State.PLAYING){
					pauseGame();
				}
			  break;
			case KEY.R:
				if(state === Snake.State.WAITING){
					resumeGame();
				}
			  break;
			default:
			  break;
		 }
    }
	
	function newGame() {
        if (state != Snake.State.PLAYING) {
            user.reset();
			food.create(user.trail());
            state = Snake.State.PLAYING;
			direction = Snake.Dir.RIGHT;
			timer = window.setInterval(mainLoop, 1000/Snake.FPS);
			//mainLoop();
        }
    }
	
	function pauseGame(){
		clearTimeout(timer);
		state = Snake.State.WAITING;
	}
	
	function resumeGame(){
		timer = window.setInterval(mainLoop, 1000/Snake.FPS);
		state = Snake.State.PLAYING;
	}
	
	function mainLoop() {

        if (state === Snake.State.PLAYING) {

            pos = user.move(direction);
            screen.draw(ctx);
			
			var eaten = screen.eat(pos,food.position());
			if(eaten === true){
				user.addScore();
				food.create(user.trail());
			}

            var tmp = screen.collided(pos, user.trail());
            if (tmp !== false) {
                if (tmp !== true) {
                    pos = tmp;
                }
                state = Snake.State.DYING;
                user.finished();
            }
			else if(eaten === false){
				user.deletelasttrail();
			}
			screen.drawUser(ctx, user, pos,tmp);
			screen.drawFood(ctx,food);
			screen.drawScore(ctx,user.score());

        }
    }
	
	function init(wrapper){
		var width  = wrapper.offsetWidth,
            height = wrapper.offsetHeight,
			canvas = document.getElementById("canvas");
			
		ctx = canvas.getContext('2d');
		screen = new Snake.Screen(width,height);
        user = new Snake.User();
		food = new Snake.Food();
		loaded();
	}
	
	function startScreen() {

        screen.draw(ctx);

        x = screen.width() / 2,
        y = screen.height() / 3;
		ctx.fillStyle = '#FFFFFF';
		ctx.font="30px Arial";
		ctx.fillText("press enter to start", 120, 200);
    }


    function loaded() {
        document.addEventListener("keydown", keyDown, true);
        startScreen();
    }

    return {
        "init" : init
    };
}());