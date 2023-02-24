function handleFlagDefault(field: Field): void {
    // if (field.revealed) {
    //     return [];
    // }

    if (!timerIntervalId) {
        GameHelper.startTimer();
    }

    if (field.flag == FlagType.Flag) {
        flagsLeft++;
        field.flag = FlagType.NoFlag;
    } else {
        flagsLeft--;
        field.flag = FlagType.Flag;
    }
    GameHelper.setFlags(flagsLeft);


    const affectedFields: Field[] = [field];
    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields, flagsLeft)));
    Renderer.drawAffectedFields(affectedFields);
}

function handleFlagNegativeMode(field: Field): void {
    // if (field.revealed) {
    //     return [];
    // }

    if (!timerIntervalId) {
        GameHelper.startTimer();
    }

    switch (field.flag) {
        case FlagType.NoFlag:
            flagsLeft--;
            field.flag = FlagType.Flag;
            break;
        case FlagType.Flag:
            flagsLeft++;
            negativeFlagsLeft--;
            field.flag = FlagType.NegativeFlag;
            break;
        case FlagType.NegativeFlag:
            negativeFlagsLeft++
            field.flag = FlagType.NoFlag;
            break;
    }
    GameHelper.setFlags(flagsLeft);
    GameHelper.setNegativeFlags(negativeFlagsLeft);

    const affectedFields: Field[] = [field];
    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields, flagsLeft, negativeFlagsLeft)));
    Renderer.drawAffectedFields(affectedFields);
}