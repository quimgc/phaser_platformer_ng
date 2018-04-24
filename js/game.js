var level1 = {
  preload: function () {
    //carregar les img que seran utilitzades ('nom', 'ruta/img')
    game.load.image('wall','assets/wall.png')
    game.load.image('ground','assets/ground.png')

    //28 i 22 és perque la img player.png està tots els moviments de player, al haver-hi 6 skins, s'ha divit en tres columnes i s'ha partit per la mitat la plantila.
    game.load.spritesheet('player','assets/player.png', 28,22)
  },
  create: function () {
    this.loadLevel()

    // el 0 és per dir quina img s'ha de carregar dels jugadors (diferents moviments durant el joc, 0,1 2, 3, 4...)
    this.player = game.add.sprite(250,50, 'player',0)

    //tipus de fisica que s'aplicarà.
    game.physics.arcade.enable(this.player)

    //body fa referencia al cos del jugador
    this.player.body.gravity.y = 600
  },
  update: function () {
    //diem quins elements son amb col·lisions
    game.physics.arcade.collide(this.player, this.ground)
  },
  render: function () {

  },
  loadLevel: function () {

    //afegir coses al joc a una posicio determinada (x,y)
    game.add.sprite(90,(200/2)-50,'wall')
    game.add.sprite(390,(200/2)-50,'wall')

    //els càlculs és per centrar-ho
    this.ground = game.add.sprite((500/2) - 160,(200/2) + 30,'ground')

    //activo la fisica al terra.
    game.physics.arcade.enable(this.ground)

    //activem el terra.
    this.ground.enableBody = true

    //el terra del body no es pot moure, perque sino quan es col·lisiona també cau.
    this.ground.body.immovable = true

  }
}

var game = new Phaser.Game(500,200,Phaser.AUTO,'game')

game.state.add('level1',level1)
game.state.start('level1')