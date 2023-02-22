abstract class GameHelper {
    // #region Game

    public static resetGame(): void {
        Renderer.drawBackground();
        FieldHelper.resetFields();
        GameHelper.setTimer(0);
        GameHelper.setFlags(99);
        GameHelper.hideOverlay();
    }

    // #endregion

    // #region Screens

    public static hideOverlay(): void {
        overlay.style.display = "none";
        overlayStatus.style.display = "none";
        newGameButton.style.display = "none";

        if (gameIdText) { // Host
            gameIdText.style.display = "none";
            copyToClipboardButton.style.display = "none";
        }

        if (gameIdInput) { // Client
            gameIdInput.style.display = "none";
            connectButton.style.display = "none";
        }
    }

    public static showNewGameScreen(): void {
        overlay.style.display = "block";
        newGameButton.style.display = "inline-block";
    }

    public static showEndGameScreen(): void {
        overlay.style.display = "block";
        endGameButton.style.display = "inline-block";
        newGameButton.style.display = "none";
        overlayStatus.style.display = "block";
        overlayStatus.innerText = "Other player has disconnected :/";
    }

    // #endregion

    // #region Flags
    // TODO negative flags
    public static setFlags(numberOfFlagsLeft: number): void {
        flagsLeft = numberOfFlagsLeft;
        flagsElement.innerText = flagsLeft.toString();
    }

    // #endregion

    // #region Timer

    public static startTimer(): void {
        timerIntervalId = setInterval(() => {
            if (elapsedTime < 999) {
                elapsedTime++;
                timerElement.innerText = `00${elapsedTime}`.slice(-3);
            }
        }, 1000);
    }

    public static stopTimer(): void {
        clearInterval(timerIntervalId);
        timerIntervalId = 0;
    }

    public static setTimer(seconds: number): void {
        elapsedTime = seconds;
        timerElement.innerText = `00${seconds}`.slice(-3);
    }

    // #endregion

    // #region Config

    public static getConfig(): GameConfiguration {
        const gameConfig = new GameConfiguration()
        if (gamemodeSelectElement.value === "1") {
            gameConfig.gamemode = GameMode.Normal
        } else if (gamemodeSelectElement.value === "2") {
            gameConfig.gamemode = GameMode.NegativeBombs
        } else {
            gameConfig.gamemode = GameMode.Normal
        }
        return gameConfig
    }
    
    public static updateConfig(gameConfig: GameConfiguration): void {
        gameConfiguration = gameConfig
        if (gameConfig.gamemode === GameMode.Normal) {
            FieldHelper.createBombs = createBombsDefault
            HostHelper.handleFlag = handleFlagDefault
        } else if (gameConfig.gamemode === GameMode.NegativeBombs) {
            FieldHelper.createBombs = createBombsNegative
            HostHelper.handleFlag = handleFlagNegativeMode
        }
    }

    // #endregion
}
