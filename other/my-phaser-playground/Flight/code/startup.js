// Class  Startup

/* global game */

var Startup = function() {
    
};
Startup.prototype = {
    init: function() {
        game.renderer.renderSession.roundPixels = true;
        game.stage.smoothed = false;
        game.stage.backgroundColor = '#272A29';
        this.loaded = false;
    },
    
    preload: function() {
        this.load.crossOrigin = 'anonymous';
        this.load.spritesheet('loading', 'assets/gif/loading.gif', 134, 134, 121);
        this.load.onLoadComplete.add(this.onLoadComplete, this);
    },
    
    onLoadComplete: function(e) {
        console.log("Loading sprite ready");
        this.loaded = true;
    },
    
    create: function() {
        
    },
    
    update: function() {
        if(this.loaded) {
            game.state.start("StartGame");
        }  
    },
};
