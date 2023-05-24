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

const GROUND = 'G';
const DIRT = 'D';
const PLAYER = 'P';
const METAL = 'M';
let level_1;
let player;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('dirt', 'assets/dirt.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('player', 'assets/player.png');
  this.load.text('level_1', 'levels/level_1.txt');
  this.load.image('metal', 'assets/2DgameMetal.png');
}

function create() {
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();

  level_1 = this.cache.text.get('level_1');
  buildGrid(this);

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
  if (cursors.left.isDown && cursors.shift.isDown) {
    player.setVelocityX(-300);
    //player.setScale(-2, 2);
//    player.anims.play('left', true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-160);
    //player.setScale(-2, 2);
//    player.anims.play('left', true);
  } else if (cursors.right.isDown && cursors.shift.isDown) {
    player.setVelocityX(300);
    //player.setScale(2, 2);
//    player.anims.play('right', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    //player.setScale(2, 2);
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

function collectStar(player, star) { star.disableBody(true, true); }

function addPlayer(that, row, col) {
    player = that.physics.add.sprite((col * 48), (row * 48), 'player');
    player.setScale(2);
    //player.setOrigin(0.5, 0.5);
    //player.setDisplayOrigin(0.5, 0.5);
    player.setBounce(0.2);
}

function addTile(row, col, type) {
    if (type == GROUND) {
        platforms.create((col * 48), (row * 48), 'ground');
    } else if (type == DIRT) {
        platforms.create((col * 48), (row * 48), 'dirt');
    } else if (type == METAL) {
        platforms.create((col * 48), (row * 48), 'metal');
    }
}

function buildGrid(that) {
    // D = dirt, G = ground, P = player, M = metal
    let grid = []
    let lines = level_1.split('\n');
    let rowCount = lines.length;
    let colCount = lines[0].trim().length;

    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            if (lines[row][col] === GROUND) {
                addTile(row, col, GROUND);
            } else if (lines[row][col] === DIRT) {
                addTile(row, col, DIRT);
            } else if (lines[row][col] === PLAYER) {
                addPlayer(that, row, col);
            } else if (lines[row][col] === METAL) {
                addTile(row, col, METAL);
            }
        }
    }
}