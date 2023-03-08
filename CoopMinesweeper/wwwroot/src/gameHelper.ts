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
        gameConfig.height = parseInt(heightSettingElement.value) || 16;
        gameConfig.width = parseInt(widthSettingElement.value) || 30;
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
        if (gameConfiguration.height === matrix.length && gameConfiguration.width === matrix[0].length) {
            return;
        }
        fieldSize = 32;
        while (gameConfig.width * fieldSize > 960) {
            fieldSize = fieldSize - 8
        }
        this.updateBoardSize(
            (gameConfiguration.width*fieldSize)+2,
            (gameConfiguration.height*fieldSize)+2
        )
        FieldHelper.initializeFields(gameConfiguration.width, gameConfiguration.height);
    }

    public static updateBoardSize(width: number, height: number): void {
        const [sWidth, sHeight] = [width.toFixed()+"px", height.toFixed()+"px"]
        canvasHolder.style.width = sWidth;
        canvasHolder.style.height = sHeight;
        
        gameCanvas.style.width = sWidth;
        gameCanvas.style.height = sHeight;
        gameCanvas.width = gameCanvas.offsetWidth;
        gameCanvas.height = gameCanvas.offsetHeight;

        mouseCanvas.style.width = sWidth;
        mouseCanvas.style.height = sHeight;
        mouseCanvas.width = mouseCanvas.offsetWidth;
        mouseCanvas.height = mouseCanvas.offsetHeight;

        otherMouseCanvas.style.width = sWidth;
        otherMouseCanvas.style.height = sHeight;
        otherMouseCanvas.width = otherMouseCanvas.offsetWidth;
        otherMouseCanvas.height = otherMouseCanvas.offsetHeight;
    }

    // #endregion
}
