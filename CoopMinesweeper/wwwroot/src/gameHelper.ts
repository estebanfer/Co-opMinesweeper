abstract class GameHelper {
    public static isHost(): boolean {
        return !gameIdInput;
    }
    // #region Game

    public static resetGame(): void {
        Renderer.drawBackground();
        FieldHelper.resetFields();
        GameHelper.setTimer(0);
        if (gameConfiguration.gamemode === GameMode.Normal) {
            GameHelper.setFlags(gameConfiguration.mineAmount);
        } else if (gameConfiguration.gamemode === GameMode.NegativeBombs) {
            GameHelper.setFlags(gameConfiguration.mineAmount);
            GameHelper.setNegativeFlags(gameConfiguration.negativeMineAmount);
        }
        GameHelper.hideOverlay();
    }

    // #endregion

    // #region Screens

    public static hideOverlay(): void {
        overlay.style.display = "none";
        overlayStatus.style.display = "none";
        newGameButton.style.display = "none";

        if (this.isHost()) { // Host
            gameIdText.style.display = "none";
            copyToClipboardButton.style.display = "none";
        } else { // Client
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
    public static setFlags(numberOfFlagsLeft: number): void {
        flagsLeft = numberOfFlagsLeft;
        flagsElement.innerText = flagsLeft.toString();
    }
    public static setNegativeFlags(numberOfNegativeFlagsLeft: number): void {
        negativeFlagsLeft = numberOfNegativeFlagsLeft;
        negativeFlagsElement.innerText = negativeFlagsLeft.toString();
    }
    public static setNegativeFlagsVisibility(visible: boolean):void {
        visible
        ? negativeFlagsContainerElement.classList.remove("hidden")
        : negativeFlagsContainerElement.classList.add("hidden");
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
        gameConfig.mineAmount = parseInt(bombAmountElement.value) || 99;
        gameConfig.negativeMineAmount = parseInt(negativeBombAmountElement.value) || 29;
        if (gamemodeSelectElement.value === "1") {
            gameConfig.gamemode = GameMode.Normal
            gameConfig.negativeMineAmount = 0;
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
            gameConfig.negativeMineAmount = 0;
            FieldHelper.createBombs = createBombsDefault;
            if (this.isHost()) HostHelper.handleFlag = handleFlagDefault;
            this.setNegativeFlagsVisibility(false);
        } else {
            FieldHelper.createBombs = createBombsNegative;
            if (this.isHost()) HostHelper.handleFlag = handleFlagNegativeMode;
            this.setNegativeFlagsVisibility(true);
        }
    }

    // #endregion
}
