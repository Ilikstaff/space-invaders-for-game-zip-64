function Draw_Invader () {
    display.setMatrixColor(Invader_position[0], Invader_position[1], GAME_ZIP64.colors(ZipLedColors.White))
}
function Draw_player_bullets () {
    for (let index = 0; index <= Player_Bullets_X.length - 1; index++) {
        if (Player_Bullets_Y[index] >= 0) {
            display.setMatrixColor(Player_Bullets_X[index], Player_Bullets_Y[index], GAME_ZIP64.colors(ZipLedColors.Red))
        }
    }
}
function Draw_player () {
    display.setMatrixColor(Player_Position, 7, GAME_ZIP64.colors(ZipLedColors.Green))
    display.setMatrixColor(Player_Position, 6, GAME_ZIP64.colors(ZipLedColors.Green))
    display.setMatrixColor(Player_Position - 1, 7, GAME_ZIP64.colors(ZipLedColors.Green))
    display.setMatrixColor(Player_Position + 1, 7, GAME_ZIP64.colors(ZipLedColors.Green))
}
function Update_player () {
    if (Player_Position < 1) {
        Player_Position = 1
    }
    if (Player_Position > 6) {
        Player_Position = 6
    }
}
function Update_game () {
    Update_player()
    Update_Invader()
    Update_player_bullets()
    Player_Bullet_collision()
}
function Game_over () {
    if (Game_ticks % 4 == 1) {
        basic.pause(200)
        for (let Game_state2 = 0; Game_state2 <= 1; Game_state2++) {
            display.showColor(GAME_ZIP64.colors(ZipLedColors.Red))
            GAME_ZIP64.runMotor(100)
            basic.pause(500)
            display.showColor(GAME_ZIP64.colors(ZipLedColors.Black))
            basic.pause(500)
        }
    }
}
function Fire () {
    Should_fire = 1
    for (let index = 0; index <= Player_Bullets_X.length - 1; index++) {
        if (Player_Bullets_Y[index] < 0 && Should_fire == 1) {
            GAME_ZIP64.runMotor(10)
            music.playSoundEffect(music.createSoundEffect(WaveShape.Square, 1600, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), SoundExpressionPlayMode.InBackground)
            Player_Bullets_X[index] = Player_Position
            Player_Bullets_Y[index] = 6
            Should_fire = 0
        }
    }
}
function Update_player_bullets () {
    for (let index = 0; index <= Player_Bullets_X.length - 1; index++) {
        if (Player_Bullets_Y[index] >= 0) {
            Player_Bullets_Y[index] = Player_Bullets_Y[index] - 1
        }
    }
}
function Draw () {
    Draw_player()
    Draw_player_bullets()
    Draw_Invader()
}
function Update_Invader () {
    if (Game_ticks % Game_ticks_between_invaders_move == 0) {
        if (Invader_position[0] < 7) {
            Invader_position[0] = Invader_position[0] + 1
        } else {
            Invader_position[0] = 0
            Invader_position[1] = Invader_position[1] + 1
        }
    }
    if (Invader_position[1] > 7) {
        Game_state = 1
    }
}
function Player_Bullet_collision () {
    for (let index = 0; index <= Player_Bullets_Y.length; index++) {
        if (Player_Bullets_Y[index] == Invader_position[1]) {
            if (Player_Bullets_X[index] == Invader_position[0]) {
                let list = 0
                Player_Bullets_X[list] = -1
                Player_Bullets_Y[list] = -1
                Invader_position[0] = 0
                Invader_position[1] = 0
                Invaders_killed += 1
                if (Game_ticks_between_invaders_move > 1) {
                    Game_ticks_between_invaders_move += -1
                }
            }
        }
    }
}
function Process_input () {
    if (Game_state == 0) {
        if (GAME_ZIP64.buttonIsPressed(GAME_ZIP64.ZIP64ButtonPins.Left)) {
            Player_Position += -1
        }
        if (GAME_ZIP64.buttonIsPressed(GAME_ZIP64.ZIP64ButtonPins.Right)) {
            Player_Position += 1
        }
        if (GAME_ZIP64.buttonIsPressed(GAME_ZIP64.ZIP64ButtonPins.Fire1)) {
            Fire()
        }
    } else if (GAME_ZIP64.buttonIsPressed(GAME_ZIP64.ZIP64ButtonPins.Fire1)) {
        Game_state = 0
        Invader_position[0] = 0
        Invader_position[1] = 0
        Game_ticks_between_invaders_move += -2
    }
    if (Invaders_killed > 17) {
        if (GAME_ZIP64.buttonIsPressed(GAME_ZIP64.ZIP64ButtonPins.Fire1)) {
            Game_state = 0
            Invaders_killed = 0
        } else {
            basic.pause(200)
            for (let index = 0; index < 4; index++) {
                display.showColor(GAME_ZIP64.colors(ZipLedColors.Green))
                GAME_ZIP64.runMotor(100)
                basic.pause(500)
                display.showColor(GAME_ZIP64.colors(ZipLedColors.Black))
                basic.pause(500)
            }
        }
    }
}
let Invaders_killed = 0
let Should_fire = 0
let Game_state = 0
let Game_ticks_between_invaders_move = 0
let Game_ticks = 0
let Invader_position: number[] = []
let Player_Bullets_Y: number[] = []
let Player_Bullets_X: number[] = []
let Player_Position = 0
let display: GAME_ZIP64.ZIP64Display = null
display = GAME_ZIP64.createZIP64Display()
GAME_ZIP64.setBuzzerPin()
display.setBrightness(25)
Player_Position = 3
Player_Bullets_X = [-1, -1]
Player_Bullets_Y = [-1, -1]
Invader_position = [0, 0]
Game_ticks = 0
// The higher the number the slower the Enemy will go
Game_ticks_between_invaders_move = 10
Game_state = 0
basic.forever(function () {
    display.clear()
    Process_input()
    if (Game_state == 0) {
        Update_game()
        Draw()
    } else {
        Game_over()
    }
    display.show()
    Game_ticks += 1
    basic.pause(40)
})
