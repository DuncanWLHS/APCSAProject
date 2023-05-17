var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
  this.load.image('ground', 'assets/ground.png');
  this.load.image('star', 'assets/star.png');
  this.load.spritesheet('dude', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
  // Create the platforms group and add ground
  var platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  // Add ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Add player
  this.player = this.physics.add.sprite(100, 450, 'dude');
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  // Create player animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Add physics for player
  this.physics.add.collider(this.player, platforms);

  // Create cursors for keyboard input
  this.cursors = this.input.keyboard.createCursorKeys();

  // Add stars to collect
  this.stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  this.stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Add physics for stars
  this.physics.add.collider(this.stars, platforms);
  this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

  // Add score text
  this.score = 0;
  this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
  // Handle player movement
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
    this.player.anims.play('left', true);
  }
  else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
    this.player.anims.play('right', true);
  }
  else {
    this.player.setVelocityX(0);
    this.player.anims.play('turn');
  }

  // Handle player jumping
  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);
  this.score += 10;
  this.scoreText.setText('Score: ' + this.score);

  if (this.stars.countActive(true) === 0) {
    this.stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
  }
}
