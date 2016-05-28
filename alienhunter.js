var WIDTH = 450;
var HEIGHT = 450;
var SCALE = 1;
var DIM = 16;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = SCALE;
stage.scale.y = SCALE;

//Different screne containers
var menu = new PIXI.Container();
var game = new PIXI.Container();
var instructions = new PIXI.Container();
var credits = new PIXI.Container();
var lasers = new PIXI.Container();
var monsters = new PIXI.Container();

// Scene objects get loaded in the ready function
    var title_text;
    var game_button;
    var controls_button;
    var credits_button;
    var menu_button;
    
    var player;       
    var monster;
     /* ['jackchar1.png','jackchar2.png','jackchar3.png'];
        var mov_up = ['jackchar4.png','jackchar5.png','jackchar6.png'];
        var move_right = ['jackchar7.png','jackchar8.png'];
        var move_left = ['jackchar9.png','jackchar10.png'];*/
        
    var world;
    var water;
    var collisionindex = [];
    
    var objective_text;
    var controls_text;
    
    var credits_text;
    var author_text;

    var lazershot;
    var startupgame;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
    .add('map.json')
    .add('tileset.png')
    .add('player_assests.json')
    .add('monster_assests.json')
    .add('tiles_lazershot.mp3')
    .add('tiles_startupgame.mp3')
    .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);

  
  //MENU SCREEN SETUP
      title_text = new PIXI.Text("Alien Hunter");
      title_text.position.x = 125;
      title_text.position.y = 50;
      title_text.anchor.x = 0;
      title_text.anchor.y = 1;
      
      game_button = new PIXI.Sprite(PIXI.Texture.fromImage("game_button.png"));
      game_button.position.x = 150;
      game_button.position.y = 150;
      game_button.anchor.x = 0;
      game_button.anchor.y = 1;
      
      controls_button = new PIXI.Sprite(PIXI.Texture.fromImage("control_button.png"));
      controls_button.position.x = 150;
      controls_button.position.y = 250;
      controls_button.anchor.x = 0;
      controls_button.anchor.y = 1;
      
      credits_button = new PIXI.Sprite(PIXI.Texture.fromImage("credits_botton.png"));
      credits_button.position.x = 150;
      credits_button.position.y = 350;
      credits_button.anchor.x = 0;
      credits_button.anchor.y = 1;
      
    //GAME SCREEN SETUP
      //setting up world map
      var tu = new TileUtilities(PIXI);
      world = tu.makeTiledWorld("map.json", "tileset.png");
      
      //setting up player
      var move = [];
      move.push(PIXI.Texture.fromFrame('jackchar1.png'));
      move.push(PIXI.Texture.fromFrame('jackchar2.png'));
      move.push(PIXI.Texture.fromFrame('jackchar3.png'));
      player = new PIXI.extras.MovieClip(move);
      player.animationSpeed = 0.1; 
      player.gx = 9;
      player.gy = 5;
      player.x = player.gx*DIM;
      player.y = player.gy*DIM;
      player.position.x = 15;
      player.position.y = 50;
      player.anchor.x = 0;
      player.anchor.y = 1;
      
      var monster_move = [];
      monster_move.push(PIXI.Texture.fromFrame("slime1.png"));
      monster_move.push(PIXI.Texture.fromFrame("slime2.png"));
      monster_move.push(PIXI.Texture.fromFrame("slime3.png"));
      monster_move.push(PIXI.Texture.fromFrame("slime4.png"));      
      
      monster = new PIXI.extras.MovieClip(monster_move);
      monster.animationSpeed =0.25;
      monster.position.x = 375;
      monster.position.y = 435;
      monster.anchor.x = 0;
      monster.anchor.y = 1;
      monsters.addChild(monster);
      
      monster1 = new PIXI.extras.MovieClip(monster_move);
      monster1.animationSpeed =0.25;
      monster1.position.x = 375;
      monster1.position.y = 400
      monster1.anchor.x = 0;
      monster1.anchor.y = 1;
      monsters.addChild(monster1);
      
      monster2 = new PIXI.extras.MovieClip(monster_move);
      monster2.animationSpeed =0.25;
      monster2.position.x = 375;
      monster2.position.y = 365;
      monster2.anchor.x = 0;
      monster2.anchor.y = 1;
      monsters.addChild(monster2);
      
      monster3 = new PIXI.extras.MovieClip(monster_move);
      monster3.animationSpeed =0.25;
      monster3.position.x = 375;
      monster3.position.y = 330;
      monster3.anchor.x = 0;
      monster3.anchor.y = 1;
      monsters.addChild(monster3);
      
      lazershot = PIXI.audioManager.getAudio('tiles_lazershot.mp3');
      startupgame = PIXI.audioManager.getAudio('tiles_startupgame.mp3');
      
      //var mov_up = ['jackchar4.png','jackchar5.png','jackchar6.png'];
      //var move_right = ['jackchar7.png','jackchar8.png'];
      //var move_left = ['jackchar9.png','jackchar10.png'];
      
    //INSTRUCTION SCREEN SETUP
      objective_text = new PIXI.Text("\tGoal:    \n\t\t\t\t Shoot all the aliens with your\n \t\t\t\tlazer gun to win the game! \n\t\t\t\t Do it before they reach the town!");
      objective_text.position.x = 200;
      objective_text.position.y = 150;
      objective_text.anchor.x = 0.5;
      objective_text.anchor.y = 0.5;
      objective_text.scale.x = .75;
      objective_text.scale.y = .75; 
      
      controls_text = new PIXI.Text("\tControls:    \n\t\t\t\tTo move: use WASD\n\t\t\t To shoot: spacebar\n");
      controls_text.position.x = 200;
      controls_text.position.y = 250;
      controls_text.anchor.x = 0.5;
      controls_text.anchor.y = 0.5;
      controls_text.scale.x = .75;
      controls_text.scale.y = .75; 
      
    //CREDITS SCREEN SETUP
      menu_button = new PIXI.Sprite(PIXI.Texture.fromImage("menu_button.png"));
      menu_button.position.x = 150;
      menu_button.position.y = 350;
      menu_button.anchor.x = 0;
      menu_button.anchor.y = 1;
      menu_button.scale.x = 1;
      menu_button.scale.y = 1; 
      
      credits_text = new PIXI.Text("All design aspects are made by:\n Jack Jenkins");
      credits_text.position.x = 200;
      credits_text.position.y = 150;
      credits_text.anchor.x = 0.5;
      credits_text.anchor.y = 0.5;
      credits_text.scale.x = .75;
      credits_text.scale.y = .75; 

    player.direction = MOVE_NONE;
    player.moving = false;
  
  //start at the main menu
  mainmenuScreen();
  animate();
}
	/*
  // Find the entity layer
  var entities = world.getObject("Entities");
  entities.addChild(player);

  water = world.getObject("Water").data;
	*/
