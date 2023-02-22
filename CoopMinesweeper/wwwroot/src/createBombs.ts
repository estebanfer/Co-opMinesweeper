// todo: Optimize this
function createBombsDefault(): void {
    let numberOfBombs: number = 0;
    let row: number;
    let column: number;

    while (numberOfBombs < 99) {
        row = Helpers.getRandomInt(0, 15);
        column = Helpers.getRandomInt(0, 29);
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

    while (numberOfBombs < 99) {
        row = Helpers.getRandomInt(0, 15);
        column = Helpers.getRandomInt(0, 29);
        const field: Field = matrix[row][column];

        if (FieldHelper.isBomb(field.type) || field.type === FieldType.NoBomb) {
            continue;
        }

        matrix[row][column].type = numberOfBombs < 70 ? FieldType.Bomb : FieldType.NegativeBomb;
        numberOfBombs++;
    }
}