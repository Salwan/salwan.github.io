// Class StartGame
/* global game */
/* global debugsy */
/* global gfxDraw */
var StartGame = function() {
    
};
StartGame.prototype = {
    init: function() {
        this.loaded = false;
        this.startDelay = 1.0;
        game.renderer.renderSession.roundPixels = true;
        game.stage.smoothed = false;
        game.stage.backgroundColor = '#272A29';
        game.time.advancedTiming = true;
    },
    
    preload: function() {
        var l = this.add.sprite(game.world.centerX, game.world.centerY - 45, 'loading');
        l.anchor.set(0.5);
        l.animations.add('loading', null, 30, true);
        l.play('loading');
        
        var t = this.add.text(game.world.centerX, game.world.centerY + 50, "LOADING", 
            {fontSize:'32px', font:'lucida console', fill:'#ffffff', align:'center'});
        t.anchor.set(0.5);
        
        this.load.crossOrigin = 'anonymous';
        
        this.load.image('fighter', 'assets/bmp/fighter.png');
        this.load.image('enemy', 'assets/bmp/enemy.png');
        this.load.image('bullet', 'assets/bmp/bullet.png');
        this.load.image('fighter_intro', 'assets/bmp/fighter_intro.png');
        this.load.image('bg_layer_1', 'assets/bmp/bg_layer_1.fw.png');
        this.load.image('bg_layer_2', 'assets/bmp/bg_layer_2.fw.png');
        this.load.image('bg_layer_3', 'assets/bmp/bg_layer_3.fw.png');
        this.load.spritesheet('flight', 'assets/bmp/flight.fw.png', 51, 22, 3);
        
        this.load.onLoadComplete.add(this.onLoadComplete, this);
    },
    
    create: function() {
        gfxDraw = game.add.graphics(0, 0);
    },
    
    update: function() {
        if(this.loaded) {
            this.startDelay -= game.time.physicsElapsed;
            if(this.startDelay <= 0.0) {
                game.state.start('MainMenu', true);
            }
        }
    },
    
    render: function() {
        
    },
    
    onLoadComplete: function() {
        this.loaded = true;
        console.log("All Data Loaded");
    },
};