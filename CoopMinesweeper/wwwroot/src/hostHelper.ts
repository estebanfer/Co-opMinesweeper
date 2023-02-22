abstract class HostHelper {
    public static handleClick(field: Field): void {
        if (!gameStarted) {
            gameStarted = true;

            FieldHelper.markStartingFields(field);
            FieldHelper.createBombs();
            FieldHelper.createNumbers();

            if (!timerIntervalId) {
                GameHelper.startTimer();
            }
        }

        // if (field.revealed || field.flag) {
        //     return [];
        // }

        let affectedFields: Field[] = [];
        if (FieldHelper.isBomb(field.type)) {
            GameHelper.stopTimer();
            GameHelper.showNewGameScreen();
            affectedFields = FieldHelper.getAllBombs();
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameOver, affectedFields, elapsedTime)));
        } else {
            FieldHelper.getFieldsForReveal(field, affectedFields);
            revealedFields += affectedFields.length;
            if (revealedFields === 381) {
                GameHelper.stopTimer();
                GameHelper.showNewGameScreen();
                peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameWon, affectedFields, elapsedTime)));
            } else {
                peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields)));
            }
        }

        Renderer.drawAffectedFields(affectedFields);
    }

    public static handleFlag: (field: Field) => void = handleFlagDefault;

    public static startNewGame(): void {
        GameHelper.resetGame();
        gameStarted = false;
        revealedFields = 0;
        GameHelper.updateConfig(GameHelper.getConfig());
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.ConfigChange, gameConfiguration)))
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.NewGame)));
    }
}
