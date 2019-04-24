const topTen = document.querySelector('#topTen');

//function to populate top 10
function renderTopTen(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let score = document.createElement('span');

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
    },

    preload: function ()
    {
        this.load.image('spaceboi', "../images/spaceboi.png");
        this.load.image('paddle', "../images/shell.png");
        this.load.image('ball', "../images/ball.png");
        this.cameras.main.backgroundColor.setTo(70,63,140);﻿
        this.counter = 0;
        this.HI = 0;
        this.movement = 0;
        this.momentum = 1;
    },

    create: function ()
    {
        //Text
        this.counterText = this.add.text(32, 568, 'SCORE: 0', { fontSize: '32px', fill: '#000' });
        this.HIText = this.add.text(250, 568, 'HI: 0', { fontSize: '32px', fill: '#000' });

        //Player
        this.ball = this.physics.add.image(400, 500, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);
        this.paddle = this.physics.add.image(400, 550, 'paddle').setImmovable();

        //Enemies
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
          this.enemies.create(112 + row * 64, 80 + col * 50, 'spaceboi');
        }
      }
    },

    hitenemy: function (ball, enemy)
    {
        enemy.disableBody(true, true);
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
        this.ball.setPosition(this.paddle.x, 500);
        this.ball.setData('onPaddle', true);
    },

    resetLevel: function (hard)
    {
        if(hard === 1){
            if (this.counter > this.HI) {
                this.HI = this.counter;
            }
            this.counter = 0;
            this.counterText.setText(`SCORE: ${this.counter}`);
            this.HIText.setText(`MY HI: ${this.HI}`);

            highscoresRef.orderBy("score", "desc").limit(10).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if(flag != 0){
                        flag = compareTopTen(doc, this.HI);
                    }
                })
            });

        }else{

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
