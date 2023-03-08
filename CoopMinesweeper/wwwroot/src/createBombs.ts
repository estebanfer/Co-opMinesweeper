// todo: Optimize this
function createBombsDefault(): void {
    let numberOfBombs: number = 0;
    let row: number;
    let column: number;

    while (numberOfBombs < gameConfiguration.mineAmount) {
        row = Helpers.getRandomInt(0, gameConfiguration.height-1);
        column = Helpers.getRandomInt(0, gameConfiguration.width-1);
        const field: Field = matrix[row][column];

        if (field.type === FieldType.Bomb || field.type === FieldType.NoBomb) {
            continue;
        }

        matrix[row][column].type = FieldType.Bomb;
        numberOfBombs++;
    }
}

function createBombsNegative(): void {
    let numberOfBombs: number = 0;
    let row: number;
    let column: number;

    while (numberOfBombs < gameConfiguration.mineAmount) {
        row = Helpers.getRandomInt(0, gameConfiguration.height-1);
        column = Helpers.getRandomInt(0, gameConfiguration.width-1);
        const field: Field = matrix[row][column];

        if (FieldHelper.isBomb(field.type) || field.type === FieldType.NoBomb) {
            continue;
        }

        field.type = FieldType.Bomb;
        numberOfBombs++;
    }
    numberOfBombs = 0;
    while (numberOfBombs < gameConfiguration.negativeMineAmount) {
        row = Helpers.getRandomInt(0, gameConfiguration.height-1);
        column = Helpers.getRandomInt(0, gameConfiguration.width-1);
        const field: Field = matrix[row][column];

        if (FieldHelper.isBomb(field.type) || field.type === FieldType.NoBomb) {
            continue;
        }

        field.type = FieldType.NegativeBomb;
        numberOfBombs++;
    }
}