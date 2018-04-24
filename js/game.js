var level1 = {
  preload: function () {
    console.log('PRELOAD')
    //carregar les img que seran utilitzades ('nom', 'ruta/img')
    game.load.image('wall','assets/wall.png')
    game.load.image('ground','assets/ground.png')
  },
  create: function () {
    console.log('create')
    this.loadLevel()
  },
  update: function () {

  },
  render: function () {

  },
  loadLevel: function () {
    //afegir coses al joc a una posicio determinada (x,y)
    game.add.sprite(90,(200/2)-50,'wall')
    game.add.sprite(390,(200/2)-50,'wall')
    //els càlculs és per centrar-ho
    game.add.sprite((500/2) - 160,(200/2) + 30,'ground')
  }
}

var game = new Phaser.Game(500,200,Phaser.AUTO,'game')

game.state.add('level1',level1)
game.state.start('level1')