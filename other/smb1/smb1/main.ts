/// <reference path="../phaser262/typescript/phaser.d.ts" />

import '../phaser262/build/phaser.min.js';

const WIDTH     = 512.0;
const HEIGHT    = 480.0;
const RESMULX   = 2.0;
const RESMULY   = 2.0;
const GRAVITY   = 16 * 220;
const MAX_SPEED = 16 * 40;

const COLOR_SKY     = 0x5c94fc;
const COLOR_BLACK   = 0x000000;
const COLOR_WHITE   = 0xffffff;


const debugMode             = false;
const enableDebugBar        = true;
const enableFPS             = true;
let debugBar:   Phaser.Text = null;

let phaser:     Phaser.Game = null;
let gamepad1:   Phaser.SinglePad = null; // First GamePad
let sfx = {
    coin: null,
    bump: null,
    jump: null,
};

////////////////////////////////////////////////////// Utils
function clamp(num, min, max):number {
  return num <= min ? min : num >= max ? max : num;
}

////////////////////////////////////////////////////// SMBGame
class SMBGame {
    static instance:SMBGame         = null;
    
    currentScene:   Scene           = null; 
    gameSession:    GameSession     = null;
    player:         Player          = null;
    gamepadBtn1:    number          = 0;        // Defaults to Button 1
    gamepadBtn2:    number          = 1;        // Defaults to Button 2
    keyboardBtn1:   number          = 90;       // Defaults to 'z' keycode
    keyboardBtn2:   number          = 88;       // Defaults to 'x' keycode
    fpsText:        Phaser.Text     = null;

    public constructor() {
        SMBGame.instance = this;
        phaser = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { 
            preload: () => { this.preload(); },
            create: () => { this.create(); },
            update: () => { this.update(); }, 
            render: () => { this.render(); } 
        }, false, false);
    }

    public preload() {
        phaser.stage.backgroundColor = COLOR_SKY;
        phaser.load.image('logo', './smb1/assets/title.fw.png');
        phaser.load.bitmapFont('smb', './smb1/assets/fonts/emulogic_0.png', './smb1/assets/fonts/emulogic.fnt');
        phaser.load.audio('coin', './smb1/assets/sfx/smb_coin.wav');
        phaser.load.audio('bump', './smb1/assets/sfx/smb_bump.wav');
        phaser.load.audio('jump', './smb1/assets/sfx/smb_jump-small.wav');
        phaser.load.atlas('smb1atlas', './smb1/assets/sprites/smb1atlas.png', './smb1/assets/sprites/smb1atlas.json');
        
        phaser.load.tilemap('level11', './smb1/assets/levels/world11.json', null, Phaser.Tilemap.TILED_JSON);
        phaser.load.image('level1_ss', './smb1/assets/levels/world11.png');
    }

    public create():void {
        // Init sound effects
        sfx.coin =          phaser.add.audio('coin');
        sfx.bump =          phaser.add.audio('bump');
        sfx.jump =    phaser.add.audio('jump');
        // Gamepad
        phaser.input.gamepad.start();
        if(phaser.input.gamepad.supported && phaser.input.gamepad.active) {
            gamepad1 = phaser.input.gamepad.pad1;
        }
        
        // Debug text at top for emitting continuous debug info (more effective than using console)
        if(enableDebugBar) {
            debugBar = phaser.add.text(1, 1, "", {font: "bold 11px Lucida Console", fill: "#fff"});
            debugBar.setShadow(1, 1, 'rgba(0, 0, 0, 0.5)', 0);
            debugBar.wordWrap = true;
            debugBar.wordWrapWidth = WIDTH - 2;
            debugBar.lineSpacing = -7;
            debugBar.fixedToCamera = true;
        }
        if(enableFPS) {
            this.fpsText = phaser.add.text(WIDTH - 16, 1, "00", {font: "bold 11px Lucida Console", fill: '#fcbcb0'});
            this.fpsText.setShadow(1, 1, '#000', 0);
            this.fpsText.fixedToCamera = true;
            phaser.time.advancedTiming = true;
        }
        
        // Start scene
        let start_screen:StartScreen = new StartScreen(this);
        this.changeScene(start_screen);
    }

    public update():void {
        // Update fps
        if(enableFPS) {
            this.fpsText.text = Math.floor(phaser.time.fps).toString();
        }
        // Update gamepad1
        if(phaser.input.gamepad.supported && phaser.input.gamepad.active && phaser.input.gamepad.pad1.connected) {
            gamepad1 = phaser.input.gamepad.pad1;
        } else {
            gamepad1 = null;
        }
        // Update scene
        if(this.currentScene) {
            this.currentScene.update();
        }
    }

    public render():void {
        if(this.currentScene) {
            this.currentScene.render();
        }
    }
    
    public changeScene(scene:Scene):void {
        if(scene) {
            if(this.currentScene) {
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
            let t = phaser.time.events.add(0.2 * 1000, () => { 
                scene.create(); 
                if(debugBar) {
                    phaser.world.addChild(debugBar);
                }
                if(this.fpsText) {
                    phaser.world.addChild(this.fpsText); 
                }
                phaser.world.visible = true;
                this.currentScene = scene;
            });
        }
    }
    
    public startGame():void {
        this.player = new Player();
        this.gameSession = new GameSession(this.player);
        let info_screen:InfoScreen = new InfoScreen(this, this.gameSession);
        this.changeScene(info_screen);
    }
    
    public startLevel():void {
        let level_scene:LevelScene = new LevelScene(this, this.gameSession);
        this.changeScene(level_scene);
    }
};

