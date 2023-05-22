var config = {
  type: Phaser.AUTO,
  width: 400,
  height: 350,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('player', 'assets/player.png');
}

function create() {
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(1).refreshBody();
  for (let i = 0; i < 10; i++) {
    platforms.create(0 + (i * 50), 325, 'ground');
  }
//  platforms.create(100, 325, 'ground');
//  platforms.create(150, 325, 'ground');
//  platforms.create(200, 325, 'ground');
  player = this.physics.add.sprite(100, 250, 'player');

  player.setScale(2);
  player.setBounce(0.2);
//  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'player', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on('keydown-SPACE', function () {
    console.log('jumping...');
    if (player.body.touching.down) {
        player.setVelocityY(-400);
    }
  });

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
//    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
//    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
//    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  this.cameras.main.startFollow(player);
}

function collectStar(player, star) {
  star.disableBody(true, true);
}
