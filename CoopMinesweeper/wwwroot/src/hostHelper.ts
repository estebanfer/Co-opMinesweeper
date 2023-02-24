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
        if (field.revealed && field.type === FieldType.Number) {
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
                for (const currentField of unrevealedFields) {
                    if (currentField.revealed) continue //if a field becomes revealed, ignore it
                    const end = this.handleClickUnrevealed(currentField, affectedFields);
                    if (end) return;
                }
            } else {
                return
            }
        } else {
            const end = this.handleClickUnrevealed(field, affectedFields);
            if (end) return;
        }
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields)));
        revealedFields += affectedFields.length;
        if (revealedFields === (30*16) - (gameConfiguration.mineAmount + gameConfiguration.negativeMineAmount)) {
            GameHelper.stopTimer();
            GameHelper.showNewGameScreen();
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameWon, affectedFields, elapsedTime)));
        }

        Renderer.drawAffectedFields(affectedFields);
    }
    private static handleClickUnrevealed(field: Field, affectedFields: Field[] = []): boolean {
        if (FieldHelper.isBomb(field.type)) {
            GameHelper.stopTimer();
            GameHelper.showNewGameScreen();
            affectedFields = FieldHelper.getAllBombs();
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameOver, affectedFields, elapsedTime)));

            Renderer.drawAffectedFields(affectedFields);
            return true
        } else {
            FieldHelper.getFieldsForReveal(field, affectedFields);
        }
        return false
    }

    public static handleFlag: (field: Field) => void = handleFlagDefault;

    public static startNewGame(): void {
        GameHelper.updateConfig(GameHelper.getConfig());
        GameHelper.resetGame();
        gameStarted = false;
        revealedFields = 0;
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.NewGame, gameConfiguration)));
    }
}
