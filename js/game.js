var playState = {
  preload: function () {
    game.time.advancedTiming = true
    //el preoload es carrega en memòria.

    //carregar les img que seran utilitzades ('nom', 'ruta/img')
    game.load.image('wall','assets/wall.png')
    game.load.image('ground','assets/ground.png')
    game.load.image('coin','assets/coin.png')
    game.load.image('enemy', 'assets/enemy.png')
    game.load.image('dust', 'assets/dust.png')

    game.load.audio('coin',['assets/coin.wav', 'assets/coin.mp3'])
    game.load.audio('dust',['assets/dust.wav', 'assets/dust.mp3'])
    game.load.audio('jump',['assets/jump.wav', 'assets/jump.mp3'])
    game.load.audio('dead',['assets/dead.wav', 'assets/dead.mp3'])

    //28 i 22 és perque la img player.png està tots els moviments de player, al haver-hi 6 skins, s'ha divit en tres columnes i s'ha partit per la mitat la plantila.
    game.load.spritesheet('player','assets/player.png', 28,22)
  },

  create: function () {
    // game.physics.startSystem(Phaser.Physics.ARCADE)
    //Per moure el joc.
    this.cursor = game.input.keyboard.createCursorKeys()

    //el paràmetr 0.1 és la duració del so.
    this.coinSound = game.add.audio('coin', 0.1)
    this.dustSound = game.add.audio('dust', 0.1)
    this.jumpSound = game.add.audio('jump', 0.1)
    this.deadSound = game.add.audio('dead', 0.1)

    this.loadLevel()

    // el 0 és per dir quina img s'ha de carregar dels jugadors (diferents moviments durant el joc, 0,1 2, 3, 4...)
    this.player = game.add.sprite(250,50, 'player',0)

    //tipus de fisica que s'aplicarà.
    game.physics.arcade.enable(this.player)

    //body fa referencia al cos del jugador
    this.player.body.gravity.y = 600

    this.player.animations.add('idle',[3,4,5,4], 5, true)

    this.jumping = false
    this.playerDead = false


    //Particules de quan salta.
                                //posició i num max de particules
    this.dustParticles = game.add.emitter(0,0,150)
    this.dustParticles.makeParticles('dust')
    this.dustParticles.setYSpeed(-200,200)
    this.dustParticles.setXSpeed(-200,200)
    this.dustParticles.gravity = 600
  },
  update: function () {
    //diem quins elements son amb col·lisions
    game.physics.arcade.collide(this.player, this.level)
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)
    game.physics.arcade.overlap(this.player, this.enemy, this.touchEnemy, null, this)

    this.player.animations.play('idle')
    this.inputs()


  },
  render: function () {
    game.debug.text('FPS: '+game.time.fps || 'FPS: --',40,40,"#00ff00")
    game.debug.text('jumping: '+this.jumping || 'FPS: --',40,20,"#00ff00")
  },
  loadLevel: function () {
    this.level = game.add.group()
    this.level.enableBody = true

    //afegir coses al joc a una posicio determinada (x,y)
    game.add.sprite(90,(200/2)-50,'wall', 0,this.level)
    game.add.sprite(390,(200/2)-50,'wall', 0,this.level)
    //els càlculs és per centrar-ho
    game.add.sprite((500/2) - 160,(200/2) + 30,'ground',0,this.level)

    //carregar monedes
    this.addCoins()

    //carregar enemic
    this.addEnemy()

    this.level.setAll('body.immovable', true)
  },
  addCoins: function () {
      this.coins = game.add.group()
      this.coins.enableBody = true

      game.add.sprite(140,110,'coin',0,this.coins)
      game.add.sprite(170,110,'coin',0,this.coins)
      game.add.sprite(200,110,'coin',0,this.coins)
  },
  addEnemy: function () {
    this.enemy = game.add.group()
    this.enemy.enableBody = true
    game.add.sprite(350, 110, 'enemy', 0, this.enemy)
  },
  takeCoin: function(a,b) {
    b.body.enable = false
    game.add.tween(b.scale).to({x:0},150).start()
    game.add.tween(b).to({y:50},150).start()

    this.coinSound.play()
  },
  touchEnemy: function (a,b) {
    if(!this.playerDead) {
      this.playerDead = true
      this.deadSound.play()
      a.body.enable = false
      game.add.tween(a.scale).to({x:0},150).start()
      game.add.tween(a).to({y:50},150).start()
    }
    //TODO: desactivar les fletxes per a que un cop mort, no es pugui moure.
    // window.setTimeout(function()
    // {
    //   game.add.tween(a.scale).to({x:0},150).start()
    //   game.add.tween(a).to({y:50},150).start()
    //   // this.player.kill()
    //
    // }, 1000);
    // this.player.kill()
  },

  jumpPlayer: function () {
    this.player.body.velocity.y = -350
    this.jumping = true
    this.jumpSound.play()
  },
  inputs: function () {
    this.player.animations.play('idle')
    if (this.cursor.left.isDown) {
      //això es pot fer perque s'ha activat la fisica
      this.player.frame = 2
      this.player.body.velocity.x = -120
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 120
      this.player.frame = 1
    } else {
      this.player.body.velocity.x = 0
      this.player.frame = 0
    }

    //quan l'usuari estigui apretant la tecla fletxa amunt i el player estigui tocant al terra -> canvio velocitat
    if (this.player.body.touching.down) {

      if(this.jumping) {
        this.dustSound.play()
        this.jumping = false
        this.dustParticles.x = this.player.x + this.player.height / 2
        this.dustParticles.y = this.player.y + this.player.height

        this.dustParticles.start(true,3000,0,25)
      }

      if( this.cursor.up.isDown) {
        this.jumpPlayer()
      }
    }
  }
}

var game = new Phaser.Game(500,200,Phaser.AUTO,'game')

game.state.add('play',playState)
game.state.start('play')