////////////////////////////////////////////////////// GameSession
class GameSession {
    public world: number;
    public stage: number;
    public player: Player;
    
    constructor(_player) {
        this.world = 1;
        this.stage = 1;
        this.player = _player;
    }
};

////////////////////////////////////////////////////// Player
class Player {
    score: number;
    coins: number;
    lives: number;
    
    constructor() {
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
    }
};

////////////////////////////////////////////////////// Scenes
class Scene {
    smbGame:SMBGame;
    constructor(smb_game:SMBGame) { this.smbGame = smb_game; };
    public create():void { };
    public update():void { };
    public render():void { };
    public destroy():void { };
};

///////////////////////////// StartScreen
class StartScreen extends Scene {
    btn2Text:       Phaser.BitmapText   = null;
    boundBtn1:      boolean             = false;
    originalKBOwner:any;
    
    public create():void {
        phaser.stage.backgroundColor = 0x5c94fc;
        
        let logo = phaser.add.sprite(phaser.world.centerX, phaser.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 1.0);
        logo.scale.setTo(2.0, 2.0);
        
        let copyright_txt = phaser.add.bitmapText(104 * RESMULX, 119 * RESMULY, 'smb', '\xA91985 NINTENDO', 12 * RESMULX);
        copyright_txt.tint = 0xfcbcb0;
        phaser.add.bitmapText(18 * RESMULX, 142 * RESMULY, 'smb', 'PRESS-BIND BUTTON 1 = ACTION', 12 * RESMULX);
        
        this.btn2Text = phaser.add.bitmapText(24 * RESMULX, 154 * RESMULY, 'smb', 'PRESS-BIND BUTTON 2 = JUMP', 12 * RESMULX);
        this.btn2Text.visible = false;
        
        this.originalKBOwner = phaser.input.keyboard.onDownCallback;
        phaser.input.keyboard.onDownCallback = () => { this.onAnyKeyDown(); };
    }
    
    public update():void {
        if(gamepad1) {
            for(let ib = 0; ib < 4; ++ib) {
                if(gamepad1.isDown(ib)) {
                    if(!this.boundBtn1) {
                        // Action
                        this.smbGame.gamepadBtn1 = ib;
                        this.boundBtn1 = true;
                        this.btn2Text.visible = true;
                        sfx.bump.play();
                    } else {
                        // Jump
                        if(ib !== this.smbGame.gamepadBtn1) {
                            this.smbGame.gamepadBtn2 = ib;
                            this.startGame();
                        }
                    }
                }
            }
        }
    }
    
    public onAnyKeyDown() {
        let kc:number = phaser.input.keyboard.lastKey.keyCode;
        if(!this.boundBtn1) {
            this.smbGame.keyboardBtn1 = kc;
            this.boundBtn1 = true;
            this.btn2Text.visible = true;
            sfx.bump.play();
        } else {
            if(kc !== this.smbGame.keyboardBtn1) {
                this.smbGame.keyboardBtn2 = kc;
                this.startGame();
            }
        }
    }
    
