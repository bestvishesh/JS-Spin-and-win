
let prizes_config = {
    count: 12,
    prize_name: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: 0x112233,

    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

let game = new Phaser.Game(config);

function preload() {
    //load objects, images, audio
    this.load.image("background", "Assets/back.jpg");
    this.load.image("wheel", "Assets/wheel.png");
    this.load.image("pin", "Assets/pin.png");
    this.load.image("stand", "Assets/stand.png");
    this.load.audio('spin',"Assets/spin.mp3")

}

function create() {
    //create background image
    let W = game.config.width;
    let H = game.config.height;
    let bg = this.add.sprite(W / 2, H / 2, "background");
    bg.setScale(0.25)

    //create pin stand and wheel
    this.wheel = this.add.sprite(W / 2, H / 2, "wheel");//"this" keyword makes it the part of scene object
    this.wheel.setScale(0.25)
    this.wheel.depth = 1

    let pin = this.add.sprite(W / 2, H / 2 - 250, "pin");
    pin.setScale(0.25)
    pin.depth = 1 //depth used to bring object to front

    let stand = this.add.sprite(W / 2, H / 2 + 275, "stand");
    stand.setScale(0.2)
    stand.depth = 0

    //Game text on top
    font_style = {
        font: 'bold 25px Arial',
        alpha: 0.7,
        color: "WHITE",
    }
    this.game_text = this.add.text(10, 10, "Click to spin the wheel", font_style);

    //Spin Button
    this.spinButton = this.add.text(W / 2 - 30, H / 2 - 15, 'SPIN', { font: 'bold 30px Arial', color: "Black" })
    this.spinButton.setInteractive();
    this.spinButton.depth = 2

    //Spin state
    this.spinning = false;

    //Spin music
    this.music = this.sound.add('spin');

    //event listener on spinButton
    this.spinButton.on("pointerdown", spinwheel, this);
    this.spinButton.on("pointerover",hoverin,this)
    this.spinButton.on("pointerout",hoverout,this)

}

function update() {


}

function hoverin(){
    tween = this.tweens.add({
        targets:this.spinButton,
        scaleX:1.1,
        scaleY:1.1,
        alpha:.5,
        duration:50,
    })
}

function hoverout(){
    tween = this.tweens.add({
        targets:this.spinButton,
        scaleX:1,
        scaleY:1,
        alpha:1,
        duration:50,
    })
}


function spinwheel() {
    if (this.spinning == false) {
        rounds = Phaser.Math.Between(5, 10)
        degrees = Phaser.Math.Between(0, 11) * 30;
        //12 parts in the wheel,So 30 degree for each part.
        spinAngle = rounds * 360 + degrees;
        prize_idx = Math.floor(degrees / (360 / prizes_config.count))
        this.spinning = true;
        this.music.play()
        tween = this.tweens.add({
            targets: this.wheel,
            angle: spinAngle,
            delay: 25,
            ease: "Cubic.easeOut",
            callbackScope: this,
            duration: 3000,
            onComplete: function () {
                this.game_text.setText("You won prize number " + prizes_config.prize_name[prize_idx])
                this.spinning = false;
            }
        });
    }
}