/*
//spawn monsters
function spawnMonsters(){    
    
    for (var i=0;i<31;i++){
        
        monster = new PIXI.extras.MovieClip(clip);
        
        monster.position.x = Math.round((Math.random()*(WIDTH-3*40)+40)/40)*40;
        monster.position.y = Math.round((Math.random()*(HEIGHT-3*40)+40)/40)*40;
        monster.anchor.x = 0.5;
        monster.anchor.y = 0.5;
                      
    }
    monsters.addChild(monster);
};
*/
function shoot(){
    var projectile = new PIXI.Sprite(PIXI.Texture.fromImage("laser.png"));
    projectile.anchor.x =0.5;
    projectile.anchor.y = 0.5;
    projectile.position.x = player.position.x;
    projectile.position.y = player.position.y;
    projectile.scale.x = 3;
    projectile.scale.y =3;
    
    lasers.addChild(projectile);
    lazershot.play();
    createjs.Tween.get(projectile.position).to({x: projectile.position.x + 10, y: 500}, 1000).call(move);
}

function check_impact(){
    var all_monsters = monsters.children;
    var all_lasers = lasers.children;
    var monster;
    
    for (var i=0; i<all_monsters.length; i++) {
		monster = all_monsters[i];
		monster.rotation += 0.01;
		for (var j=0; j<all_lasers.length; j++) {
			if ((game.toGlobal(monster.position).x-game.toGlobal(all_lasers[j].position).x) >= laser.width +all_lasers[j].width 
			&& (game.toGlobal(laser.position).y-game.toGlobal(all_lasers[j].position).y) <= laser.height +all_lasers[j].height) {
				monsters.removeChild(monster);
				lasers.removeChild(all_lasers[j]);
			};
		};
    };
    
    //check for lasers going out of bounds
    for (var i=0;i<all_lasers.length; i++){
        if (all_lasers[i].toGlobal(gameContainer.position).x < -1 
        ||  all_lasers[i].toGlobal(gameContainer.position).x > WIDTH 
        ||  all_lasers[i].toGlobal(gameContainer.position).y < -1 
        ||  all_lasers[i].toGlobal(gameContainer.position).y > HEIGHT) {
			lasers.removeChild(all_lasers[i]);
        };
    };	
    //check for lasers hitting monsters
    for (var i=0;i<all_lasers.length; i++){
        if(projectile.position.x === monster.position.x || projectile.position.y === monster.position.y){
                lasers.removeChild(all_lasers[i]);
        };  
    };
			
    //was going to add more functionality for lasers dissapearing if hitting trees and houses
}