    public startGame():void {
        phaser.input.keyboard.onDownCallback = this.originalKBOwner;
        sfx.coin.play();
        this.smbGame.startGame();
    }
};

////////////////////////////// InfoScreen
class InfoScreen extends Scene {
    gameSession: GameSession;
    
    constructor(smb_game:SMBGame, game_session:GameSession) {
        super(smb_game);
        this.gameSession = game_session;
    }
    
    public create():void {
        phaser.stage.backgroundColor = 0x000000;
        
        // Name and Score
        let score_txt = this.gameSession.player.score.toString();
        while(score_txt.length < 6) {
            score_txt = '0' + score_txt;
        }
        phaser.add.bitmapText(24 * RESMULX, 14 * RESMULY, 'smb', 'MARIO', 12 * RESMULX);
        phaser.add.bitmapText(24 * RESMULX, 22 * RESMULY, 'smb', score_txt, 12 * RESMULX);
        
        // Coins
        let coin:Phaser.Sprite = phaser.add.sprite(89 * RESMULX, 24 * RESMULY, 'smb1atlas');
        coin.scale.set(2.0);
        let fnames:Array<string> = Phaser.Animation.generateFrameNames('scoin0_', 0, 2, '.png');
        fnames.push('scoin0_1.png');
        fnames.push('scoin0_0.png');
        coin.animations.add('bling', fnames, 5, true);
        coin.animations.play('bling');
        let coins_txt = this.gameSession.player.coins.toString();
        if(coins_txt.length < 2) {
            coins_txt = '0' + coins_txt;
        }
        coins_txt = 'x' + coins_txt;
        phaser.add.bitmapText(96 * RESMULX, 22 * RESMULY, 'smb', coins_txt, 12 * RESMULX);
        
        // World
        let stage_txt:string = this.gameSession.world.toString() + '-' + this.gameSession.stage.toString();
        phaser.add.bitmapText(144 * RESMULX, 14 * RESMULY, 'smb', 'WORLD', 12 * RESMULX);
        phaser.add.bitmapText(152 * RESMULX, 22 * RESMULY, 'smb', stage_txt, 12 * RESMULX);
        phaser.add.bitmapText(87 * RESMULX, 78 * RESMULY, 'smb', 'WORLD ' + stage_txt, 12 * RESMULX);
        
        // Time
        phaser.add.bitmapText(200 * RESMULX, 14 * RESMULY, 'smb', 'TIME', 12 * RESMULX);
        
        // Mario x lives
        let mario:Phaser.Sprite = phaser.add.sprite(97 * RESMULX, 105 * RESMULY, 'smb1atlas');
        mario.scale.set(2.0);
        mario.frameName = 'smario0_0.png';
        phaser.add.bitmapText(120 * RESMULX, 110 * RESMULY, 
            'smb', 'x  ' + this.gameSession.player.lives.toString(), 12 * RESMULX);
            
        // Timer for starting level
        phaser.time.events.add(3.0 * 1000, () => { this.smbGame.startLevel(); });
    }
};

///////////////////////////// LevelScene
const LAYER_BLOCKS              = "BLOCKS";
const LAYER_BG                  = "BG";
const LAYER_ITEMS               = "ITEMS";
const BLOCK_ITEM                = 8;
const BLOCK_BRICK               = 54;
const ITEM_GROWTH               = 66;
const ITEM_LIFE                 = 67;
const ITEM_FLOWER               = 68;
const ITEM_COIN                 = 69;
const BUMP_DISTANCE             = 8;

class ActiveBlock {
    level:      LevelScene;
    tile:       Phaser.Tile;
    sprite:     Phaser.Sprite;
    tween:      Phaser.Tween;
    
    constructor(_level:LevelScene, _tile:Phaser.Tile, _group:Phaser.Group) {
        this.level = _level;
        this.tile = _tile;
        this.tween = null;
        this.sprite = null;

        this._createSprite(_group);
    } 
    
