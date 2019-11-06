// Class MainMenu

/* global game */
/* global debugsy */
/* global DEBUG */

var MainMenu = function() {
    this.title = null;
    this.startMenu = null;
    this.exitMenu = null;
    this.cursor = null;
    
    this.verticalInput = 0.0;
    this.fireInput = false;
    this.pad1 = null;
    this.rtweens = [];
    this.introTimer = null;
    this.introTimerEvent = null;
    this.introFighter = null;
    
    this.START = 'start';
    this.EXIT = 'exit';
    
    this.choice = this.START;
};
MainMenu.prototype = {
    init: function() {
    },
    
    preload: function() {
        
    },
    
    create: function() {
        // Visuals
        var title_font =  {fontSize:'84px', font:'lucida console', fill:'#ffffff', align:'center'};
        this.title = this.add.text(game.world.centerX, game.world.height + 100, "FLIGHT", 
            title_font);
        this.title.anchor.set(0.5);
        var t_in = game.add.tween(this.title);
        t_in.to({y:game.world.centerY - 50}, 3000, null);
        t_in.start();
        this.rtweens.push(t_in);
        
        var menu_font = {font:'24px lucida console', fill:'#ffffff', align:'left'};
        
        this.startMenu = this.add.text(game.world.centerX - 70, game.world.centerY + 40, "Start Game",
            menu_font);
        this.startMenu.alpha = 0.0;
        var t1 = game.add.tween(this.startMenu);
        t1.to({alpha:1.0}, 250, null, true, 3250);
        this.rtweens.push(t1);
        
        this.exitMenu = this.add.text(game.world.centerX - 70, game.world.centerY + 80, "Exit Game",
            menu_font);
        this.exitMenu.alpha = 0.0;
        var t2 = game.add.tween(this.exitMenu);
        t2.to({alpha:1.0}, 250, null, true, 3350);
        this.rtweens.push(t2);
        
        this.cursor = this.add.text(game.world.centerX - 100, this.startMenu.y, ">",
            menu_font);
        this.cursor.alpha = 0.0;
        var t3 = game.add.tween(this.cursor);
        t3.to({alpha:1.0}, 100, null, true, 3450);
        this.rtweens.push(t3);
        
        this.introTimer = game.time.create();
        this.introTimerEvent = this.introTimer.add(3000, this.onIntroTimerComplete, this);
        this.introTimer.start(0);
        
        // Input
        // - Keyboard
        game.input.keyboard.addCallbacks(this, this.onKeyboardDown, this.onKeyboardUp);
        // - Touch
        game.input.maxPointers = 1;
        game.input.onTap.add(this.onTap, this);
        this.startMenu.inputEnabled = true;
        this.startMenu.events.onInputUp.add(this.startGame, this);
        this.exitMenu.inputEnabled = true;
        this.exitMenu.events.onInputUp.add(this.exitGame, this);
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
        debugsy.log("Welcome!");
    },
    
    introFlight: function() {
        this.introFighter = this.add.sprite(0, 0, 'fighter_intro');
        this.introFighter.x =  -this.introFighter.width;
        this.introFighter.y = game.world.centerY;
        var t = game.add.tween(this.introFighter);
        t.to({x:game.world.width}, 500, null, true);
    },
    
    update: function() {
        if(this.introTimerEvent && this.fireInput) {
            this.introInterrupt();
        } else {
            if(!this.fireInput) {
                if(this.verticalInput > 0.9) {
                    this.cursor.y = this.startMenu.y;
                    this.choice = this.START;
                } else if(this.verticalInput < -0.9) {
                    this.cursor.y = this.exitMenu.y;
                    this.choice = this.EXIT;
                }
            } else {
                switch(this.choice) {
                    case this.START:
                        this.startGame();
                        break;
                        
                    case this.EXIT:
                        this.exitGame();
                        break;
                }
            }
        }
        
        this.verticalInput = 0.0;
        this.fireInput = false;
    },
    
    render: function() {
        //gfxDraw.clear();
        game.debug.text(game.time.fps, game.world.width - 13, 10,
            '#000000', '9px courier');
        game.debug.text(game.time.fps, game.world.width - 14, 9,
            '#ffffff', '9px courier');
        debugsy.render();
    },
    
    onIntroTimerComplete: function() {
        if(this.introTimerEvent) {
            this.introTimerEvent = null;
        }
        this.introFlight();
    },
    
    introInterrupt: function() {
        for(var i = 0; i < this.rtweens.length; ++i) {
            if(this.rtweens[i].isRunning) {
                this.rtweens[i].stop(true)
            }
        }
        this.onIntroTimerComplete();
        
        // This should run automatically?
        this.title.y = game.world.centerY - 50;
        this.startMenu.alpha = 1.0;
        this.exitMenu.alpha = 1.0;
        this.cursor.alpha = 1.0;
    },
    
    onKeyboardDown: function(e) {
        switch(e.keyCode) {
            case Phaser.KeyCode.UP:
                this.verticalInput = 1.0;
                break;
            case Phaser.KeyCode.DOWN:
                this.verticalInput = -1.0;
                break;
        }
    },
    
    onKeyboardUp: function(e) {
        switch(e.keyCode) {
            case Phaser.KeyCode.SPACE:
            case Phaser.KeyCode.ENTER:
                this.fireInput = true;
                break;
        }
    },
    
    onTap: function(pointer, double_tap) {
        if(!double_tap) {
            // Single tap
            this.fireInput = true;
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
        
    },
    
    onGamepadUp: function(e) {
        if(e == 0) {
            this.fireInput = true;
        }
    },
    
    onGamepadAxis: function(e, axis) {
        if(axis == 1) {
            this.verticalInput = -this.pad1.axis(1);
        }
    },
    
    startGame: function() {
        debugsy.log("START GAME");
        game.state.start('Gameplay', true);
    },
    
    exitGame: function() {
        // do something that counts as exit, perhaps back to home page?
        //window.location.href = 'http://www.google.com/';
        debugsy.log("EXIT GAME");
    },
};