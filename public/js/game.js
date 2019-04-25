const topTen = document.querySelector('#topTen');

//function to populate top 10
function renderTopTen(doc){
    let li = document.createElement('tr');
    let name = document.createElement('td');
    let score = document.createElement('td');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    score.textContent = doc.data().score;

    li.appendChild(name);
    li.appendChild(score);

    topTen.appendChild(li);
}

function compareTopTen(doc, num){
    if(doc.data().score < num){
        var username = prompt("You got a high score! Enter a name:", "name");
        db.collection('highscores').add({
            name: username,
            score: num
        });
        return 1;
    }
    return 0;
}

const highscoresRef = db.collection('highscores');
highscoresRef.orderBy("score", "desc").limit(10).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderTopTen(doc);
    })
})

function rerenderTopTen(){
    while(topTen.childNodes.length > 2){
        topTen.removeChild(topTen.lastChild);
    }
    highscoresRef.orderBy("score", "desc").limit(10).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderTopTen(doc);
    })
})
}

var main = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function main ()
    {
        Phaser.Scene.call(this, { key: 'main' });
        this.enemies;
        this.paddle;
        this.ball;
        this.counterText;
        this.counter;
        this.HI;
        this.HIText;
        this.movement;
        this.momentum;
        this.enemAnim;
    },

    preload: function ()
    {
        this.load.image('spaceboi', "../images/spaceboi.png");
        this.load.image('ball', "../images/circle2.png");
        this.load.spritesheet('spaceboiSH', "../images/spaceboiSH.png", {frameWidth: 64, frameHeight: 32});
        this.load.spritesheet('paddleSH', "../images/paddleSH.png", {frameWidth: 80, frameHeight: 32});
        this.cameras.main.backgroundColor.setTo(70,63,140);﻿
        this.counter = 0;
        this.HI = 0;
        this.MYHI =0;
        this.movement = 0;
        this.momentum = 1;
    },

    create: function ()
    {
        //Text
        this.counterText = this.add.text(32, 568, 'SCORE: 0', { fontFamily: 'Impact', fontSize: '32px', fill: '#000' });
        this.HIText = this.add.text(550, 568, 'MY HI-SCORE: 0', { fontFamily: 'Impact', fontSize: '32px', fill: '#000' });

        //Line
        var line = new Phaser.Geom.Line(0, 532, 800, 532);
        var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0x000000 } });
        graphics.strokeLineShape(line);

        //Player
        this.ball = this.physics.add.image(400, 510, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);
        this.anims.create({
          key: 'paddleSH',
          repeat: -1,
          frameRate: 6,
          yoyo: true,
          frames: this.anims.generateFrameNumbers('paddleSH')
        });
        this.paddle = this.physics.add.sprite(400, 550, 'paddleSH', 0).setImmovable();
        this.paddle.anims.load('paddleSH');
        this.paddle.play('paddleSH');

        //Enemies
        this.anims.create({
          key: 'spaceSH',
          repeat: -1,
          frameRate: 1,
          frames: this.anims.generateFrameNumbers('spaceboiSH')
        });
        this.enemies = this.physics.add.staticGroup();
        this.makeEnemies();

        //Collision
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.physics.add.collider(this.ball, this.enemies, this.hitenemy, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        //User Input
        this.input.on('pointermove', function (pointer) {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);
            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
            }
        }, this);
        this.input.on('pointerup', function (pointer) {
            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }
        }, this);
    },

    makeEnemies: function ()
    {
      for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 6; col++) {
          var lEnem = this.add.sprite(112 + row * 64, 80 + col * 50, 'spaceboiSH', 0);
          lEnem.anims.load('spaceboiSH');
          lEnem.play('spaceSH');
          this.enemies.add(lEnem);
        }
      }
    },

    hitenemy: function (ball, enemy)
    {
        this.enemies.remove(enemy, true, true);
        this.counter++;
        if (this.enemies.countActive() === 0)
        {
            this.resetLevel(0);
        }
        this.counterText.setText(`SCORE: ${this.counter}`);
    },

    resetBall: function ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, 505);
        this.ball.setData('onPaddle', true);
    },

    resetLevel: function (hard)
    {
        if(hard === 1){
            var flag2 = 0;
            if (this.counter > this.HI) {
                this.HI = this.counter;
                flag2 = 1;
            }
            this.counter = 0;
            this.counterText.setText(`SCORE: ${this.counter}`);
            this.HIText.setText(`MY HI-SCORE: ${this.HI}`);
            if(flag2 == 1){
                highscoresRef.orderBy("score", "desc").limit(10).get().then((snapshot) => {
                    var flag = 0;
                    snapshot.docs.forEach(doc => {
                        if(flag == 0){
                            flag = compareTopTen(doc, this.HI);
                        }
                    })
                    if(flag == 1){
                        rerenderTopTen();
                    }
                });
            }
        }

        this.resetBall();

        this.enemies.children.iterate(function (child) {
          child.destroy();
        });
        this.enemies.clear(true);
        this.makeEnemies();
        this.movement = 0;
    },

    hitPaddle: function (ball, paddle)
    {
        var diff = 0;
        if (ball.x < paddle.x)
        {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            ball.setVelocityX(2 + Math.random() * 8);
        }

        this.enemies.children.each(function (enemy) {
            enemy.y += 10;
        });
        this.enemies.refresh();
    },

    update: function ()
    {
        if (this.ball.y > 600)
        {
            this.resetLevel(1);
        }
        var enemyReached = 0;
        this.enemies.children.each(function (enemy) {
            if (enemy.y > 510) {
              enemyReached = 1;
            }
        });
        if (enemyReached > 0) {
          this.resetLevel(1);
        }

        this.movement++;
        if (this.movement > 50) {
          this.movement = -50;
          this.momentum = this.momentum * -1;
        }
        if (this.momentum > 0) {
          this.enemies.children.each(function (enemy) {
              enemy.x += 1;
          });
        }
        else {
          this.enemies.children.each(function (enemy) {
              enemy.x -= 1;
          });
        }

        //UNCOMMENT FOR EASY ENEMY BOTTOM COLLISION TESTING
        //this.enemies.children.each(function (enemy) {
        //    enemy.y += 0.1;
        //});

        this.enemies.refresh();
    }
});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-container',
    scene: [ main ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);
