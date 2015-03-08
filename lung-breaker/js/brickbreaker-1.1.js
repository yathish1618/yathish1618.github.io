/**
 * @fileoverview JavaScript for the Brick Breaker game.
 * @author Jesse L. Palmer
 */

/**
 * Uses the Modernizr library to test if the broswer supports Canvas.
 * @return {boolean} Returns true if Canvas is supported by the broswer.
 */
function canvasSupport() {
    'use strict';
    return Modernizr.canvas;
}

/**
* The code for the application.
*
*/
function canvasApp() {
    'use strict';

    if (!canvasSupport) {
        return;
    }

    var DELAY_TIME = 5,
        SCREEN_WIDTH = 500,
        SCREEN_HEIGHT = 500,
        SCREEN_X1 = 0,
        SCREEN_Y1 = 0,
        SCREEN_X2 = SCREEN_WIDTH,
        SCREEN_Y2 = SCREEN_HEIGHT,
        SCREEN_COLOR = '#000',
        TEXT_COLOR = '#fff',
        STATUS_BAR_Y_OFFSET = 40,
        BRICK_ROWS = 35,
        BRICKS_PER_ROW = 66,
        BRICK_WIDTH = 5,
        BRICK_HEIGHT = 5,
        BRICK_OFFSET = 2.5,
        canvas = document.getElementById('game'),
        context = canvas.getContext('2d'),
        windowWidth = document.body.offsetWidth,
        windowHeight = document.body.offsetHeight,
        paddle = null,
		paddle1 = null,
        ball = null,
        bricks = [],
        score = 0,
        highScores = [],
        bricksRemaining = BRICK_ROWS * BRICKS_PER_ROW,
        turns = 3,
        level = 1,
        gameStatus = 'start',
        continueGame = null;

    /**
     * A Paddle.
     * @constructor
     */
    function Paddle() {
        this.width = 100;
        this.height = 10;
        this.offset = this.height;
        this.color = '#fff';
        this.x1 = (SCREEN_WIDTH - this.width) / 2;
        this.y1 = SCREEN_HEIGHT - this.offset;
        this.x2 = this.x1 + this.width;
        this.y2 = this.y1 + this.height;
    }
	/** Paddle1 as Paddle butt (another rectangle) */
	function Paddle1(){
		this.width = 20;
        this.height = 10;
        this.offset = this.height;
        this.color = '#F9AC62';
        this.x1 = (SCREEN_WIDTH - this.width) / 2 - paddle.width/2;
        this.y1 = SCREEN_HEIGHT - this.offset;
        this.x2 = this.x1 + this.width;
        this.y2 = this.y1 + this.height;
	}

    /**
     * A Ball.
     * @constructor
     */
    function Ball() {
        this.color = '#ff0000';
        this.radius = 6;
        this.cx = SCREEN_WIDTH / 2;
        this.cy = SCREEN_HEIGHT / 2;
        this.x1 = this.cx - this.radius;
        this.y1 = this.cy - this.radius;
        this.x2 = this.x1 + this.radius;
        this.y2 = this.y1 + this.radius;
        var ballVelocity = 1,
            getRandomXVelocity = function() {
                var randomNumber = Math.random();
                if (randomNumber > 0.5) {
                    return ballVelocity;
                }
                return ballVelocity * -1;
            };
        this.velocityx = getRandomXVelocity();
        this.velocityy = ballVelocity;
    }

    /**
     * Builds a rectangle of bricks.
     * @param {array} colors is an array of colors.
     */
    function drawRectangle(colors) {
        var i,
            j,
            brickNum = 0,
            brickY = BRICK_OFFSET,
            brickX = 0,
            brick = null;
			var arr2 = [[0,30],[0,31],[0,32],[0,33],[1,30],[1,31],[1,32],[1,33],[2,30],[2,31],[2,32],[2,33],[3,30],[3,31],[3,32],[3,33],[4,30],[4,31],[4,32],[4,33],[5,30],[5,31],[5,32],[5,33],[6,30],[6,31],[6,32],[6,33],[7,22],[7,23],[7,24],[7,25],[7,26],[7,30],[7,31],[7,32],[7,33],[7,37],[7,38],[7,39],[7,40],[7,41],[8,20],[8,21],[8,22],[8,23],[8,24],[8,25],[8,26],[8,27],[8,30],[8,31],[8,32],[8,33],[8,36],[8,37],[8,38],[8,39],[8,40],[8,41],[8,42],[8,43],[9,19],[9,20],[9,21],[9,22],[9,23],[9,24],[9,25],[9,26],[9,27],[9,30],[9,31],[9,32],[9,33],[9,36],[9,37],[9,38],[9,39],[9,40],[9,41],[9,42],[9,43],[9,44],[10,18],[10,19],[10,20],[10,21],[10,22],[10,23],[10,24],[10,25],[10,26],[10,27],[10,28],[10,30],[10,31],[10,32],[10,33],[10,35],[10,36],[10,37],[10,38],[10,39],[10,40],[10,41],[10,42],[10,43],[10,44],[10,45],[11,18],[11,19],[11,20],[11,21],[11,22],[11,23],[11,24],[11,25],[11,26],[11,27],[11,28],[11,30],[11,31],[11,32],[11,33],[11,35],[11,36],[11,37],[11,38],[11,39],[11,40],[11,41],[11,42],[11,43],[11,44],[11,45],[12,17],[12,18],[12,19],[12,20],[12,21],[12,22],[12,23],[12,24],[12,25],[12,26],[12,27],[12,28],[12,30],[12,31],[12,32],[12,33],[12,35],[12,36],[12,37],[12,38],[12,39],[12,40],[12,41],[12,42],[12,43],[12,44],[12,45],[12,46],[13,16],[13,17],[13,18],[13,19],[13,20],[13,21],[13,22],[13,23],[13,24],[13,25],[13,26],[13,27],[13,28],[13,30],[13,31],[13,32],[13,33],[13,35],[13,36],[13,37],[13,38],[13,39],[13,40],[13,41],[13,42],[13,43],[13,44],[13,45],[13,46],[13,47],[14,15],[14,16],[14,17],[14,18],[14,19],[14,20],[14,21],[14,22],[14,23],[14,24],[14,25],[14,26],[14,27],[14,28],[14,29],[14,30],[14,31],[14,32],[14,33],[14,34],[14,35],[14,36],[14,37],[14,38],[14,39],[14,40],[14,41],[14,42],[14,43],[14,44],[14,45],[14,46],[14,47],[14,48],[15,15],[15,16],[15,17],[15,18],[15,19],[15,20],[15,21],[15,22],[15,23],[15,24],[15,25],[15,26],[15,27],[15,28],[15,29],[15,30],[15,31],[15,32],[15,33],[15,34],[15,35],[15,36],[15,37],[15,38],[15,39],[15,40],[15,41],[15,42],[15,43],[15,44],[15,45],[15,46],[15,47],[15,48],[16,14],[16,15],[16,16],[16,17],[16,18],[16,19],[16,20],[16,21],[16,22],[16,23],[16,24],[16,25],[16,26],[16,27],[16,28],[16,29],[16,30],[16,31],[16,32],[16,33],[16,34],[16,35],[16,36],[16,37],[16,38],[16,39],[16,40],[16,41],[16,42],[16,43],[16,44],[16,45],[16,46],[16,47],[16,48],[16,49],[17,14],[17,15],[17,16],[17,17],[17,18],[17,19],[17,20],[17,21],[17,22],[17,23],[17,24],[17,25],[17,26],[17,27],[17,28],[17,29],[17,30],[17,33],[17,34],[17,35],[17,36],[17,37],[17,38],[17,39],[17,40],[17,41],[17,42],[17,43],[17,44],[17,45],[17,46],[17,47],[17,48],[17,49],[18,14],[18,15],[18,16],[18,17],[18,18],[18,19],[18,20],[18,21],[18,22],[18,23],[18,24],[18,25],[18,26],[18,27],[18,28],[18,35],[18,36],[18,37],[18,38],[18,39],[18,40],[18,41],[18,42],[18,43],[18,44],[18,45],[18,46],[18,47],[18,48],[18,49],[19,13],[19,14],[19,15],[19,16],[19,17],[19,18],[19,19],[19,20],[19,21],[19,22],[19,23],[19,24],[19,25],[19,26],[19,27],[19,28],[19,35],[19,36],[19,37],[19,38],[19,39],[19,40],[19,41],[19,42],[19,43],[19,44],[19,45],[19,46],[19,47],[19,48],[19,49],[19,50],[20,13],[20,14],[20,15],[20,16],[20,17],[20,18],[20,19],[20,20],[20,21],[20,22],[20,23],[20,24],[20,25],[20,26],[20,27],[20,28],[20,35],[20,36],[20,37],[20,38],[20,39],[20,40],[20,41],[20,42],[20,43],[20,44],[20,45],[20,46],[20,47],[20,48],[20,49],[20,50],[21,13],[21,14],[21,15],[21,16],[21,17],[21,18],[21,19],[21,20],[21,21],[21,22],[21,23],[21,24],[21,25],[21,26],[21,27],[21,28],[21,35],[21,36],[21,37],[21,38],[21,39],[21,40],[21,41],[21,42],[21,43],[21,44],[21,45],[21,46],[21,47],[21,48],[21,49],[21,50],[22,13],[22,14],[22,15],[22,16],[22,17],[22,18],[22,19],[22,20],[22,21],[22,22],[22,23],[22,24],[22,25],[22,26],[22,27],[22,28],[22,35],[22,36],[22,37],[22,38],[22,39],[22,40],[22,41],[22,42],[22,43],[22,44],[22,45],[22,46],[22,47],[22,48],[22,49],[22,50],[23,13],[23,14],[23,15],[23,16],[23,17],[23,18],[23,19],[23,20],[23,21],[23,22],[23,23],[23,24],[23,25],[23,26],[23,27],[23,28],[23,35],[23,36],[23,37],[23,38],[23,39],[23,40],[23,41],[23,42],[23,43],[23,44],[23,45],[23,46],[23,47],[23,48],[23,49],[23,50],[24,13],[24,14],[24,15],[24,16],[24,17],[24,18],[24,19],[24,20],[24,21],[24,22],[24,23],[24,24],[24,25],[24,26],[24,27],[24,28],[24,35],[24,36],[24,37],[24,38],[24,39],[24,40],[24,41],[24,42],[24,43],[24,44],[24,45],[24,46],[24,47],[24,48],[24,49],[24,50],[25,12],[25,13],[25,14],[25,15],[25,16],[25,17],[25,18],[25,19],[25,20],[25,21],[25,22],[25,23],[25,24],[25,25],[25,26],[25,27],[25,28],[25,35],[25,36],[25,37],[25,38],[25,39],[25,40],[25,41],[25,42],[25,43],[25,44],[25,45],[25,46],[25,47],[25,48],[25,49],[25,50],[25,51],[26,12],[26,13],[26,14],[26,15],[26,16],[26,17],[26,18],[26,19],[26,20],[26,21],[26,22],[26,23],[26,24],[26,25],[26,26],[26,27],[26,28],[26,35],[26,36],[26,37],[26,38],[26,39],[26,40],[26,41],[26,42],[26,43],[26,44],[26,45],[26,46],[26,47],[26,48],[26,49],[26,50],[26,51],[27,12],[27,13],[27,14],[27,15],[27,16],[27,17],[27,18],[27,19],[27,20],[27,21],[27,22],[27,23],[27,24],[27,25],[27,26],[27,27],[27,28],[27,35],[27,36],[27,37],[27,38],[27,39],[27,40],[27,41],[27,42],[27,43],[27,44],[27,45],[27,46],[27,47],[27,48],[27,49],[27,50],[27,51],[28,12],[28,13],[28,14],[28,15],[28,16],[28,17],[28,18],[28,19],[28,20],[28,21],[28,22],[28,23],[28,24],[28,25],[28,26],[28,27],[28,36],[28,37],[28,38],[28,39],[28,40],[28,41],[28,42],[28,43],[28,44],[28,45],[28,46],[28,47],[28,48],[28,49],[28,50],[28,51],[29,12],[29,13],[29,14],[29,15],[29,16],[29,17],[29,18],[29,19],[29,20],[29,21],[29,22],[29,23],[29,24],[29,25],[29,26],[29,27],[29,36],[29,37],[29,38],[29,39],[29,40],[29,41],[29,42],[29,43],[29,44],[29,45],[29,46],[29,47],[29,48],[29,49],[29,50],[29,51],[30,12],[30,13],[30,14],[30,15],[30,16],[30,17],[30,18],[30,19],[30,20],[30,21],[30,22],[30,23],[30,24],[30,25],[30,26],[30,27],[30,36],[30,37],[30,38],[30,39],[30,40],[30,41],[30,42],[30,43],[30,44],[30,45],[30,46],[30,47],[30,48],[30,49],[30,50],[30,51],[31,12],[31,13],[31,14],[31,15],[31,16],[31,17],[31,18],[31,19],[31,21],[31,22],[31,23],[31,24],[31,25],[31,26],[31,37],[31,38],[31,39],[31,40],[31,41],[31,42],[31,44],[31,45],[31,46],[31,47],[31,48],[31,49],[31,50],[31,51],[32,12],[32,13],[32,14],[32,15],[32,16],[32,17],[32,19],[32,22],[32,24],[32,25],[32,26],[32,37],[32,38],[32,39],[32,41],[32,44],[32,46],[32,47],[32,48],[32,49],[32,50],[32,51],[33,12],[33,13],[33,14],[33,15],[33,20],[33,24],[33,39],[33,43],[33,48],[33,49],[33,50],[33,51],[34,13],[34,14],[34,15],[34,48],[34,49],[34,50],[35,15],[35,48]];

// accessing the first element in the second array
alert(arr2[1][1]);        // free courses

// modify the value of the first entry in the second array, in "arr2"
//arr2[1] = 'json tutorial';
var tempi;
var tempj;
        for (i = 0; i < BRICK_ROWS; i += 1) {
            brickX = BRICK_OFFSET;
			tempi = i;
            for (j = 0; j < BRICKS_PER_ROW; j += 1) {
				tempj = j;
				var tempy = arr2[tempi][tempj];
				tempy[tempi] = 
				if ( for(t=0; t<=821; t++){
					arr2[t] = 
				}
				
				tempy!=""
				/* This is data for displaying specific bricks for the shape of lungs */
				/*(i==0&&(j==30||j==31||j==32||j==33))||(i==1&&(j==30||j==31||j==32||j==33))||(i==2&&(j==30||j==31||j==32||j==33))||(i==3&&(j==30||j==31||j==32||j==33))||(i==4&&(j==30||j==31||j==32||j==33))||(i==5&&(j==30||j==31||j==32||j==33))||(i==6&&(j==30||j==31||j==32||j==33))||(i==7&&(j==22||j==23||j==24||j==25||j==26||j==30||j==31||j==32||j==33||j==37||j==38||j==39||j==40||j==41))||(i==8&&(j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==30||j==31||j==32||j==33||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43))||(i==9&&(j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==30||j==31||j==32||j==33||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44))||(i==10&&(j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==30||j==31||j==32||j==33||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45))||(i==11&&(j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==30||j==31||j==32||j==33||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45))||(i==12&&(j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==30||j==31||j==32||j==33||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46))||(i==13&&(j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==30||j==31||j==32||j==33||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47))||(i==14&&(j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==29||j==30||j==31||j==32||j==33||j==34||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48))||(i==15&&(j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==29||j==30||j==31||j==32||j==33||j==34||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48))||(i==16&&(j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==29||j==30||j==31||j==32||j==33||j==34||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49))||(i==17&&(j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==29||j==30||j==33||j==34||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49))||(i==18&&(j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49))||(i==19&&(j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50))||(i==20&&(j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50))||(i==21&&(j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50))||(i==22&&(j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50))||(i==23&&(j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50))||(i==24&&(j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50))||(i==25&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==26&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==27&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==28||j==35||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==28&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==29&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==30&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==20||j==21||j==22||j==23||j==24||j==25||j==26||j==27||j==36||j==37||j==38||j==39||j==40||j==41||j==42||j==43||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==31&&(j==12||j==13||j==14||j==15||j==16||j==17||j==18||j==19||j==21||j==22||j==23||j==24||j==25||j==26||j==37||j==38||j==39||j==40||j==41||j==42||j==44||j==45||j==46||j==47||j==48||j==49||j==50||j==51))||(i==32&&(j==12||j==13||j==14||j==15||j==16||j==17||j==19||j==22||j==24||j==25||j==26||j==37||j==38||j==39||j==41||j==44||j==46||j==47||j==48||j==49||j==50||j==51))||(i==33&&(j==12||j==13||j==14||j==15||j==20||j==24||j==39||j==43||j==48||j==49||j==50||j==51))||(i==34&&(j==13||j==14||j==15||j==48||j==49||j==50))||(i==35&&(j==15||j==48))*/
				){
					brick = {
                    x1: brickX,
                    y1: brickY,
                    x2: brickX + BRICK_WIDTH,
                    y2: brickY + BRICK_HEIGHT,
                    visible: true,
					color: colors[i]
                };
				}
				else {
				brick = {
                    x1: brickX,
                    y1: brickY,
                    x2: brickX + BRICK_WIDTH,
                    y2: brickY + BRICK_HEIGHT,
                    visible: false,
                    color: colors[i]
                };}
                bricks[brickNum] = brick;
                brickX += BRICK_WIDTH + BRICK_OFFSET;
                brickNum += 1;
            }
            brickY += BRICK_HEIGHT + BRICK_OFFSET;
        }
    }

    /**
     * Builds a triangle of bricks.
     * @param {array} colors is an array of colors.
     */
    /*function drawTriangle(colors) {
        var i = 0,
            j = 0,
            brickNum = 0,
            brickY = BRICK_OFFSET,
            bricksPerRow = 3,
            brickX,
            brick = null;
        for (i = 0; i < BRICK_ROWS; i += 1) {
            brickX = BRICK_OFFSET;
            for (j = 0; j < bricksPerRow; j += 1) {
                brick = {
                    x1: brickX,
                    y1: brickY,
                    x2: brick.x1 + BRICK_WIDTH,
                    y2: brick.x1 + BRICK_HEIGHT,
                    visible: true,
                    color: colors[i]
                };
                bricks[brickNum] = brick;
                brickX += BRICK_WIDTH + BRICK_OFFSET;
                brickNum += 1;
            }
            brickY += BRICK_HEIGHT + BRICK_OFFSET;
        }
    }*/

    /**
     * Updates the window parameters in case users resize the screen.
     */
    function updateWindowParameters() {
        windowWidth = document.body.offsetWidth;
        windowHeight = document.body.offsetHeight;
    }

    /**
     * Updates the window parameters in case users resize the screen.
     * @return {boolean} Returns true if the window width is greater than the
     * screen width.
     */
    function isWindowIsLargerThanScreen() {
        return (windowWidth > SCREEN_WIDTH);
    }

    /**
     * Moves the paddle depending on the position of the cursor.
     * @param {Object} e contains the location of the cursor.
     */
    function movePaddle(e) {
        var xOffset = 0,
            wallOffset = 1;

        updateWindowParameters();

        if (isWindowIsLargerThanScreen()) {
            xOffset = (windowWidth - SCREEN_WIDTH) / 2;
        }

        paddle.x2 = paddle.x1 + paddle.width;
        if ((paddle.x1 >= SCREEN_X1) && (paddle.x2 <= SCREEN_X2)) {
            paddle.x1 = e.pageX - (paddle.width / 2) - xOffset;
            if (paddle.x1 <= 0) {
                paddle.x1 = 1;
            } else if (paddle.x1 >= SCREEN_X2 - paddle.width) {
                paddle.x1 = SCREEN_X2 - paddle.width - wallOffset;
            }
        }
    }

	function movePaddle1(e) {
        var xOffset = -paddle.width/2,
            wallOffset = 1;

        updateWindowParameters();

        if (isWindowIsLargerThanScreen()) {
            xOffset = (windowWidth - SCREEN_WIDTH) / 2;
        }
		var paddle2 = paddle1.x1 - paddle.width/2;
        paddle1.x2 = paddle1.x1 + paddle1.width;
        if ((paddle1.x1 >= SCREEN_X1) && (paddle1.x2 <= SCREEN_X2)) {
            paddle1.x1 = e.pageX - (paddle.width / 2) - xOffset;
            if (paddle1.x1 <= 0) {
                paddle1.x1 = 1;
            } else if (paddle1.x1 >= SCREEN_X2 - paddle.width) {
                paddle1.x1 = SCREEN_X2 - paddle.width - wallOffset;
            }
        }
    }
    /**
     * This function is run when a player loses a turn.
     */
    function loseTurn() {
        turns -= 1;
        ball = new Ball();
    }

    /**
     * Checks to see if the ball has collided with the wall.
     */
    function wallCollisionCheck() {
        if ((ball.x1 <= SCREEN_X1) || (ball.x2 >= SCREEN_X2)) {
            ball.velocityx = -ball.velocityx;
        } else if ((ball.y1 <= SCREEN_Y1)) {
            ball.velocityy = -ball.velocityy;
            ball.cy += 2;
        } else if (ball.y2 >= SCREEN_Y2) {
            ball.velocityy = -ball.velocity;
            loseTurn();
        }
    }

    /**
     * Checks to see if the ball has collided with the paddle.
     */
    function paddleCollisionCheck() {
        if (isCollidingRightLeft(ball, paddle)) {
            ball.velocityx = -ball.velocityx;
        } else if (isCollidingTopBottom(ball, paddle)) {
            ball.velocityy = -ball.velocityy;
            ball.cy -= 2;
        }
    }

    /**
     * Checks to see if the ball has collided with the brick.
     */
    function brickCollisionCheck() {
        var i,
            length = bricks.length;

        for (i = 0; i < length; i += 1) {
            if (bricks[i].visible === true) {
                if (isColliding(ball, bricks[i])) {
                    bricks[i].visible = false;
                    score += 100;
                    bricksRemaining -= 1;
                    ball.velocityy = -ball.velocityy;
                    ball.cy -= 2;
                }
            }
        }
    }

    /**
     * Function moves the ball.
     */
    function moveBall() {
        ball.cx += ball.velocityx;
        ball.cy += ball.velocityy;
        ball.x1 = ball.cx - ball.radius;
        ball.y1 = ball.cy - ball.radius;
        ball.x2 = ball.cx + ball.radius;
        ball.y2 = ball.cy + ball.radius;
        wallCollisionCheck();
        paddleCollisionCheck();
        brickCollisionCheck();
    }

    /**
     * Inserts the final score into web storage.
     */
    function setScore() {
        localStorage.setItem(localStorage.length, score);
    }

    /**
     * Sets the high scores.
     */
    function setHighScores() {
        var i,
            length = localStorage.length,
            scores = [];

        scores[0] = 0;
        scores[1] = 0;
        scores[2] = 0;
        scores[3] = 0;

        for (i = 0; i < length; i += 1) {
            scores[i] = parseInt(localStorage.getItem(i), 10);
        }
        highScores = scores.sort(function(a, b) {
            return b - a;
        });
    }

    /**
     * Function that needs to be run to end the game.
     */
    function endGame() {
        gameStatus = 'gameover';
        setScore();
        setHighScores();
    }

    /**
     * Displays the winning screen.
     */
    function winningScreen() {
        endGame();
    }

    /**
     * Displays the losing screen.
     */
    function losingScreen() {
        endGame();
    }

    /**
     * Loads the colors of the bricks into an array and then returns the
     * array.
     * @return {array} color an array of colors.
     */
    function loadBrickColors() {
        var red = '#ff0000',
            orange = '#ff9900',
            yellow = '#ffff00',
            green = '#00ff00',
            darkBlue = '#0000ff',
			white = '#ffffff',
			black = '#000000',
            colors = [white];
        return colors;
    }

    /**
     * Loads the colors of the bricks into the colors array.
     */
    function createBricks() {
        var colors = [];
        colors = loadBrickColors();
        switch (level) {
        case 1:
            drawRectangle(colors);
            break;
        case 2:
            drawTriangle(colors);
            break;
        default:
            break;
        }
    }

    /**
     * Gets the variables ready for the game.
     */
    function initGameVariables() {
        paddle = new Paddle();
		paddle1 = new Paddle1();
        ball = new Ball();
        turns = 3;
        level = 1;
        score = 0;
        gameStatus = 'start';
        bricksRemaining = BRICK_ROWS * BRICKS_PER_ROW;
    }

    /**
     * Initalizes the event listeners.
     */
    function initListeners() {
        $(canvas).mousemove(movePaddle);
		$(canvas).mousemove(movePaddle1);
    }

    /**
     * Sets the canvas width and height.
     */
    function resizeCanvas() {
        context.canvas.width = SCREEN_WIDTH;
        context.canvas.height = SCREEN_HEIGHT;
    }

    /**
     * Initalizes the game.
     */
    function initGame() {
        createBricks();
        initGameVariables();
        initListeners();
        resizeCanvas();
    }

    /**
     * Draws the background.
     */
    function drawBackground() {
        context.fillStyle = SCREEN_COLOR;
        context.fillRect(SCREEN_X1, SCREEN_Y1, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    /**
     * Draws the bricks.
     */
    function drawBricks() {
        var i = 0,
            length = bricks.length,
            x1 = 0,
            y1 = 0,
            x2 = 0,
            y2 = 0,
            color = '';
        for (i = 0; i < length; i += 1) {
            if (bricks[i].visible === true) {
                x1 = bricks[i].x1;
                y1 = bricks[i].y1;
                x2 = BRICK_WIDTH;
                y2 = BRICK_HEIGHT;
                color = bricks[i].color;
                context.fillStyle = color;
                context.fillRect(x1, y1, x2, y2);
            }
        }
    }

    /**
     * Draws the ball.
     */
    function drawBall() {
        context.fillStyle = ball.color;
        context.beginPath();
        context.arc(ball.cx, ball.cy, ball.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
    }

    /**
     * Draws the paddle.
     */
    function drawPaddle() {
        context.fillStyle = paddle.color;
        context.fillRect(paddle.x1, paddle.y1, paddle.width, paddle.height);
    }
	
	function drawPaddle1() {
        context.fillStyle = paddle1.color;
        context.fillRect(paddle1.x1, paddle1.y1, paddle1.width, paddle1.height);
    }
    /**
     * Starts the game.
     */
    function startGame() {
        gameStatus = 'playing';
        $(canvas).unbind('click', startGame);
    }

    /**
     * Draws the start screen.
     */
    function drawStartScreen() {
        $(canvas).bind('click', startGame);
        var x = SCREEN_WIDTH / 2,
            y = 320;
        context.textAlign = 'center';
        context.fillStyle = TEXT_COLOR;
        context.font = '30px Verdana bold';
        context.textBaseline = 'top';
        context.fillText('Lung Breaker', x, y);
        context.font = '15px Arial';
        context.fillStyle = TEXT_COLOR;
        context.fillText('Click on screen to start', x, y + 125);
    }

    /**
     * Draws the score.
     */
    function drawScore() {
        context.textAlign = 'left';
        context.fillStyle = TEXT_COLOR;
        context.font = '15px arial';
        context.textBaseline = 'top';
        context.fillText('Score: ' + score, 30,
            SCREEN_HEIGHT - STATUS_BAR_Y_OFFSET);
    }

    /**
     * Draws the turns on the screen.
     */
    function drawTurns() {
        context.textAlign = 'left';
        context.fillStyle = TEXT_COLOR;
        context.font = '15px arial';
        context.textBaseline = 'top';
        context.fillText('Turns: ' + turns, SCREEN_WIDTH - 100,
            SCREEN_HEIGHT - STATUS_BAR_Y_OFFSET);
    }

    /**
     * Draws the score.
     */
    function exitGameCheck() {
        if (bricksRemaining === 0) {
            winningScreen();
        } else if (turns === 0) {
            losingScreen();
        }
    }

    /**
     * Plays the game.
     */
    function playGame() {
        moveBall();
    }

    /**
     * Draws the game over screen.
     */
    function gameOverScreen() {
        $(canvas).bind('click', function() {
            initGame();
            startGame();
        });
        var x = SCREEN_WIDTH / 2,
            y = 280;
        context.textAlign = 'center';
        context.fillStyle = TEXT_COLOR;
        context.font = 'bold 30px Verdana';
        context.textBaseline = 'top';
        context.fillText('Game Over', x, y);
        context.font = 'bold 15px Arial';
        context.fillStyle = TEXT_COLOR;
        context.fillText('High Scores', x, y += 50);
        context.font = '15px Arial';
        context.fillText('1.  ' + highScores[0], x, y += 25);
        context.fillText('2.  ' + highScores[1], x, y += 25);
        context.fillText('3.  ' + highScores[2], x, y += 25);
        context.fillText('Click on screen to play again', x, y += 25);
    }

    /**
     * Draws the screen.
     */
    function drawScreen() {
        drawBackground();
        drawBricks();
        drawPaddle();
		drawPaddle1();
        if (gameStatus === 'start') {
            drawStartScreen();
            drawBall();
        } else if (gameStatus === 'playing') {
            drawScore();
            drawTurns();
            drawBall();
            playGame();
            exitGameCheck();
        } else if (gameStatus === 'gameover') {
            drawScore();
            drawTurns();
            gameOverScreen();
        }
    }

    /**
     * Runs the game.
     */
    function runGame() {
        continueGame = setInterval(drawScreen, DELAY_TIME);
    }

    initGame();
    runGame();
}

$(window).load(canvasApp);