    private _createSprite(_group:Phaser.Group): void {
        if(this.tile.index === BLOCK_ITEM) {
            this.sprite = phaser.add.sprite(this.tile.x * 32, this.tile.y * 32, 'smb1atlas', 'itemtile0.png', _group);
            this.sprite.scale.set(2.0);
            let frs:Array<string> = ["itemtile0.png", "itemtile1.png", "itemtile2.png", 'itemtile1.png', 'itemtile0.png'];
            this.sprite.animations.add('bling', frs, 5, true);
            this.sprite.animations.add('solid', ["solidtile0.png"]);
            this.sprite.animations.play('bling'); 
        } else if(this.tile.index === BLOCK_BRICK) {
            this.sprite = phaser.add.sprite(this.tile.x * 32, this.tile.y * 32, 'smb1atlas', 'bricktile0.png', _group);
            this.sprite.scale.set(2.0);
        }
        this.tile.alpha = 0.0;
        this.tile.properties.activeBlock = this;
    }
    
    public hit(by_actor:any):void {
        if(this.tile.index === BLOCK_ITEM) {
            if(this.sprite.animations.currentAnim.name !== 'solid') {
                this.sprite.animations.play('solid');
                this._bumpBlock();
                this.level.activateItem(this.tile);
            } else {
                // Do nothing, block solid
            }
        } else if(this.tile.index === BLOCK_BRICK) {
            this._bumpBlock();
            this.level.activateItem(this.tile);
        }
    }
    
    private _bumpBlock():void {
        if(this.tween) {
            this.tween.stop(true);
            this.sprite.y = this.tile.y * 32;
        }
        this.tween = phaser.add.tween(this.sprite).to({y: this.sprite.y - BUMP_DISTANCE}, 100, "Linear", true, 0, 0, true);
    }
};

class LevelScene extends Scene {
    gameSession:        GameSession;
    
    hudScore:           Phaser.BitmapText;
    hudCoins:           Phaser.BitmapText;
    hudTime:            Phaser.BitmapText;
    
    tilemap:            Phaser.Tilemap;
    objectsLayer:       Phaser.TilemapLayer;
    blocksLayer:        Phaser.TilemapLayer;
    BGLayer:            Phaser.TilemapLayer;
    hudGroup:           Phaser.Group;
    mario:              Mario;
    activeBlocks:       Array<ActiveBlock>;
    questionMarksGroup: Phaser.Group;
    
    kbUp:               Phaser.Key;
    kbDown:             Phaser.Key;
    kbLeft:             Phaser.Key;
    kbRight:            Phaser.Key;
    kbUp2:              Phaser.Key;      // For own sanity, WSAD will be added as secondary cursors
    kbDown2:            Phaser.Key;
    kbLeft2:            Phaser.Key;
    kbRight2:           Phaser.Key;
    kb1:                Phaser.Key;
    kb2:                Phaser.Key;
    
    constructor(smb_game:SMBGame, game_session:GameSession) {
        super(smb_game);
        this.gameSession = game_session;
    }
    
