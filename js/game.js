var level1 = {
  preload: function () {
    //carregar les img que seran utilitzades ('nom', 'ruta/img')
    game.load.image('wall','assets/wall.png')
    game.load.image('ground','assets/ground.png')
    game.load.image('coin','assets/coin.png')
    game.load.image('enemy', 'assets/enemy.png')

    game.load.audio('coin',['assets/coin.wav', 'assets/coin.mp3'])

    //28 i 22 és perque la img player.png està tots els moviments de player, al haver-hi 6 skins, s'ha divit en tres columnes i s'ha partit per la mitat la plantila.
    game.load.spritesheet('player','assets/player.png', 28,22)
  },
  create: function () {
    //Per moure el joc.
    this.cursor = game.input.keyboard.createCursorKeys()

    this.coinSound = game.add.audio('coin', 0.1)
    this.loadLevel()

    // el 0 és per dir quina img s'ha de carregar dels jugadors (diferents moviments durant el joc, 0,1 2, 3, 4...)
    this.player = game.add.sprite(250,50, 'player',0)

    //tipus de fisica que s'aplicarà.
    game.physics.arcade.enable(this.player)

    //body fa referencia al cos del jugador
    this.player.body.gravity.y = 600

    this.player.animations.add('idle', [3,4,5,4], 5, true)
  },
  update: function () {
    //diem quins elements son amb col·lisions
    game.physics.arcade.collide(this.player, this.level)
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)
    game.physics.arcade.overlap(this.player, this.enemy, this.touchEnemy, null, this)

    this.inputs()

    this.player.animations.play('idle')
  },
  render: function () {

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
    game.add.tween(b.scale).to({x:0},150).start()
    game.add.tween(b).to({y:50},150).start()

    this.coinSound.play()
  },
  touchEnemy: function (a,b) {
    //TODO: desactivar les fletxes per a que un cop mort, no es pugui moure.
    // window.setTimeout(function()
    // {
    //   game.add.tween(a.scale).to({x:0},150).start()
    //   game.add.tween(a).to({y:50},150).start()
    //   // this.player.kill()
    //
    // }, 1000);
    this.player.kill()
  },
  inputs: function () {
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

    if (this.cursor.up.isDown) {
      if( this.player.body.touching.down) {
        this.player.body.velocity.y = -200
      }
    }
  }
}

var game = new Phaser.Game(500,200,Phaser.AUTO,'game')

game.state.add('level1',level1)
game.state.start('level1')