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
        } else if (field.revealed && field.type === FieldType.Number) {
            let surroundingFields = FieldHelper.getSurroundingFields(field);
            let [flagValueSum, flagsCount, bombCount] = [0, 0, 0];
            const unrevealedFields: Field[] = [];
            for (const currentField of surroundingFields) {
                flagValueSum += FieldHelper.flagValue(currentField.flag);
                if (currentField.flag !== FlagType.NoFlag) { flagsCount++; }
                if (FieldHelper.isBomb(currentField.type)) { bombCount++; }
                if (!currentField.revealed && currentField.flag === FlagType.NoFlag) { unrevealedFields.push(currentField); }
            }
            if (flagValueSum === field.number && flagsCount === bombCount) {
                unrevealedFields.forEach((currentField) => HostHelper.handleClick(currentField))
            }
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