    public create():void {
        phaser.stage.backgroundColor = COLOR_SKY;
        
        // HUD Group
        this.hudGroup = phaser.add.group(undefined, 'hud', true);
        
        // HUD / MARIO
        let score_txt = this.gameSession.player.score.toString();
        while(score_txt.length < 6) {
            score_txt = '0' + score_txt;
        }
        phaser.add.bitmapText(24 * RESMULX, 14 * RESMULY, 'smb', 'MARIO', 12 * RESMULX, this.hudGroup);
        this.hudScore = phaser.add.bitmapText(24 * RESMULX, 22 * RESMULY, 'smb', score_txt, 12 * RESMULX, this.hudGroup);
        
        // HUD / COINS
        let coin:Phaser.Sprite = phaser.add.sprite(89 * RESMULX, 24 * RESMULY, 'smb1atlas', undefined, this.hudGroup);
        coin.scale.set(RESMULX, RESMULY);
        let fnames:Array<string> = Phaser.Animation.generateFrameNames('scoin0_', 0, 2, '.png');
        fnames.push('scoin0_1.png');
        fnames.push('scoin0_0.png');
        coin.animations.add('bling', fnames, 5, true);
        coin.animations.play('bling');
        let coins_txt = this.gameSession.player.coins.toString();
        if(coins_txt.length < 2) {
            coins_txt = '0' + coins_txt;
        }
        coins_txt = 'x' + coins_txt;
        this.hudCoins = phaser.add.bitmapText(96 * RESMULX, 22 * RESMULY, 'smb', coins_txt, 12 * RESMULX, this.hudGroup);
        
        // HUD / WORLD
        let stage_txt:string = this.gameSession.world.toString() + '-' + this.gameSession.stage.toString();
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
        if(debugMode) {
            this.blocksLayer.debug = true;
        }
        
        // Objects: SPAWNER
        this.activeBlocks = new Array<ActiveBlock>();
        this.questionMarksGroup = phaser.add.group(undefined, 'questionMarks');
        let blocks_layer = this.tilemap.getLayerIndex(LAYER_BLOCKS);
        let les_blocks = this.tilemap.layers[blocks_layer];
        {
            // Object returned isn't TilemapLayer but it isn't exactly BLOCKS from the json file.
            // It has the basic width/height x/y visible properties and a data array of 15 arrays
            // each 128 Tile object.
            // These the properties in Layer object:
            // alpha=1, bodies=[], callbacks=[], data=[array of arrays 15*128], dirty=false, height=15, heightInPixels=240
            // indexes=[], name="BLOCKS", properties=__proto__, visible=true, width=128, widthInPixels=2048, x=0, y=0
            for(let r = 0; r < les_blocks.height; ++r) {
                for(let c = 0; c < les_blocks.width; ++c) {
                    let qb:Phaser.Tile = les_blocks.data[r][c];
                    if(!qb) {
                        console.log("Retrieved data tile from les_blocks is invalid.");
                    } else if(qb.index === BLOCK_BRICK || qb.index === BLOCK_ITEM) {
                        // Creates cover sprite if needed. Registers active object handler.
                        this.activeBlocks.push(new ActiveBlock(this, qb, this.questionMarksGroup));
                    }
                }
            }
            console.log("Active blocks count: " + this.activeBlocks.length);
        }
        
        // Objects: OBJECTS and player spawn
        let les_objects = this.tilemap.objects['OBJECTS'];
        let player_spawn = null;
        for(let ob of les_objects) {
            if(ob.name === "mario") {
                player_spawn = ob;
                break;
            }
        }
        if(!player_spawn) {
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
    }
    
    public destroy():void {
        this.hudGroup.destroy();
    }
    
    public update():void {
        phaser.physics.arcade.collide(this.mario.sprite, this.blocksLayer);
        
        let in_right = this.kbRight.isDown || this.kbRight2.isDown || (gamepad1 && gamepad1.axis(0) > 0.0);
        let in_left = this.kbLeft.isDown || this.kbLeft2.isDown || (gamepad1 && gamepad1.axis(0) < 0.0);
        let in_action = this.kb1.isDown || (gamepad1 && gamepad1.isDown(this.smbGame.gamepadBtn1));
        let in_jump = this.kb2.isDown || (gamepad1 && gamepad1.isDown(this.smbGame.gamepadBtn2));
        
        this.mario.update(in_right, in_left, in_jump, in_action);
    }
    
    public render():void {
        if(debugMode) {
            this.mario.debugRender();
        }
    }
    
    private get HUDCoins(): number { return this.gameSession.player.coins; }
    private set HUDCoins(_coins:number) { 
        this.gameSession.player.coins = _coins;
        let coins_txt:string = _coins.toString();
        if(coins_txt.length < 2) {
            coins_txt = '0' + coins_txt;
        }
        this.hudCoins.text = "x" + coins_txt;
    }
    
    public giveCoin():void {
        this.HUDCoins += 1;
        sfx.coin.play();
    }
    
    public activateItem(_blockTile: Phaser.Tile): void {
        // - Get ITEMS layer index
        let items_layer = this.tilemap.getLayerIndex(LAYER_ITEMS);
        // - Check ITEMS layer index for special or -1
        let item_index: number = this.tilemap.getTile(_blockTile.x, _blockTile.y, items_layer, true).index;
        if(item_index === -1) {
            // - If -1 and item is question block then default to single coin
            if(_blockTile.index === BLOCK_ITEM) {
                this.giveCoin();
            }
        } else {
            console.log("Item activated! " + item_index);
            if(item_index === ITEM_COIN) {
                this.giveCoin();
            }
        }
    }
};

//----------------- MARIO
const MARIO_WALK_SPEED          = 16 * 12;
const MARIO_WALK_ACCEL          = 16 * 20;
const MARIO_RUN_SPEED           = 16 * 18;
const MARIO_RUN_ACCEL           = 16 * 18;
const MARIO_WALK_FPS            = 15;
const MARIO_RUN_FPS             = 30;
const MARIO_BRAKING_ACCEL_MUL   = 3;
const MARIO_JUMP_FORCE_DURATION = 0.33;

class Mario {
    name:               string;
    startObject:        any; // x, y: player spawn coords.
    level:              LevelScene;
    tilemap:            Phaser.Tilemap;
    sprite:             Phaser.Sprite;
    horizMovement:      number;
    jumpInput:          boolean;
    jumpInputHit:       boolean;
    jumpInputHeld:      boolean;
    jumpTime:           number;
    actionInput:        boolean;
    isJumping:          boolean;
    isFalling:          boolean;
    hspeed:             number;     // Horizontal linear speed
    vspeed:             number;     // Vertical linear speed
    fspeed:             number;     // Animation frames speed
    
