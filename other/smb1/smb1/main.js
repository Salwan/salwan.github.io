/// <reference path="../phaser262/typescript/phaser.d.ts" />
System.register(['../phaser262/phaser.min.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var WIDTH, HEIGHT, RESMULX, RESMULY, GRAVITY, MAX_SPEED, COLOR_SKY, COLOR_BLACK, COLOR_WHITE, debugMode, enableDebugBar, enableFPS, debugBar, phaser, gamepad1, sfx, SMBGame, GameSession, Player, Scene, StartScreen, InfoScreen, LAYER_BLOCKS, LAYER_BG, LAYER_ITEMS, BLOCK_ITEM, BLOCK_BRICK, ITEM_GROWTH, ITEM_LIFE, ITEM_FLOWER, ITEM_COIN, BUMP_DISTANCE, ActiveBlock, LevelScene, MARIO_WALK_SPEED, MARIO_WALK_ACCEL, MARIO_RUN_SPEED, MARIO_RUN_ACCEL, MARIO_WALK_FPS, MARIO_RUN_FPS, MARIO_BRAKING_ACCEL_MUL, MARIO_JUMP_FORCE_DURATION, Mario, game;
    ////////////////////////////////////////////////////// Utils
    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }
    return {
        setters:[
            function (_1) {}],
        execute: function() {
            WIDTH = 512.0;
            HEIGHT = 480.0;
            RESMULX = 2.0;
            RESMULY = 2.0;
            GRAVITY = 16 * 220;
            MAX_SPEED = 16 * 40;
            COLOR_SKY = 0x5c94fc;
            COLOR_BLACK = 0x000000;
            COLOR_WHITE = 0xffffff;
            debugMode = false;
            enableDebugBar = true;
            enableFPS = true;
            debugBar = null;
            phaser = null;
            gamepad1 = null; // First GamePad
            sfx = {
                coin: null,
                bump: null,
                jump: null,
            };
            ////////////////////////////////////////////////////// SMBGame
            SMBGame = (function () {
                function SMBGame() {
                    var _this = this;
                    this.currentScene = null;
                    this.gameSession = null;
                    this.player = null;
                    this.gamepadBtn1 = 0; // Defaults to Button 1
                    this.gamepadBtn2 = 1; // Defaults to Button 2
                    this.keyboardBtn1 = 90; // Defaults to 'z' keycode
                    this.keyboardBtn2 = 88; // Defaults to 'x' keycode
                    this.fpsText = null;
                    SMBGame.instance = this;
                    phaser = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', {
                        preload: function () { _this.preload(); },
                        create: function () { _this.create(); },
                        update: function () { _this.update(); },
                        render: function () { _this.render(); }
                    }, false, false);
                }
                SMBGame.prototype.preload = function () {
                    phaser.stage.backgroundColor = COLOR_SKY;
                    phaser.load.image('logo', './smb1/assets/title.fw.png');
                    phaser.load.bitmapFont('smb', './smb1/assets/fonts/emulogic_0.png', './smb1/assets/fonts/emulogic.fnt');
                    phaser.load.audio('coin', './smb1/assets/sfx/smb_coin.wav');
                    phaser.load.audio('bump', './smb1/assets/sfx/smb_bump.wav');
                    phaser.load.audio('jump', './smb1/assets/sfx/smb_jump-small.wav');
                    phaser.load.atlas('smb1atlas', './smb1/assets/sprites/smb1atlas.png', './smb1/assets/sprites/smb1atlas.json');
                    phaser.load.tilemap('level11', './smb1/assets/levels/world11.json', null, Phaser.Tilemap.TILED_JSON);
                    phaser.load.image('level1_ss', './smb1/assets/levels/world11.png');
                };
                SMBGame.prototype.create = function () {
                    // Init sound effects
                    sfx.coin = phaser.add.audio('coin');
                    sfx.bump = phaser.add.audio('bump');
                    sfx.jump = phaser.add.audio('jump');
                    // Gamepad
                    phaser.input.gamepad.start();
                    if (phaser.input.gamepad.supported && phaser.input.gamepad.active) {
                        gamepad1 = phaser.input.gamepad.pad1;
                    }
                    // Debug text at top for emitting continuous debug info (more effective than using console)
                    if (enableDebugBar) {
                        debugBar = phaser.add.text(1, 1, "", { font: "bold 11px Lucida Console", fill: "#fff" });
                        debugBar.setShadow(1, 1, 'rgba(0, 0, 0, 0.5)', 0);
                        debugBar.wordWrap = true;
                        debugBar.wordWrapWidth = WIDTH - 2;
                        debugBar.lineSpacing = -7;
                        debugBar.fixedToCamera = true;
                    }
                    if (enableFPS) {
                        this.fpsText = phaser.add.text(WIDTH - 16, 1, "00", { font: "bold 11px Lucida Console", fill: '#fcbcb0' });
                        this.fpsText.setShadow(1, 1, '#000', 0);
                        this.fpsText.fixedToCamera = true;
                        phaser.time.advancedTiming = true;
                    }
                    // Start scene
                    var start_screen = new StartScreen(this);
                    this.changeScene(start_screen);
                };
                SMBGame.prototype.update = function () {
                    // Update fps
                    if (enableFPS) {
                        this.fpsText.text = Math.floor(phaser.time.fps).toString();
                    }
                    // Update gamepad1
                    if (phaser.input.gamepad.supported && phaser.input.gamepad.active && phaser.input.gamepad.pad1.connected) {
                        gamepad1 = phaser.input.gamepad.pad1;
                    }
                    else {
                        gamepad1 = null;
                    }
                    // Update scene
                    if (this.currentScene) {
                        this.currentScene.update();
                    }
                };
                SMBGame.prototype.render = function () {
                    if (this.currentScene) {
                        this.currentScene.render();
                    }
                };
                SMBGame.prototype.changeScene = function (scene) {
                    var _this = this;
                    if (scene) {
                        if (this.currentScene) {
                            this.currentScene.destroy();
                        }
                        phaser.world.removeAll();
                        phaser.stage.backgroundColor = COLOR_BLACK;
                        phaser.world.visible = false; // Blank before create
                        this.currentScene = null;
                        // What happens if another change happens before the one already scheduled? (unlikely but a 100% will happen at least once)
                        // IF a cross-scene timer was ever needed, this might cause an issue. Remember.
                        // Better to replace with a crude update timer?
                        phaser.time.events.removeAll();
                        // Fake blank screen for 0.2 second (polish element)
                        var t = phaser.time.events.add(0.2 * 1000, function () {
                            scene.create();
                            if (debugBar) {
                                phaser.world.addChild(debugBar);
                            }
                            if (_this.fpsText) {
                                phaser.world.addChild(_this.fpsText);
                            }
                            phaser.world.visible = true;
                            _this.currentScene = scene;
                        });
                    }
                };
                SMBGame.prototype.startGame = function () {
                    this.player = new Player();
                    this.gameSession = new GameSession(this.player);
                    var info_screen = new InfoScreen(this, this.gameSession);
                    this.changeScene(info_screen);
                };
                SMBGame.prototype.startLevel = function () {
                    var level_scene = new LevelScene(this, this.gameSession);
                    this.changeScene(level_scene);
                };
                SMBGame.instance = null;
                return SMBGame;
            }());
            ;
            ////////////////////////////////////////////////////// GameSession
            GameSession = (function () {
                function GameSession(_player) {
                    this.world = 1;
                    this.stage = 1;
                    this.player = _player;
                }
                return GameSession;
            }());
            ;
            ////////////////////////////////////////////////////// Player
            Player = (function () {
                function Player() {
                    this.score = 0;
                    this.coins = 0;
                    this.lives = 3;
                }
                return Player;
            }());
            ;
            ////////////////////////////////////////////////////// Scenes
            Scene = (function () {
                function Scene(smb_game) {
                    this.smbGame = smb_game;
                }
                ;
                Scene.prototype.create = function () { };
                ;
                Scene.prototype.update = function () { };
                ;
                Scene.prototype.render = function () { };
                ;
                Scene.prototype.destroy = function () { };
                ;
                return Scene;
            }());
            ;
            ///////////////////////////// StartScreen
            StartScreen = (function (_super) {
                __extends(StartScreen, _super);
                function StartScreen() {
                    _super.apply(this, arguments);
                    this.btn2Text = null;
                    this.boundBtn1 = false;
                }
                StartScreen.prototype.create = function () {
                    var _this = this;
                    phaser.stage.backgroundColor = 0x5c94fc;
                    var logo = phaser.add.sprite(phaser.world.centerX, phaser.world.centerY, 'logo');
                    logo.anchor.setTo(0.5, 1.0);
                    logo.scale.setTo(2.0, 2.0);
                    var copyright_txt = phaser.add.bitmapText(104 * RESMULX, 119 * RESMULY, 'smb', '\xA91985 NINTENDO', 12 * RESMULX);
                    copyright_txt.tint = 0xfcbcb0;
                    phaser.add.bitmapText(18 * RESMULX, 142 * RESMULY, 'smb', 'PRESS-BIND BUTTON 1 = ACTION', 12 * RESMULX);
                    this.btn2Text = phaser.add.bitmapText(24 * RESMULX, 154 * RESMULY, 'smb', 'PRESS-BIND BUTTON 2 = JUMP', 12 * RESMULX);
                    this.btn2Text.visible = false;
                    this.originalKBOwner = phaser.input.keyboard.onDownCallback;
                    phaser.input.keyboard.onDownCallback = function () { _this.onAnyKeyDown(); };
                };
                StartScreen.prototype.update = function () {
                    if (gamepad1) {
                        for (var ib = 0; ib < 4; ++ib) {
                            if (gamepad1.isDown(ib)) {
                                if (!this.boundBtn1) {
                                    // Action
                                    this.smbGame.gamepadBtn1 = ib;
                                    this.boundBtn1 = true;
                                    this.btn2Text.visible = true;
                                    sfx.bump.play();
                                }
                                else {
                                    // Jump
                                    if (ib !== this.smbGame.gamepadBtn1) {
                                        this.smbGame.gamepadBtn2 = ib;
                                        this.startGame();
                                    }
                                }
                            }
                        }
                    }
                };
                StartScreen.prototype.onAnyKeyDown = function () {
                    var kc = phaser.input.keyboard.lastKey.keyCode;
                    if (!this.boundBtn1) {
                        this.smbGame.keyboardBtn1 = kc;
                        this.boundBtn1 = true;
                        this.btn2Text.visible = true;
                        sfx.bump.play();
                    }
                    else {
                        if (kc !== this.smbGame.keyboardBtn1) {
                            this.smbGame.keyboardBtn2 = kc;
                            this.startGame();
                        }
                    }
                };
                StartScreen.prototype.startGame = function () {
                    phaser.input.keyboard.onDownCallback = this.originalKBOwner;
                    sfx.coin.play();
                    this.smbGame.startGame();
                };
                return StartScreen;
            }(Scene));
            ;
            ////////////////////////////// InfoScreen
            InfoScreen = (function (_super) {
                __extends(InfoScreen, _super);
                function InfoScreen(smb_game, game_session) {
                    _super.call(this, smb_game);
                    this.gameSession = game_session;
                }
                InfoScreen.prototype.create = function () {
                    var _this = this;
                    phaser.stage.backgroundColor = 0x000000;
                    // Name and Score
                    var score_txt = this.gameSession.player.score.toString();
                    while (score_txt.length < 6) {
                        score_txt = '0' + score_txt;
                    }
                    phaser.add.bitmapText(24 * RESMULX, 14 * RESMULY, 'smb', 'MARIO', 12 * RESMULX);
                    phaser.add.bitmapText(24 * RESMULX, 22 * RESMULY, 'smb', score_txt, 12 * RESMULX);
                    // Coins
                    var coin = phaser.add.sprite(89 * RESMULX, 24 * RESMULY, 'smb1atlas');
                    coin.scale.set(2.0);
                    var fnames = Phaser.Animation.generateFrameNames('scoin0_', 0, 2, '.png');
                    fnames.push('scoin0_1.png');
                    fnames.push('scoin0_0.png');
                    coin.animations.add('bling', fnames, 5, true);
                    coin.animations.play('bling');
                    var coins_txt = this.gameSession.player.coins.toString();
                    if (coins_txt.length < 2) {
                        coins_txt = '0' + coins_txt;
                    }
                    coins_txt = 'x' + coins_txt;
                    phaser.add.bitmapText(96 * RESMULX, 22 * RESMULY, 'smb', coins_txt, 12 * RESMULX);
                    // World
                    var stage_txt = this.gameSession.world.toString() + '-' + this.gameSession.stage.toString();
                    phaser.add.bitmapText(144 * RESMULX, 14 * RESMULY, 'smb', 'WORLD', 12 * RESMULX);
                    phaser.add.bitmapText(152 * RESMULX, 22 * RESMULY, 'smb', stage_txt, 12 * RESMULX);
                    phaser.add.bitmapText(87 * RESMULX, 78 * RESMULY, 'smb', 'WORLD ' + stage_txt, 12 * RESMULX);
                    // Time
                    phaser.add.bitmapText(200 * RESMULX, 14 * RESMULY, 'smb', 'TIME', 12 * RESMULX);
                    // Mario x lives
                    var mario = phaser.add.sprite(97 * RESMULX, 105 * RESMULY, 'smb1atlas');
                    mario.scale.set(2.0);
                    mario.frameName = 'smario0_0.png';
                    phaser.add.bitmapText(120 * RESMULX, 110 * RESMULY, 'smb', 'x  ' + this.gameSession.player.lives.toString(), 12 * RESMULX);
                    // Timer for starting level
                    phaser.time.events.add(3.0 * 1000, function () { _this.smbGame.startLevel(); });
                };
                return InfoScreen;
            }(Scene));
            ;
            ///////////////////////////// LevelScene
            LAYER_BLOCKS = "BLOCKS";
            LAYER_BG = "BG";
            LAYER_ITEMS = "ITEMS";
            BLOCK_ITEM = 8;
            BLOCK_BRICK = 54;
            ITEM_GROWTH = 66;
            ITEM_LIFE = 67;
            ITEM_FLOWER = 68;
            ITEM_COIN = 69;
            BUMP_DISTANCE = 8;
            ActiveBlock = (function () {
                function ActiveBlock(_level, _tile, _group) {
                    this.level = _level;
                    this.tile = _tile;
                    this.tween = null;
                    this.sprite = null;
                    this._createSprite(_group);
                }
                ActiveBlock.prototype._createSprite = function (_group) {
                    if (this.tile.index === BLOCK_ITEM) {
                        this.sprite = phaser.add.sprite(this.tile.x * 32, this.tile.y * 32, 'smb1atlas', 'itemtile0.png', _group);
                        this.sprite.scale.set(2.0);
                        var frs = ["itemtile0.png", "itemtile1.png", "itemtile2.png", 'itemtile1.png', 'itemtile0.png'];
                        this.sprite.animations.add('bling', frs, 5, true);
                        this.sprite.animations.add('solid', ["solidtile0.png"]);
                        this.sprite.animations.play('bling');
                    }
                    else if (this.tile.index === BLOCK_BRICK) {
                        this.sprite = phaser.add.sprite(this.tile.x * 32, this.tile.y * 32, 'smb1atlas', 'bricktile0.png', _group);
                        this.sprite.scale.set(2.0);
                    }
                    this.tile.alpha = 0.0;
                    this.tile.properties.activeBlock = this;
                };
                ActiveBlock.prototype.hit = function (by_actor) {
                    if (this.tile.index === BLOCK_ITEM) {
                        if (this.sprite.animations.currentAnim.name !== 'solid') {
                            this.sprite.animations.play('solid');
                            this._bumpBlock();
                            this.level.activateItem(this.tile);
                        }
                        else {
                        }
                    }
                    else if (this.tile.index === BLOCK_BRICK) {
                        this._bumpBlock();
                        this.level.activateItem(this.tile);
                    }
                };
                ActiveBlock.prototype._bumpBlock = function () {
                    if (this.tween) {
                        this.tween.stop(true);
                        this.sprite.y = this.tile.y * 32;
                    }
                    this.tween = phaser.add.tween(this.sprite).to({ y: this.sprite.y - BUMP_DISTANCE }, 100, "Linear", true, 0, 0, true);
                };
                return ActiveBlock;
            }());
            ;
            LevelScene = (function (_super) {
                __extends(LevelScene, _super);
                function LevelScene(smb_game, game_session) {
                    _super.call(this, smb_game);
                    this.gameSession = game_session;
                }
                LevelScene.prototype.create = function () {
                    phaser.stage.backgroundColor = COLOR_SKY;
                    // HUD Group
                    this.hudGroup = phaser.add.group(undefined, 'hud', true);
                    // HUD / MARIO
                    var score_txt = this.gameSession.player.score.toString();
                    while (score_txt.length < 6) {
                        score_txt = '0' + score_txt;
                    }
                    phaser.add.bitmapText(24 * RESMULX, 14 * RESMULY, 'smb', 'MARIO', 12 * RESMULX, this.hudGroup);
                    this.hudScore = phaser.add.bitmapText(24 * RESMULX, 22 * RESMULY, 'smb', score_txt, 12 * RESMULX, this.hudGroup);
                    // HUD / COINS
                    var coin = phaser.add.sprite(89 * RESMULX, 24 * RESMULY, 'smb1atlas', undefined, this.hudGroup);
                    coin.scale.set(RESMULX, RESMULY);
                    var fnames = Phaser.Animation.generateFrameNames('scoin0_', 0, 2, '.png');
                    fnames.push('scoin0_1.png');
                    fnames.push('scoin0_0.png');
                    coin.animations.add('bling', fnames, 5, true);
                    coin.animations.play('bling');
                    var coins_txt = this.gameSession.player.coins.toString();
                    if (coins_txt.length < 2) {
                        coins_txt = '0' + coins_txt;
                    }
                    coins_txt = 'x' + coins_txt;
                    this.hudCoins = phaser.add.bitmapText(96 * RESMULX, 22 * RESMULY, 'smb', coins_txt, 12 * RESMULX, this.hudGroup);
                    // HUD / WORLD
                    var stage_txt = this.gameSession.world.toString() + '-' + this.gameSession.stage.toString();
                    phaser.add.bitmapText(144 * RESMULX, 14 * RESMULY, 'smb', 'WORLD', 12 * RESMULX, this.hudGroup);
                    phaser.add.bitmapText(152 * RESMULX, 22 * RESMULY, 'smb', stage_txt, 12 * RESMULX, this.hudGroup);
                    // HUD / TIME
                    this.hudTime = phaser.add.bitmapText(200 * RESMULX, 14 * RESMULY, 'smb', 'TIME', 12 * RESMULX, this.hudGroup);
                    // LOAD LEVEL
                    this.tilemap = phaser.add.tilemap('level11');
                    this.tilemap.addTilesetImage('main', 'level1_ss');
                    this.BGLayer = this.tilemap.createLayer(LAYER_BG);
                    this.BGLayer.setScale(2.0);
                    this.blocksLayer = this.tilemap.createLayer(LAYER_BLOCKS);
                    this.blocksLayer.setScale(2.0);
                    // INIT PHYSICS
                    phaser.physics.startSystem(Phaser.Physics.ARCADE);
                    phaser.physics.arcade.gravity.y = GRAVITY;
                    phaser.physics.arcade.enable(this.blocksLayer);
                    // - collision for Blocks Layer
                    this.tilemap.setCollisionBetween(0, 10000, true, this.blocksLayer);
                    this.blocksLayer.resizeWorld();
                    if (debugMode) {
                        this.blocksLayer.debug = true;
                    }
                    // Objects: SPAWNER
                    this.activeBlocks = new Array();
                    this.questionMarksGroup = phaser.add.group(undefined, 'questionMarks');
                    var blocks_layer = this.tilemap.getLayerIndex(LAYER_BLOCKS);
                    var les_blocks = this.tilemap.layers[blocks_layer];
                    {
                        // Object returned isn't TilemapLayer but it isn't exactly BLOCKS from the json file.
                        // It has the basic width/height x/y visible properties and a data array of 15 arrays
                        // each 128 Tile object.
                        // These the properties in Layer object:
                        // alpha=1, bodies=[], callbacks=[], data=[array of arrays 15*128], dirty=false, height=15, heightInPixels=240
                        // indexes=[], name="BLOCKS", properties=__proto__, visible=true, width=128, widthInPixels=2048, x=0, y=0
                        for (var r = 0; r < les_blocks.height; ++r) {
                            for (var c = 0; c < les_blocks.width; ++c) {
                                var qb = les_blocks.data[r][c];
                                if (!qb) {
                                    console.log("Retrieved data tile from les_blocks is invalid.");
                                }
                                else if (qb.index === BLOCK_BRICK || qb.index === BLOCK_ITEM) {
                                    // Creates cover sprite if needed. Registers active object handler.
                                    this.activeBlocks.push(new ActiveBlock(this, qb, this.questionMarksGroup));
                                }
                            }
                        }
                        console.log("Active blocks count: " + this.activeBlocks.length);
                    }
                    // Objects: OBJECTS and player spawn
                    var les_objects = this.tilemap.objects['OBJECTS'];
                    var player_spawn = null;
                    for (var _i = 0, les_objects_1 = les_objects; _i < les_objects_1.length; _i++) {
                        var ob = les_objects_1[_i];
                        if (ob.name === "mario") {
                            player_spawn = ob;
                            break;
                        }
                    }
                    if (!player_spawn) {
                        console.log("ERROR: No player spawn found in tilemap objects!");
                        throw new Error("No player spawn found in tilemap objects!");
                    }
                    player_spawn.tx = Math.floor(player_spawn.x / 16.0);
                    player_spawn.ty = Math.floor(player_spawn.y / 16.0);
                    this.mario = new Mario(player_spawn, this, this.tilemap);
                    // CAMERA
                    phaser.camera.follow(this.mario.sprite);
                    // INPUT
                    this.kbUp = phaser.input.keyboard.addKey(Phaser.Keyboard.UP);
                    this.kbUp2 = phaser.input.keyboard.addKey(Phaser.Keyboard.W);
                    this.kbDown = phaser.input.keyboard.addKey(Phaser.Keyboard.DOWN);
                    this.kbDown2 = phaser.input.keyboard.addKey(Phaser.Keyboard.S);
                    this.kbLeft = phaser.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                    this.kbLeft2 = phaser.input.keyboard.addKey(Phaser.Keyboard.A);
                    this.kbRight = phaser.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                    this.kbRight2 = phaser.input.keyboard.addKey(Phaser.Keyboard.D);
                    this.kb1 = phaser.input.keyboard.addKey(this.smbGame.keyboardBtn1);
                    this.kb2 = phaser.input.keyboard.addKey(this.smbGame.keyboardBtn2);
                };
                LevelScene.prototype.destroy = function () {
                    this.hudGroup.destroy();
                };
                LevelScene.prototype.update = function () {
                    phaser.physics.arcade.collide(this.mario.sprite, this.blocksLayer);
                    var in_right = this.kbRight.isDown || this.kbRight2.isDown || (gamepad1 && gamepad1.axis(0) > 0.0);
                    var in_left = this.kbLeft.isDown || this.kbLeft2.isDown || (gamepad1 && gamepad1.axis(0) < 0.0);
                    var in_action = this.kb1.isDown || (gamepad1 && gamepad1.isDown(this.smbGame.gamepadBtn1));
                    var in_jump = this.kb2.isDown || (gamepad1 && gamepad1.isDown(this.smbGame.gamepadBtn2));
                    this.mario.update(in_right, in_left, in_jump, in_action);
                };
                LevelScene.prototype.render = function () {
                    if (debugMode) {
                        this.mario.debugRender();
                    }
                };
                Object.defineProperty(LevelScene.prototype, "HUDCoins", {
                    get: function () { return this.gameSession.player.coins; },
                    set: function (_coins) {
                        this.gameSession.player.coins = _coins;
                        var coins_txt = _coins.toString();
                        if (coins_txt.length < 2) {
                            coins_txt = '0' + coins_txt;
                        }
                        this.hudCoins.text = "x" + coins_txt;
                    },
                    enumerable: true,
                    configurable: true
                });
                LevelScene.prototype.giveCoin = function () {
                    this.HUDCoins += 1;
                    sfx.coin.play();
                };
                LevelScene.prototype.activateItem = function (_blockTile) {
                    // - Get ITEMS layer index
                    var items_layer = this.tilemap.getLayerIndex(LAYER_ITEMS);
                    // - Check ITEMS layer index for special or -1
                    var item_index = this.tilemap.getTile(_blockTile.x, _blockTile.y, items_layer, true).index;
                    if (item_index === -1) {
                        // - If -1 and item is question block then default to single coin
                        if (_blockTile.index === BLOCK_ITEM) {
                            this.giveCoin();
                        }
                    }
                    else {
                        console.log("Item activated! " + item_index);
                        if (item_index === ITEM_COIN) {
                            this.giveCoin();
                        }
                    }
                };
                return LevelScene;
            }(Scene));
            ;
            //----------------- MARIO
            MARIO_WALK_SPEED = 16 * 12;
            MARIO_WALK_ACCEL = 16 * 20;
            MARIO_RUN_SPEED = 16 * 18;
            MARIO_RUN_ACCEL = 16 * 18;
            MARIO_WALK_FPS = 15;
            MARIO_RUN_FPS = 30;
            MARIO_BRAKING_ACCEL_MUL = 3;
            MARIO_JUMP_FORCE_DURATION = 0.33;
            Mario = (function () {
                function Mario(start_object, _level, _tilemap) {
                    this.name = "mario";
                    this.startObject = start_object;
                    this.level = _level;
                    this.tilemap = _tilemap;
                    // Sprite and Animations
                    this.sprite = phaser.add.sprite(this.startObject.x * RESMULX + 16, this.startObject.y * RESMULY + 32, 'smb1atlas');
                    this.sprite.anchor.set(0.5, 1.0);
                    this.sprite.scale.set(2.0);
                    this.sprite.frameName = 'smario0_0.png';
                    // Physics
                    phaser.physics.enable(this.sprite, Phaser.Physics.ARCADE);
                    this.sprite.body.collideWorldBounds = true;
                    this.sprite.body.setSize(16, 16, 0, 0);
                    // - idle
                    this.sprite.animations.add('idle', ['smario0_0.png'], 0);
                    // - running
                    var frs = Phaser.Animation.generateFrameNames('smario0_', 3, 5, '.png');
                    frs.push('smario0_4.png');
                    this.sprite.animations.add('run', frs, MARIO_WALK_FPS, true);
                    // - braking
                    this.sprite.animations.add('brake', ['smario0_2.png'], 0);
                    // - jumping
                    this.sprite.animations.add('jump', ['smario0_6.png'], 0);
                    // - initial
                    this.sprite.animations.play('idle');
                    // - Locomotion
                    this.horizMovement = 0.0;
                    this.jumpInput = false;
                    this.jumpInputHit = false;
                    this.jumpInputHeld = false;
                    this.jumpTime = 0.0;
                    this.isJumping = false;
                    this.isFalling = false;
                    this.hspeed = 0.0;
                    this.vspeed = 0.0;
                    this.fspeed = 0.0;
                }
                Mario.prototype.update = function (in_right, in_left, in_jump, in_action) {
                    if (in_right) {
                        this.horizMovement = 1.0;
                    }
                    else if (in_left) {
                        this.horizMovement = -1.0;
                    }
                    else {
                        this.horizMovement = 0.0;
                    }
                    if (!this.jumpInput && in_jump) {
                        this.jumpInputHit = true;
                    }
                    else {
                        this.jumpInputHit = false;
                    }
                    this.jumpInput = in_jump;
                    this.actionInput = in_action;
                    this.runLocomotion();
                };
                // Locomotion:
                Mario.prototype.runLocomotion = function () {
                    // Blocked Left/Right/Up/Down
                    var is_lblocked = this.sprite.body.blocked.left;
                    var is_rblocked = this.sprite.body.blocked.right;
                    var is_ublocked = this.sprite.body.blocked.up;
                    var is_dblocked = this.sprite.body.blocked.down;
                    // Braking
                    var is_braking = false;
                    if ((this.hspeed > 0.0 && this.horizMovement < 0.0) || (this.hspeed < 0.0 && this.horizMovement > 0.0)) {
                        is_braking = true;
                    }
                    // Jumping
                    if (this.jumpInputHit && is_dblocked && !this.isJumping && this.sprite.animations.name !== 'jump') {
                        this.isJumping = true;
                        this.jumpInputHeld = true;
                        this.jumpTime = 0.0;
                        this.sprite.body.velocity.y = -MAX_SPEED;
                        sfx.jump.play();
                    }
                    if (this.isJumping) {
                        if (!this.isFalling) {
                            this.jumpTime = Math.min(MARIO_JUMP_FORCE_DURATION, this.jumpTime + phaser.time.physicsElapsed);
                            if (this.jumpInputHeld) {
                                if (!this.jumpInput) {
                                    this.jumpInputHeld = false;
                                }
                                else if (this.jumpTime < MARIO_JUMP_FORCE_DURATION) {
                                    // This allows velocity force to apply as long as the button is held for MARIO_JUMP_FORCE_DURATION seconds.
                                    // Modify this to introduce higher jumps when sprinting.
                                    this.sprite.body.velocity.y = -MAX_SPEED + (MAX_SPEED * 0.5 * (this.jumpTime / MARIO_JUMP_FORCE_DURATION));
                                }
                            }
                            if (is_ublocked) {
                                var b_sfx_bump = true;
                                this.sprite.body.velocity.y = 0.0;
                                // Player hit something above
                                // - Convert player position to tile coords using mid-point
                                var tx = Math.floor(this.sprite.body.center.x / (this.tilemap.tileWidth * 2));
                                var ty = Math.floor(this.sprite.body.center.y / (this.tilemap.tileHeight * 2));
                                if (ty > 0) {
                                    // - Find out what's on top of player 
                                    var blocks_layer = this.tilemap.getLayerIndex(LAYER_BLOCKS);
                                    var t = this.tilemap.getTile(tx, ty - 1, blocks_layer);
                                    if (t) {
                                        console.log("Ooooh we jump-hit something: " + t.index);
                                        // - Check to see if that thing is bound to an active object
                                        //   Use block objects for this, you can detect block object through tile if the type is active.
                                        //   You can retrieve tile through block object.
                                        //   Currently two active block objects only: brick, question block.
                                        if (t.properties.activeBlock !== undefined) {
                                            // - Call function: hit_tile->activeObject->hit(player)
                                            t.properties.activeBlock.hit(this);
                                        }
                                    }
                                    else {
                                        console.log("We have nothing above. Need motion correction!");
                                        b_sfx_bump = false;
                                    }
                                }
                                else {
                                    console.log("Ty = 0 and it detected hitting. This shouldn't happen once I unblock the world top edge.");
                                    b_sfx_bump = false;
                                }
                                if (b_sfx_bump) {
                                    sfx.bump.play();
                                }
                            }
                            if (this.sprite.body.velocity.y >= 0.0) {
                                this.isFalling = true;
                            }
                        }
                        else if (is_dblocked) {
                            this.isJumping = false;
                            this.isFalling = false;
                        }
                    }
                    // Horizontal Motion 
                    var WalkSpeed = MARIO_WALK_SPEED;
                    var WalkAccel = MARIO_WALK_ACCEL;
                    var BrakeAccelMul = MARIO_BRAKING_ACCEL_MUL;
                    var WalkFPS = MARIO_WALK_FPS;
                    if (this.actionInput) {
                        WalkSpeed = MARIO_RUN_SPEED;
                        WalkAccel = MARIO_RUN_ACCEL;
                        WalkFPS = MARIO_RUN_FPS;
                    }
                    var accel = is_braking ? WalkAccel * BrakeAccelMul : WalkAccel;
                    if (this.horizMovement > 0.0) {
                        if (!is_rblocked) {
                            this.hspeed = Math.min(WalkSpeed, this.hspeed + (accel * phaser.time.physicsElapsed));
                        }
                        else {
                            this.hspeed = 1.0;
                        }
                    }
                    else if (this.horizMovement < 0.0) {
                        if (!is_lblocked) {
                            this.hspeed = Math.max(-WalkSpeed, this.hspeed - (accel * phaser.time.physicsElapsed));
                        }
                        else {
                            this.hspeed = -1.0;
                        }
                    }
                    else {
                        if (this.hspeed > 0.0) {
                            if (!is_rblocked) {
                                if (!this.isJumping) {
                                    this.hspeed = Math.max(0.0, this.hspeed - (WalkAccel * phaser.time.physicsElapsed));
                                }
                            }
                            else {
                                this.hspeed = 0;
                            }
                        }
                        else if (this.hspeed < 0.0) {
                            if (!is_lblocked) {
                                if (!this.isJumping) {
                                    this.hspeed = Math.min(0.0, this.hspeed + (WalkAccel * phaser.time.physicsElapsed));
                                }
                            }
                            else {
                                this.hspeed = 0;
                            }
                        }
                    }
                    // Frame Animation
                    if (this.isJumping) {
                        if (this.sprite.animations.name !== 'jump') {
                            this.sprite.animations.play('jump');
                        }
                    }
                    else if (is_braking) {
                        if (this.sprite.animations.name !== 'brake') {
                            this.sprite.animations.play('brake');
                        }
                    }
                    else if (Math.abs(this.hspeed) > 0.0) {
                        this.fspeed = Math.min(Math.ceil((Math.abs(this.hspeed) / WalkSpeed) * (WalkFPS - 5)) + 5, WalkFPS);
                        if (this.sprite.animations.name !== 'run') {
                            this.sprite.animations.play('run', this.fspeed);
                        }
                        else if (this.sprite.animations.currentAnim.speed !== this.fspeed) {
                            this.sprite.animations.currentAnim.speed = this.fspeed;
                        }
                    }
                    else {
                        if (this.sprite.animations.name !== 'idle') {
                            this.sprite.animations.play('idle');
                        }
                    }
                    // Body Updates
                    this.sprite.body.velocity.x = this.hspeed;
                    this.sprite.body.velocity.y = clamp(this.sprite.body.velocity.y, -MAX_SPEED, MAX_SPEED);
                    if (!this.isJumping) {
                        if (this.hspeed > 0.0) {
                            this.sprite.scale.x = is_braking ? -2.0 : 2.0;
                        }
                        else if (this.hspeed < 0.0) {
                            this.sprite.scale.x = is_braking ? 2.0 : -2.0;
                        }
                    }
                    if (debugBar) {
                        debugBar.text = "Blocked  left right up down: ";
                        debugBar.text += (this.sprite.body.blocked.left ? "Yes " : "No ");
                        debugBar.text += (this.sprite.body.blocked.right ? "Yes " : "No ");
                        debugBar.text += (this.sprite.body.blocked.up ? "Yes " : "No ");
                        debugBar.text += (this.sprite.body.blocked.down ? "Yes " : "No ");
                    }
                };
                Mario.prototype.debugRender = function () {
                    phaser.debug.body(this.sprite);
                };
                return Mario;
            }());
            ;
            document.body.innerHTML = '';
            game = new SMBGame();
        }
    }
});

//# sourceMappingURL=main.js.map
