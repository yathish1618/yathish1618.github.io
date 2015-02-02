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

    var DELAY_TIME = 1,
        SCREEN_WIDTH = 500,
        SCREEN_HEIGHT = 500,
        SCREEN_X1 = 0,
        SCREEN_Y1 = 0,
        SCREEN_X2 = SCREEN_WIDTH,
        SCREEN_Y2 = SCREEN_HEIGHT,
        SCREEN_COLOR = '#fff',
        TEXT_COLOR = '#000',
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
        this.height = 15;
        this.offset = this.height;
        this.color = '#000';
        this.x1 = (SCREEN_WIDTH - this.width) / 2;
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
        for (i = 0; i < BRICK_ROWS; i += 1) {
            brickX = BRICK_OFFSET;
            for (j = 0; j < BRICKS_PER_ROW; j += 1) {
				var curPos = [i,j];
				var checkPos = [1,0];
                if (
				/* This is data for displaying specific bricks for the shape of lungs */
				(i==0&&j==30)||(i==0&&j==31)||(i==0&&j==32)||(i==0&&j==33)||(i==1&&j==30)||(i==1&&j==31)||(i==1&&j==32)||(i==1&&j==33)||(i==2&&j==30)||(i==2&&j==31)||(i==2&&j==32)||(i==2&&j==33)||(i==3&&j==30)||(i==3&&j==31)||(i==3&&j==32)||(i==3&&j==33)||(i==4&&j==30)||(i==4&&j==31)||(i==4&&j==32)||(i==4&&j==33)||(i==5&&j==30)||(i==5&&j==31)||(i==5&&j==32)||(i==5&&j==33)||(i==6&&j==30)||(i==6&&j==31)||(i==6&&j==32)||(i==6&&j==33)||(i==7&&j==22)||(i==7&&j==23)||(i==7&&j==24)||(i==7&&j==25)||(i==7&&j==26)||(i==7&&j==30)||(i==7&&j==31)||(i==7&&j==32)||(i==7&&j==33)||(i==7&&j==37)||(i==7&&j==38)||(i==7&&j==39)||(i==7&&j==40)||(i==7&&j==41)||(i==8&&j==20)||(i==8&&j==21)||(i==8&&j==22)||(i==8&&j==23)||(i==8&&j==24)||(i==8&&j==25)||(i==8&&j==26)||(i==8&&j==27)||(i==8&&j==30)||(i==8&&j==31)||(i==8&&j==32)||(i==8&&j==33)||(i==8&&j==36)||(i==8&&j==37)||(i==8&&j==38)||(i==8&&j==39)||(i==8&&j==40)||(i==8&&j==41)||(i==8&&j==42)||(i==8&&j==43)||(i==9&&j==19)||(i==9&&j==20)||(i==9&&j==21)||(i==9&&j==22)||(i==9&&j==23)||(i==9&&j==24)||(i==9&&j==25)||(i==9&&j==26)||(i==9&&j==27)||(i==9&&j==30)||(i==9&&j==31)||(i==9&&j==32)||(i==9&&j==33)||(i==9&&j==36)||(i==9&&j==37)||(i==9&&j==38)||(i==9&&j==39)||(i==9&&j==40)||(i==9&&j==41)||(i==9&&j==42)||(i==9&&j==43)||(i==9&&j==44)||(i==10&&j==18)||(i==10&&j==19)||(i==10&&j==20)||(i==10&&j==21)||(i==10&&j==22)||(i==10&&j==23)||(i==10&&j==24)||(i==10&&j==25)||(i==10&&j==26)||(i==10&&j==27)||(i==10&&j==28)||(i==10&&j==30)||(i==10&&j==31)||(i==10&&j==32)||(i==10&&j==33)||(i==10&&j==35)||(i==10&&j==36)||(i==10&&j==37)||(i==10&&j==38)||(i==10&&j==39)||(i==10&&j==40)||(i==10&&j==41)||(i==10&&j==42)||(i==10&&j==43)||(i==10&&j==44)||(i==10&&j==45)||(i==11&&j==18)||(i==11&&j==19)||(i==11&&j==20)||(i==11&&j==21)||(i==11&&j==22)||(i==11&&j==23)||(i==11&&j==24)||(i==11&&j==25)||(i==11&&j==26)||(i==11&&j==27)||(i==11&&j==28)||(i==11&&j==30)||(i==11&&j==31)||(i==11&&j==32)||(i==11&&j==33)||(i==11&&j==35)||(i==11&&j==36)||(i==11&&j==37)||(i==11&&j==38)||(i==11&&j==39)||(i==11&&j==40)||(i==11&&j==41)||(i==11&&j==42)||(i==11&&j==43)||(i==11&&j==44)||(i==11&&j==45)||(i==14&&j==15)||(i==14&&j==16)||(i==14&&j==17)||(i==14&&j==18)||(i==14&&j==19)||(i==14&&j==20)||(i==14&&j==21)||(i==14&&j==22)||(i==14&&j==23)||(i==14&&j==24)||(i==14&&j==25)||(i==14&&j==26)||(i==14&&j==27)||(i==14&&j==28)||(i==14&&j==29)||(i==14&&j==30)||(i==14&&j==31)||(i==14&&j==32)||(i==14&&j==33)||(i==14&&j==34)||(i==14&&j==35)||(i==14&&j==36)||(i==14&&j==37)||(i==14&&j==38)||(i==14&&j==39)||(i==14&&j==40)||(i==14&&j==41)||(i==14&&j==42)||(i==14&&j==43)||(i==14&&j==44)||(i==14&&j==45)||(i==14&&j==46)||(i==14&&j==47)||(i==14&&j==48)||(i==15&&j==15)||(i==15&&j==16)||(i==15&&j==17)||(i==15&&j==18)||(i==15&&j==19)||(i==15&&j==20)||(i==15&&j==21)||(i==15&&j==22)||(i==15&&j==23)||(i==15&&j==24)||(i==15&&j==25)||(i==15&&j==26)||(i==15&&j==27)||(i==15&&j==28)||(i==15&&j==29)||(i==15&&j==30)||(i==15&&j==31)||(i==15&&j==32)||(i==15&&j==33)||(i==15&&j==34)||(i==15&&j==35)||(i==15&&j==36)||(i==15&&j==37)||(i==15&&j==38)||(i==15&&j==39)||(i==15&&j==40)||(i==15&&j==41)||(i==15&&j==42)||(i==15&&j==43)||(i==15&&j==44)||(i==15&&j==45)||(i==15&&j==46)||(i==15&&j==47)||(i==15&&j==48)||(i==16&&j==14)||(i==16&&j==15)||(i==16&&j==16)||(i==16&&j==17)||(i==16&&j==18)||(i==16&&j==19)||(i==16&&j==20)||(i==16&&j==21)||(i==16&&j==22)||(i==16&&j==23)||(i==16&&j==24)||(i==16&&j==25)||(i==16&&j==26)||(i==16&&j==27)||(i==16&&j==28)||(i==16&&j==29)||(i==16&&j==30)||(i==16&&j==31)||(i==16&&j==32)||(i==16&&j==33)||(i==16&&j==34)||(i==16&&j==35)||(i==16&&j==36)||(i==16&&j==37)||(i==16&&j==38)||(i==16&&j==39)||(i==16&&j==40)||(i==16&&j==41)||(i==16&&j==42)||(i==16&&j==43)||(i==16&&j==44)||(i==16&&j==45)||(i==16&&j==46)||(i==16&&j==47)||(i==16&&j==48)||(i==16&&j==49)||(i==17&&j==14)||(i==17&&j==15)||(i==17&&j==16)||(i==17&&j==17)||(i==17&&j==18)||(i==17&&j==19)||(i==17&&j==20)||(i==17&&j==21)||(i==17&&j==22)||(i==17&&j==23)||(i==17&&j==24)||(i==17&&j==25)||(i==17&&j==26)||(i==17&&j==27)||(i==17&&j==28)||(i==17&&j==29)||(i==17&&j==30)||(i==17&&j==33)||(i==17&&j==34)||(i==17&&j==35)||(i==17&&j==36)||(i==17&&j==37)||(i==17&&j==38)||(i==17&&j==39)||(i==17&&j==40)||(i==17&&j==41)||(i==17&&j==42)||(i==17&&j==43)||(i==17&&j==44)||(i==17&&j==45)||(i==17&&j==46)||(i==17&&j==47)||(i==17&&j==48)||(i==17&&j==49)||(i==18&&j==14)||(i==18&&j==15)||(i==18&&j==16)||(i==18&&j==17)||(i==18&&j==18)||(i==18&&j==19)||(i==18&&j==20)||(i==18&&j==21)||(i==18&&j==22)||(i==18&&j==23)||(i==18&&j==24)||(i==18&&j==25)||(i==18&&j==26)||(i==18&&j==27)||(i==18&&j==28)||(i==18&&j==35)||(i==18&&j==36)||(i==18&&j==37)||(i==18&&j==38)||(i==18&&j==39)||(i==18&&j==40)||(i==18&&j==41)||(i==18&&j==42)||(i==18&&j==43)||(i==18&&j==44)||(i==18&&j==45)||(i==18&&j==46)||(i==18&&j==47)||(i==18&&j==48)||(i==18&&j==49)||(i==19&&j==14)||(i==19&&j==15)||(i==19&&j==16)||(i==19&&j==17)||(i==19&&j==18)||(i==19&&j==19)||(i==19&&j==20)||(i==19&&j==21)||(i==19&&j==22)||(i==19&&j==23)||(i==19&&j==24)||(i==19&&j==25)||(i==19&&j==26)||(i==19&&j==27)||(i==19&&j==28)||(i==19&&j==35)||(i==19&&j==36)||(i==19&&j==37)||(i==19&&j==38)||(i==19&&j==39)||(i==19&&j==40)||(i==19&&j==41)||(i==19&&j==42)||(i==19&&j==43)||(i==19&&j==44)||(i==19&&j==45)||(i==19&&j==46)||(i==19&&j==47)||(i==19&&j==48)||(i==19&&j==49)||(i==12&&j==17)||(i==12&&j==18)||(i==12&&j==19)||(i==12&&j==20)||(i==12&&j==21)||(i==12&&j==22)||(i==12&&j==23)||(i==12&&j==24)||(i==12&&j==25)||(i==12&&j==26)||(i==12&&j==27)||(i==12&&j==28)||(i==12&&j==30)||(i==12&&j==31)||(i==12&&j==32)||(i==12&&j==33)||(i==12&&j==35)||(i==12&&j==36)||(i==12&&j==37)||(i==12&&j==38)||(i==12&&j==39)||(i==12&&j==40)||(i==12&&j==41)||(i==12&&j==42)||(i==12&&j==43)||(i==12&&j==44)||(i==12&&j==45)||(i==12&&j==46)||(i==13&&j==16)||(i==13&&j==17)||(i==13&&j==18)||(i==13&&j==19)||(i==13&&j==20)||(i==13&&j==21)||(i==13&&j==22)||(i==13&&j==23)||(i==13&&j==24)||(i==13&&j==25)||(i==13&&j==26)||(i==13&&j==27)||(i==13&&j==28)||(i==13&&j==30)||(i==13&&j==31)||(i==13&&j==32)||(i==13&&j==33)||(i==13&&j==35)||(i==13&&j==36)||(i==13&&j==37)||(i==13&&j==38)||(i==13&&j==39)||(i==13&&j==40)||(i==13&&j==41)||(i==13&&j==42)||(i==13&&j==43)||(i==13&&j==44)||(i==13&&j==45)||(i==13&&j==46)||(i==13&&j==47)||(i==19&&j==50)||(i==19&&j==13)||(i==20&&j==13)||(i==20&&j==14)||(i==20&&j==15)||(i==20&&j==16)||(i==20&&j==17)||(i==20&&j==18)||(i==20&&j==19)||(i==20&&j==20)||(i==20&&j==21)||(i==20&&j==22)||(i==20&&j==23)||(i==20&&j==24)||(i==20&&j==25)||(i==20&&j==26)||(i==20&&j==27)||(i==20&&j==28)||(i==20&&j==35)||(i==20&&j==36)||(i==20&&j==37)||(i==20&&j==38)||(i==20&&j==39)||(i==20&&j==40)||(i==20&&j==41)||(i==20&&j==42)||(i==20&&j==43)||(i==20&&j==44)||(i==20&&j==45)||(i==20&&j==46)||(i==20&&j==47)||(i==20&&j==48)||(i==20&&j==49)||(i==20&&j==50)||(i==21&&j==13)||(i==21&&j==14)||(i==21&&j==15)||(i==21&&j==16)||(i==21&&j==17)||(i==21&&j==18)||(i==21&&j==19)||(i==21&&j==20)||(i==21&&j==21)||(i==21&&j==22)||(i==21&&j==23)||(i==21&&j==24)||(i==21&&j==25)||(i==21&&j==26)||(i==21&&j==27)||(i==21&&j==28)||(i==21&&j==35)||(i==21&&j==36)||(i==21&&j==37)||(i==21&&j==38)||(i==21&&j==39)||(i==21&&j==40)||(i==21&&j==41)||(i==21&&j==42)||(i==21&&j==43)||(i==21&&j==44)||(i==21&&j==45)||(i==21&&j==46)||(i==21&&j==47)||(i==21&&j==48)||(i==21&&j==49)||(i==21&&j==50)||(i==22&&j==13)||(i==22&&j==14)||(i==22&&j==15)||(i==22&&j==16)||(i==22&&j==17)||(i==22&&j==18)||(i==22&&j==19)||(i==22&&j==20)||(i==22&&j==21)||(i==22&&j==22)||(i==22&&j==23)||(i==22&&j==24)||(i==22&&j==25)||(i==22&&j==26)||(i==22&&j==27)||(i==22&&j==28)||(i==22&&j==35)||(i==22&&j==36)||(i==22&&j==37)||(i==22&&j==38)||(i==22&&j==39)||(i==22&&j==40)||(i==22&&j==41)||(i==22&&j==42)||(i==22&&j==43)||(i==22&&j==44)||(i==22&&j==45)||(i==22&&j==46)||(i==22&&j==47)||(i==22&&j==48)||(i==22&&j==49)||(i==22&&j==50)||(i==23&&j==13)||(i==23&&j==14)||(i==23&&j==15)||(i==23&&j==16)||(i==23&&j==17)||(i==23&&j==18)||(i==23&&j==19)||(i==23&&j==20)||(i==23&&j==21)||(i==23&&j==22)||(i==23&&j==23)||(i==23&&j==24)||(i==23&&j==25)||(i==23&&j==26)||(i==23&&j==27)||(i==23&&j==28)||(i==23&&j==35)||(i==23&&j==36)||(i==23&&j==37)||(i==23&&j==38)||(i==23&&j==39)||(i==23&&j==40)||(i==23&&j==41)||(i==23&&j==42)||(i==23&&j==43)||(i==23&&j==44)||(i==23&&j==45)||(i==23&&j==46)||(i==23&&j==47)||(i==23&&j==48)||(i==23&&j==49)||(i==23&&j==50)||(i==24&&j==13)||(i==24&&j==14)||(i==24&&j==15)||(i==24&&j==16)||(i==24&&j==17)||(i==24&&j==18)||(i==24&&j==19)||(i==24&&j==20)||(i==24&&j==21)||(i==24&&j==22)||(i==24&&j==23)||(i==24&&j==24)||(i==24&&j==25)||(i==24&&j==26)||(i==24&&j==27)||(i==24&&j==28)||(i==24&&j==35)||(i==24&&j==36)||(i==24&&j==37)||(i==24&&j==38)||(i==24&&j==39)||(i==24&&j==40)||(i==24&&j==41)||(i==24&&j==42)||(i==24&&j==43)||(i==24&&j==44)||(i==24&&j==45)||(i==24&&j==46)||(i==24&&j==47)||(i==24&&j==48)||(i==24&&j==49)||(i==24&&j==50)||(i==25&&j==12)||(i==25&&j==13)||(i==25&&j==14)||(i==25&&j==15)||(i==25&&j==16)||(i==25&&j==17)||(i==25&&j==18)||(i==25&&j==19)||(i==25&&j==20)||(i==25&&j==21)||(i==25&&j==22)||(i==25&&j==23)||(i==25&&j==24)||(i==25&&j==25)||(i==25&&j==26)||(i==25&&j==27)||(i==25&&j==28)||(i==25&&j==35)||(i==25&&j==36)||(i==25&&j==37)||(i==25&&j==38)||(i==25&&j==39)||(i==25&&j==40)||(i==25&&j==41)||(i==25&&j==42)||(i==25&&j==43)||(i==25&&j==44)||(i==25&&j==45)||(i==25&&j==46)||(i==25&&j==47)||(i==25&&j==48)||(i==25&&j==49)||(i==25&&j==50)||(i==25&&j==51)||(i==26&&j==12)||(i==26&&j==13)||(i==26&&j==14)||(i==26&&j==15)||(i==26&&j==16)||(i==26&&j==17)||(i==26&&j==18)||(i==26&&j==19)||(i==26&&j==20)||(i==26&&j==21)||(i==26&&j==22)||(i==26&&j==23)||(i==26&&j==24)||(i==26&&j==25)||(i==26&&j==26)||(i==26&&j==27)||(i==26&&j==28)||(i==26&&j==35)||(i==26&&j==36)||(i==26&&j==37)||(i==26&&j==38)||(i==26&&j==39)||(i==26&&j==40)||(i==26&&j==41)||(i==26&&j==42)||(i==26&&j==43)||(i==26&&j==44)||(i==26&&j==45)||(i==26&&j==46)||(i==26&&j==47)||(i==26&&j==48)||(i==26&&j==49)||(i==26&&j==50)||(i==26&&j==51)||(i==27&&j==12)||(i==27&&j==13)||(i==27&&j==14)||(i==27&&j==15)||(i==27&&j==16)||(i==27&&j==17)||(i==27&&j==18)||(i==27&&j==19)||(i==27&&j==20)||(i==27&&j==21)||(i==27&&j==22)||(i==27&&j==23)||(i==27&&j==24)||(i==27&&j==25)||(i==27&&j==26)||(i==27&&j==27)||(i==27&&j==28)||(i==27&&j==35)||(i==27&&j==36)||(i==27&&j==37)||(i==27&&j==38)||(i==27&&j==39)||(i==27&&j==40)||(i==27&&j==41)||(i==27&&j==42)||(i==27&&j==43)||(i==27&&j==44)||(i==27&&j==45)||(i==27&&j==46)||(i==27&&j==47)||(i==27&&j==48)||(i==27&&j==49)||(i==27&&j==50)||(i==27&&j==51)||(i==28&&j==12)||(i==28&&j==13)||(i==28&&j==14)||(i==28&&j==15)||(i==28&&j==16)||(i==28&&j==17)||(i==28&&j==18)||(i==28&&j==19)||(i==28&&j==20)||(i==28&&j==21)||(i==28&&j==22)||(i==28&&j==23)||(i==28&&j==24)||(i==28&&j==25)||(i==28&&j==26)||(i==28&&j==27)||(i==28&&j==36)||(i==28&&j==37)||(i==28&&j==38)||(i==28&&j==39)||(i==28&&j==40)||(i==28&&j==41)||(i==28&&j==42)||(i==28&&j==43)||(i==28&&j==44)||(i==28&&j==45)||(i==28&&j==46)||(i==28&&j==47)||(i==28&&j==48)||(i==28&&j==49)||(i==28&&j==50)||(i==28&&j==51)||(i==29&&j==12)||(i==29&&j==13)||(i==29&&j==14)||(i==29&&j==15)||(i==29&&j==16)||(i==29&&j==17)||(i==29&&j==18)||(i==29&&j==19)||(i==29&&j==20)||(i==29&&j==21)||(i==29&&j==22)||(i==29&&j==23)||(i==29&&j==24)||(i==29&&j==25)||(i==29&&j==26)||(i==29&&j==27)||(i==29&&j==36)||(i==29&&j==37)||(i==29&&j==38)||(i==29&&j==39)||(i==29&&j==40)||(i==29&&j==41)||(i==29&&j==42)||(i==29&&j==43)||(i==29&&j==44)||(i==29&&j==45)||(i==29&&j==46)||(i==29&&j==47)||(i==29&&j==48)||(i==29&&j==49)||(i==29&&j==50)||(i==29&&j==51)||(i==30&&j==12)||(i==30&&j==13)||(i==30&&j==14)||(i==30&&j==15)||(i==30&&j==16)||(i==30&&j==17)||(i==30&&j==18)||(i==30&&j==19)||(i==30&&j==20)||(i==30&&j==21)||(i==30&&j==22)||(i==30&&j==23)||(i==30&&j==24)||(i==30&&j==25)||(i==30&&j==26)||(i==30&&j==27)||(i==30&&j==36)||(i==30&&j==37)||(i==30&&j==38)||(i==30&&j==39)||(i==30&&j==40)||(i==30&&j==41)||(i==30&&j==42)||(i==30&&j==43)||(i==30&&j==44)||(i==30&&j==45)||(i==30&&j==46)||(i==30&&j==47)||(i==30&&j==48)||(i==30&&j==49)||(i==30&&j==50)||(i==30&&j==51)||(i==31&&j==12)||(i==31&&j==13)||(i==31&&j==14)||(i==31&&j==15)||(i==31&&j==16)||(i==31&&j==17)||(i==31&&j==18)||(i==31&&j==19)||(i==31&&j==21)||(i==31&&j==22)||(i==31&&j==23)||(i==31&&j==24)||(i==31&&j==25)||(i==31&&j==26)||(i==31&&j==37)||(i==31&&j==38)||(i==31&&j==39)||(i==31&&j==40)||(i==31&&j==41)||(i==31&&j==42)||(i==31&&j==44)||(i==31&&j==45)||(i==31&&j==46)||(i==31&&j==47)||(i==31&&j==48)||(i==31&&j==49)||(i==31&&j==50)||(i==31&&j==51)||(i==32&&j==12)||(i==32&&j==13)||(i==32&&j==14)||(i==32&&j==15)||(i==32&&j==16)||(i==32&&j==17)||(i==32&&j==19)||(i==32&&j==22)||(i==32&&j==24)||(i==32&&j==25)||(i==32&&j==26)||(i==32&&j==37)||(i==32&&j==38)||(i==32&&j==39)||(i==32&&j==41)||(i==32&&j==44)||(i==32&&j==46)||(i==32&&j==47)||(i==32&&j==48)||(i==32&&j==49)||(i==32&&j==50)||(i==32&&j==51)||(i==33&&j==12)||(i==33&&j==13)||(i==33&&j==14)||(i==33&&j==15)||(i==33&&j==20)||(i==33&&j==24)||(i==33&&j==39)||(i==33&&j==43)||(i==33&&j==48)||(i==33&&j==49)||(i==33&&j==50)||(i==33&&j==51)||(i==34&&j==13)||(i==34&&j==14)||(i==34&&j==15)||(i==34&&j==48)||(i==34&&j==49)||(i==34&&j==50)||(i==35&&j==15)||(i==35&&j==48)
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
            ball.velocityy = -ball.velocityy;
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
			black = '#000000',
            colors = [black];
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