    constructor(start_object, _level, _tilemap) {
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
        let frs:Array<string> = Phaser.Animation.generateFrameNames('smario0_', 3, 5, '.png');
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
    
    public update(in_right, in_left, in_jump, in_action):void {
        if(in_right) {
            this.horizMovement = 1.0;
        } else if (in_left) {
            this.horizMovement = -1.0;
        } else {
            this.horizMovement = 0.0;
        }
        if(!this.jumpInput && in_jump) {
            this.jumpInputHit = true;
        } else {
            this.jumpInputHit = false;
        }
        this.jumpInput = in_jump;
        this.actionInput = in_action;
        this.runLocomotion();
    }
    
    // Locomotion:
    protected runLocomotion():void {
        // Blocked Left/Right/Up/Down
        let is_lblocked = this.sprite.body.blocked.left;
        let is_rblocked = this.sprite.body.blocked.right;
        let is_ublocked = this.sprite.body.blocked.up;
        let is_dblocked = this.sprite.body.blocked.down;
        
        // Braking
        let is_braking = false;
        if((this.hspeed > 0.0 && this.horizMovement < 0.0) || (this.hspeed < 0.0 && this.horizMovement > 0.0)) {
            is_braking = true;
        }
        
        // Jumping
        if(this.jumpInputHit && is_dblocked && !this.isJumping && this.sprite.animations.name !== 'jump') {
            this.isJumping = true;
            this.jumpInputHeld = true;
            this.jumpTime = 0.0;
            this.sprite.body.velocity.y = -MAX_SPEED;
            sfx.jump.play();
        }
        if(this.isJumping) {
            if(!this.isFalling) {
                this.jumpTime = Math.min(MARIO_JUMP_FORCE_DURATION, this.jumpTime + phaser.time.physicsElapsed);
                if(this.jumpInputHeld) {
                    if(!this.jumpInput) {
                        this.jumpInputHeld = false;
                    } else if(this.jumpTime < MARIO_JUMP_FORCE_DURATION) {
                        // This allows velocity force to apply as long as the button is held for MARIO_JUMP_FORCE_DURATION seconds.
                        // Modify this to introduce higher jumps when sprinting.
                        this.sprite.body.velocity.y = -MAX_SPEED + (MAX_SPEED * 0.5 * (this.jumpTime / MARIO_JUMP_FORCE_DURATION));
                    }
                }
                if(is_ublocked) {
                    let b_sfx_bump = true;
                    this.sprite.body.velocity.y = 0.0;
                    // Player hit something above
                    // - Convert player position to tile coords using mid-point
                    let tx = Math.floor(this.sprite.body.center.x / (this.tilemap.tileWidth * 2));
                    let ty = Math.floor(this.sprite.body.center.y / (this.tilemap.tileHeight * 2));
                    if(ty > 0) { // Cause we are going to be searching up ^^
                        // - Find out what's on top of player 
                        let blocks_layer = this.tilemap.getLayerIndex(LAYER_BLOCKS);
                        let t:Phaser.Tile = this.tilemap.getTile(tx, ty - 1, blocks_layer);
                        if(t) {
                            console.log("Ooooh we jump-hit something: " + t.index);
                            // - Check to see if that thing is bound to an active object
                            //   Use block objects for this, you can detect block object through tile if the type is active.
                            //   You can retrieve tile through block object.
                            //   Currently two active block objects only: brick, question block.
                            if(t.properties.activeBlock !== undefined) {
                                // - Call function: hit_tile->activeObject->hit(player)
                                t.properties.activeBlock.hit(this);
                                // Hit tile does the rest.   
                            }
                        } else {
                            console.log("We have nothing above. Need motion correction!");
                            b_sfx_bump = false;
                        }
                    } else {
                        console.log("Ty = 0 and it detected hitting. This shouldn't happen once I unblock the world top edge.");
                        b_sfx_bump = false;
                    }
                    if(b_sfx_bump) {
                        sfx.bump.play();
                    }
                }
                if(this.sprite.body.velocity.y >= 0.0) {
                    this.isFalling = true;
                }
            } else if(is_dblocked) {
                this.isJumping = false;
                this.isFalling = false;    
            }
        }
        
        // Horizontal Motion 
        let WalkSpeed = MARIO_WALK_SPEED;
        let WalkAccel = MARIO_WALK_ACCEL;
        let BrakeAccelMul = MARIO_BRAKING_ACCEL_MUL;
        let WalkFPS = MARIO_WALK_FPS;
        if(this.actionInput) {
            WalkSpeed = MARIO_RUN_SPEED;
            WalkAccel = MARIO_RUN_ACCEL;
            WalkFPS = MARIO_RUN_FPS;
        }
        let accel: number = is_braking? WalkAccel * BrakeAccelMul : WalkAccel;
        if(this.horizMovement > 0.0) {          // Right Direction
            if(!is_rblocked) {
                this.hspeed = Math.min(WalkSpeed, this.hspeed + (accel * phaser.time.physicsElapsed));
            } else {
                this.hspeed = 1.0;
            }
        } else if(this.horizMovement < 0.0) {   // Left Direction
            if(!is_lblocked) {
                this.hspeed = Math.max(-WalkSpeed, this.hspeed - (accel * phaser.time.physicsElapsed));
            } else {
                this.hspeed = -1.0;
            }
        } else {                                // No Direction
            if(this.hspeed > 0.0) {
                if(!is_rblocked) {
                    if(!this.isJumping) { // no slow down while jumping
                        this.hspeed = Math.max(0.0, this.hspeed - (WalkAccel * phaser.time.physicsElapsed));
                    }
                } else {
                    this.hspeed = 0;
                }
            } else if(this.hspeed < 0.0) {
                if(!is_lblocked) {
                    if(!this.isJumping) {  // no slow down while jumping
                        this.hspeed = Math.min(0.0, this.hspeed + (WalkAccel * phaser.time.physicsElapsed));
                    }
                } else {
                    this.hspeed = 0;
                }
            }
        }
        
        // Frame Animation
        if(this.isJumping) {
            if(this.sprite.animations.name !== 'jump') {
                this.sprite.animations.play('jump');
            }
        } else if(is_braking) {
            if(this.sprite.animations.name !== 'brake') {
                this.sprite.animations.play('brake');
            }
        } else if(Math.abs(this.hspeed) > 0.0) {
            this.fspeed = Math.min(Math.ceil((Math.abs(this.hspeed) / WalkSpeed) * (WalkFPS - 5)) + 5, WalkFPS);
            if(this.sprite.animations.name !== 'run') {
                this.sprite.animations.play('run', this.fspeed);
            } else if(this.sprite.animations.currentAnim.speed !== this.fspeed) {
                this.sprite.animations.currentAnim.speed = this.fspeed;
            }
        } else {
            if(this.sprite.animations.name !== 'idle') {
                this.sprite.animations.play('idle');
            }
        }
        
        // Body Updates
        this.sprite.body.velocity.x = this.hspeed;
        this.sprite.body.velocity.y = clamp(this.sprite.body.velocity.y, -MAX_SPEED, MAX_SPEED);
        
        if(!this.isJumping) {
            if(this.hspeed > 0.0) {
                this.sprite.scale.x = is_braking? -2.0 : 2.0;
            } else if(this.hspeed < 0.0) {
                this.sprite.scale.x = is_braking? 2.0 : -2.0;
            }
        }
        
        if(debugBar) {
            debugBar.text = "Blocked  left right up down: ";
            debugBar.text += (this.sprite.body.blocked.left? "Yes " : "No ");
            debugBar.text += (this.sprite.body.blocked.right? "Yes " : "No ");
            debugBar.text += (this.sprite.body.blocked.up? "Yes " : "No ");
            debugBar.text += (this.sprite.body.blocked.down? "Yes " : "No ");
        }
    }
    
    public debugRender():void {
        phaser.debug.body(this.sprite);
    }
};

document.body.innerHTML = '';
 
let game = new SMBGame();
