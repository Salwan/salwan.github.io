// Class Gameplay

/* global debugsy */
/* global DEBUG */
/* global Clamp */
/* global Phaser */
/* global game */

var Gameplay = function() {
};

Gameplay.prototype = {
    init: function() {
        // Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 0;
        
        // Background
        this.bgLayer1 = [];
        this.bgLayer1Tweens = [];
        this.bgLayer2 = [];
        this.bgLayer2Tweens = [];
        this.bgLayer3 = [];
        this.bgLayer3Tweens = [];
        this.BG1_SCROLL_DURATION = 45 * 1000;
        this.BG2_SCROLL_DURATION = 50 * 1000;
        this.BG3_SCROLL_DURATION = 75 * 1000;
        
        // Player
        this.fighter = null;
        this.movementSpeed = 300;
        
        // Input
        this.horizontalInput = 0.0;
        this.verticalInput = 0.0;
        this.fireInput = false;
        this.selectInput = false;
        this.pad1 = null;
        // - Player Controls
        this.playerControls = {
            // Cursors
            left: 0.0,
            right: 0.0,
            up: 0.0,
            down: 0.0,
            // Button 0
            fire: false,
            select: false,
        };
    },
    
    preload: function() {
        
    },
    
    create: function() {
        // Background
        var sf = 2;
        this.bgLayer1.push(game.add.image(0, 0, 'bg_layer_1'));
        this.bgLayer1.push(game.add.image(game.world.width, 0, 'bg_layer_1'));
        this.bgLayer1[0].scale.x = sf; this.bgLayer1[0].scale.y = sf;
        this.bgLayer1[1].scale.x = sf; this.bgLayer1[1].scale.y = sf;
        //
        this.bgLayer2.push(game.add.image(0, 0, 'bg_layer_2'));
        this.bgLayer2.push(game.add.image(game.world.width, 0, 'bg_layer_2'));
        this.bgLayer2[0].scale.x = sf; this.bgLayer2[0].scale.y = sf;
        this.bgLayer2[1].scale.x = sf; this.bgLayer2[1].scale.y = sf;
        //
        this.bgLayer3.push(game.add.image(0, 0, 'bg_layer_3'));
        this.bgLayer3.push(game.add.image(game.world.width, 0, 'bg_layer_3'));
        this.bgLayer3[0].scale.x = sf; this.bgLayer3[0].scale.y = sf;
        this.bgLayer3[1].scale.x = sf; this.bgLayer3[1].scale.y = sf;
        
        // Player
        this.player = game.add.sprite(0, 0, 'flight');
        this.player.anchor = new Phaser.Point(0.5);
        this.physics.arcade.enable(this.player);
        this.player.body.setSize(51, 22, 0, 0);
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('idle', [1, 2], 10, true);
        this.player.x = 25 + 51;
        this.player.y = game.world.centerY;
        this.player.scale = new Phaser.Point(2, 2);
        this.player.play('idle');
        
        // Scroll away!
        for(var i = 0; i < 2; ++i) {
            this.bgLayer1Tweens.push(game.add.tween(this.bgLayer1[i]));
            this.scrollBG(this.bgLayer1[i], this.bgLayer1Tweens[i], this.BG1_SCROLL_DURATION);
            this.bgLayer1Tweens[i].repeat(-1);
            this.bgLayer1Tweens[i].onLoop.add(this.bgLayerScrollComplete, this, 0);
            
            this.bgLayer2Tweens.push(game.add.tween(this.bgLayer2[i]));
            this.scrollBG(this.bgLayer2[i], this.bgLayer2Tweens[i], this.BG2_SCROLL_DURATION);
            this.bgLayer2Tweens[i].repeat(-1);
            this.bgLayer2Tweens[i].onLoop.add(this.bgLayerScrollComplete, this, 0);
            
            this.bgLayer3Tweens.push(game.add.tween(this.bgLayer3[i]));
            this.scrollBG(this.bgLayer3[i], this.bgLayer3Tweens[i], this.BG3_SCROLL_DURATION);
            this.bgLayer3Tweens[i].repeat(-1);
            this.bgLayer3Tweens[i].onLoop.add(this.bgLayerScrollComplete, this, 0);
            
        }
        
        // Input
        // - Keyboard
        game.input.keyboard.addCallbacks(this, this.onKeyboardDown, this.onKeyboardUp);
        // - Touch
        game.input.maxPointers = 1;
        game.input.onTap.add(this.onTap, this);
        // - Gamepad
        game.input.gamepad.start();
        this.pad1 = game.input.gamepad.pad1;
        if(this.pad1) {
            this.pad1.addCallbacks(this, {
                onConnect: this.onGamepadConnect,
                onDisconnect: this.onGamepadDisconnect,
                onDown: this.onGamepadDown,
                onUp: this.onGamepadUp,
                onAxis: this.onGamepadAxis
            });
        }
        
        // Debugsy
        debugsy.create();
        debugsy.log("Gameplay");
    },
    
    update: function() {
        this.updateInput();
        
        this.player.body.velocity = new Phaser.Point(
            this.horizontalInput * this.movementSpeed,
            this.verticalInput * this.movementSpeed);
        
        this.resetInput();  
    },
    
    render: function() {
        if(DEBUG) {
            game.debug.text(game.time.fps, game.world.width - 13, 10,
                '#000000', '9px courier');
            game.debug.text(game.time.fps, game.world.width - 14, 9,
                '#ffffff', '9px courier');
            debugsy.render();
        }
    },
    
    scrollBG: function(_layer, _tween, _duration) {
        _tween.to({x: _layer.x - game.world.width}, _duration, null, true, 0, true);
    },
    
    bgLayerScrollComplete: function(_layer, _tween) {
        if(_layer.x <= -game.world.width) {
            _layer.x = game.world.width; 
        }
    },
    
    // Input handling
    updateInput: function() {
        this.horizontalInput = Clamp(this.playerControls.left + this.playerControls.right, -1.0, 1.0);
        this.verticalInput = Clamp(this.playerControls.up + this.playerControls.down, -1.0, 1.0);
        this.fireInput = this.playerControls.fire;
        this.selectInput = this.playerControls.select;
    },
    
    resetInput: function() {
        this.selectInput = false;
    },
    
    onKeyboardDown: function(e) {
        switch(e.keyCode) {
            case Phaser.KeyCode.RIGHT:
                this.playerControls.right = 1.0;
                break;
            case Phaser.KeyCode.LEFT:
                this.playerControls.left = -1.0;
                break;
            case Phaser.KeyCode.UP:
                this.playerControls.up = -1.0;
                break;
            case Phaser.KeyCode.DOWN:
                this.playerControls.down = 1.0;
                break;
            case Phaser.KeyCode.CONTROL:
                this.playerControls.fire = true;
                break;
            case Phaser.KeyCode.SPACE:
                this.playerControls.fire = true;
            case Phaser.KeyCode.ENTER:
                this.playerControls.select = false;
                break;
        }
    },
    
    onKeyboardUp: function(e) {
        switch(e.keyCode) {
            case Phaser.KeyCode.RIGHT:
                this.playerControls.right = 0.0;
                break;
            case Phaser.KeyCode.LEFT:
                this.playerControls.left = 0.0;
                break;
            case Phaser.KeyCode.UP:
                this.playerControls.up = 0.0;
                break;
            case Phaser.KeyCode.DOWN:
                this.playerControls.down = 0.0;
                break;
            case Phaser.KeyCode.CONTROL:
                this.playerControls.fire = false;
                break;
            case Phaser.KeyCode.SPACE:
                this.playerControls.fire = false;
            case Phaser.KeyCode.ENTER:
                this.playerControls.select = true;
                break;
        }
    },
    
    onTap: function(pointer, double_tap) {
        if(!double_tap) {
            // Single tap
            this.playerControls.fire = true;
        } else {
            // Double tap
        }
    },
    
    onGamepadConnect: function() {
        console.log("Gamepad connected");
    },
    
    onGamepadDisconnect: function() {
        console.log("Gamepad disconnected");
    },
        
    onGamepadDown: function(e) {
        if(e == 0) {
            this.playerControls.fire = true;
        }
    },
    
    onGamepadUp: function(e) {
        if(e == 0) {
            this.playerControls.select = true;
        }
    },
    
    onGamepadAxis: function(e, axis) {
        var av = this.pad1.axis(axis);
        switch(axis) {
            case 0:
                if(av > 0.0) {
                    this.playerControls.right = av;
                    this.playerControls.left = 0.0;
                } else {
                    this.playerControls.right = 0.0;
                    this.playerControls.left = av;
                }
                break;
            case 1:
                 if(av > 0.0) {
                     this.playerControls.up = 0.0;
                     this.playerControls.down = av;
                 } else {
                    this.playerControls.up = av;
                    this.playerControls.down = 0.0;
                 }
                break;
        }
    },
};