// The move function starts or continues movement
function move() {
    
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    return;
  }

  var dx = 0;
  var dy = 0;

  if (player.direction == MOVE_LEFT){
    dx -= 1;
  } 
  if (player.direction == MOVE_RIGHT){
    dx += 1;
  }
  if (player.direction == MOVE_UP){
    dy -= 1; 
  } 
  if (player.direction == MOVE_DOWN){
    dy += 1;
  }
  
   /*
  if (water[(player.gy+dy-1)*12 + (player.gx+dx)] != 0) {
    player.moving = false;
    return;
  }
    */
    
  player.gx += dx;
  player.gy += dy;

  player.moving = true;
  player.play()
  createjs.Tween.get(player).to({x: player.gx*DIM, y: player.gy*DIM}, 250).call(move);
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;
  
  player.direction = MOVE_NONE;

  if (e.keyCode == 87){
    player.direction = MOVE_UP;
    }
  else if (e.keyCode == 83){
    player.direction = MOVE_DOWN;
    }
  else if (e.keyCode == 65){
    player.direction = MOVE_LEFT;
    }
  else if (e.keyCode == 68){
    player.direction = MOVE_RIGHT;
    }
  else if (e.keyCode == 32){
    shoot();
    }   
  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
  player.stop();
});

function animate(timestamp) {
	requestAnimationFrame(animate);
	update_camera();
	renderer.render(stage);
}

//shows main menu
var mainmenuScreen = function(){
    cleanScreen();
    //add main menu to the stage(screen)
    stage.addChild(menu);
    
    //populate the main menu
    menu.addChild(title_text);
    menu.addChild(game_button);
    menu.addChild(controls_button);
    menu.addChild(credits_button);
    
    //button interactions, go to different screens on click
    game_button.interactive = true;
    game_button.on('mousedown', playScreen);
    controls_button.interactive = true;
    controls_button.on('mousedown', instructionsScreen);
    credits_button.interactive = true;
    credits_button.on('mousedown', creditsScreen);
}
//plays the game
var playScreen = function(){
    cleanScreen();
    
    //add game to the stage(screen)
    stage.addChild(game);
    
    stage.scale.x = SCALE;
    stage.scale.y = SCALE;
    
    //populate the game
    game.addChild(world);
    game.addChild(player);
    game.addChild(monsters);
    game.addChild(lasers);
    
    startupgame.play();
}

var instructionsScreen = function(){
    cleanScreen();
    
    //add instructions to the stage(screen)
    stage.addChild(instructions);
    
    instructions.addChild(objective_text);
    instructions.addChild(controls_text);
    instructions.addChild(menu_button);
    
    //button interaction, go to menu screen on click
    menu_button.interactive = true;
    menu_button.on('mousedown', mainmenuScreen);
}

var creditsScreen = function(){
    cleanScreen();
    
    //add credits to the stage(screen)
    stage.addChild(credits);
    
    //populate Credits screen
    credits.addChild(credits_text);
    credits.addChild(menu_button);
    
    //button interaction, go to menu screen on click
    menu_button.interactive = true;
    menu_button.on('mousedown', mainmenuScreen);
}

//helper function to clean stage
var cleanScreen = function(){
    stage.removeChild(game);
    stage.removeChild(instructions);
    stage.removeChild(credits);
    stage.removeChild(menu);    
}

function update_camera() {
  stage.x = -player.x*SCALE + WIDTH/2 - player.width/2*SCALE;
  stage.y = -player.y*SCALE + HEIGHT/2 + player.height/2*SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*SCALE - WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*SCALE - HEIGHT, -stage.y));
}
