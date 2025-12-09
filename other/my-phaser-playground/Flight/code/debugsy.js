// Class Debugsy
// Debugging bar class (based on CMG's impl)
var Debugsy = function(_game) {
    this.game = _game;
};
Debugsy.prototype = {
    create: function() {
        this.message = '';
        this.startMessage = false;
        this.displayTimer = 0.0;
        this.fadeTimer = 0.0;
        this.FADE_TIME = 0.25;
    },
    
    render: function() {
        if(!DEBUG) return;
        var alpha = 0.0;
        if(this.startMessage) {
            this.displayTimer = 1.0;
            this.fadeTimer = this.FADE_TIME;
            this.startMessage = false;
        }
        if(this.displayTimer > 0.0) {
            this.displayTimer = Math.max(0.0, this.displayTimer - this.game.time.physicsElapsed);
            alpha = 1.0;
        } else if(this.fadeTimer > 0.0) {
            this.fadeTimer = Math.max(0.0, this.fadeTimer - this.game.time.physicsElapsed);
            alpha = this.fadeTimer / this.FADE_TIME; // 1.0 -> 0.0
        } else {
            alpha = 0.0;
            this.message = '';
        }
        this.game.debug.geom(new Phaser.Rectangle(0, this.game.world.height - 12, this.game.world.width, 12), 
            'rgba(27, 2, 44, '+ alpha.toString() + ')');
        if(this.message && this.message.length > 0) {
            this.game.debug.text(this.message, 0, this.game.world.height - 3, 
                'rgba(176, 176, 176, ' + alpha.toString() + ')', '9px consolas');
        }
    },
    
    log: function(_message) {
        this.message = _message;
        this.startMessage = true;
    },
};
