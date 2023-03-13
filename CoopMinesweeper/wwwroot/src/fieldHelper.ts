abstract class FieldHelper {

    public static createBombs: () => void;
    public static isFlag(type: FlagType): boolean {
        return type === FlagType.Flag || type === FlagType.NegativeFlag;
    }
    public static isBomb(type: FieldType): boolean {
        return type === FieldType.Bomb || type === FieldType.NegativeBomb;
    }
    public static bombValue(type: FieldType): number {
        return this.bombValues.get(type) || 0;
    }
    public static flagValue(type: FlagType): number {
        return this.flagValues.get(type) || 0;
    }

    public static initializeFields(width: number = gameConfiguration.width, height: number = gameConfiguration.height): void {
       matrix = new Array<Field[]>(height);
       let y: number = 2;
       for (let row: number = 0; row < height; row++) {
            matrix[row] = new Array<Field>(width);
            let x: number = 2;
            for (let column: number = 0; column < width; column++) {
                matrix[row][column] = new Field(x, y, row, column);
                x += fieldSize;
            }

            y += fieldSize;
        }
    }

    public static getField(x: number, y: number): Field {
        let row: number;
        let column: number;

        if (y < fieldSize + 1) {
            row = 0;
        } else if (y > fieldSize * (gameConfiguration.height - 1)) {
            row = (gameConfiguration.height - 1);
        } else {
            row = Math.floor((y - 1) / fieldSize);
        }

        if (x < fieldSize + 1) {
            column = 0;
        } else if (x > fieldSize * (gameConfiguration.width - 1)) {
            column = (gameConfiguration.width - 1);
        } else {
            column = Math.floor((x - 1) / fieldSize);
        }

        return matrix[row][column];
    }

    public static getFieldsForReveal(field: Field, allFields: Field[]): void {
        field.revealed = true;
        allFields.push(field);

        if (FieldHelper.isFlag(field.flag) || FieldHelper.isBomb(field.type) || field.type === FieldType.Number) {
            return;
        } else {
            const surroundingFields: Field[] = FieldHelper.getSurroundingFieldsForReveal(field);
            for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
                FieldHelper.getFieldsForReveal(surroundingFields[i], allFields);
            }
        }
    }

    public static getSurroundingFields(field: Field): Field[] {
        const surroundingFields: Field[] = [];

        const row: number = field.row;
        const column: number = field.column;

        if (matrix[row - 1]) {
            if (matrix[row - 1][column - 1]) {
                surroundingFields.push(matrix[row - 1][column - 1]);
            }

            surroundingFields.push(matrix[row - 1][column]);

            if (matrix[row - 1][column + 1]) {
                surroundingFields.push(matrix[row - 1][column + 1]);
            }
        }

        if (matrix[row][column - 1]) {
            surroundingFields.push(matrix[row][column - 1]);
        }
        if (matrix[row][column + 1]) {
            surroundingFields.push(matrix[row][column + 1]);
        }

        if (matrix[row + 1]) {
            if (matrix[row + 1][column - 1]) {
                surroundingFields.push(matrix[row + 1][column - 1]);
            }

            surroundingFields.push(matrix[row + 1][column]);

            if (matrix[row + 1][column + 1]) {
                surroundingFields.push(matrix[row + 1][column + 1]);
            }
        }

        return surroundingFields;
    }

    public static getSurroundingFieldsForChord(field: Field): Field[] {
        return FieldHelper.getSurroundingFields(field).filter(
            (curField: Field) => !curField.revealed && curField.flag === FlagType.NoFlag
        );
    }

    public static getSurroundingFieldsForReveal(field: Field): Field[] {
        const surroundingFields: Field[] = [];

        const row: number = field.row;
        const column: number = field.column;

        if (matrix[row - 1]) {
            const topLeft: Field = matrix[row - 1][column - 1];
            if (topLeft && !topLeft.revealed && topLeft.flag === FlagType.NoFlag) {
                topLeft.revealed = true;
                surroundingFields.push(topLeft);
            }

            const topCenter: Field = matrix[row - 1][column];
            if (!topCenter.revealed && topCenter.flag === FlagType.NoFlag) {
                topCenter.revealed = true;
                surroundingFields.push(topCenter);
            }

            const topRight: Field = matrix[row - 1][column + 1];
            if (topRight && !topRight.revealed && topRight.flag === FlagType.NoFlag) {
                topRight.revealed = true;
                surroundingFields.push(topRight);
            }
        }

        const left: Field = matrix[row][column - 1];
        if (left && !left.revealed && left.flag === FlagType.NoFlag) {
            left.revealed = true;
            surroundingFields.push(left);
        }

        const right: Field = matrix[row][column + 1];
        if (right && !right.revealed && right.flag === FlagType.NoFlag) {
            right.revealed = true;
            surroundingFields.push(right);
        }

        if (matrix[row + 1]) {
            const bottomLeft: Field = matrix[row + 1][column - 1];
            if (bottomLeft && !bottomLeft.revealed && bottomLeft.flag === FlagType.NoFlag) {
                bottomLeft.revealed = true;
                surroundingFields.push(bottomLeft);
            }

            const bottomCenter: Field = matrix[row + 1][column];
            if (!bottomCenter.revealed && bottomCenter.flag === FlagType.NoFlag) {
                bottomCenter.revealed = true;
                surroundingFields.push(bottomCenter);
            }

            const bottomRight: Field = matrix[row + 1][column + 1];
            if (bottomRight && !bottomRight.revealed && bottomRight.flag === FlagType.NoFlag) {
                bottomRight.revealed = true;
                surroundingFields.push(bottomRight);
            }
        }

        return surroundingFields;
    }

    public static resetFields(): void {
        let field: Field;
        for (let row: number = 0; row < gameConfiguration.height; row++) {
            for (let column: number = 0; column < gameConfiguration.width; column++) {
                field = matrix[row][column];

                field.number = 0;
                field.revealed = false;
                field.flag = FlagType.NoFlag;
                field.type = FieldType.None;
            }
        }
    }

    public static markStartingFields(field: Field): void {
        field.type = FieldType.NoBomb;

        const surroundingFields: Field[] = FieldHelper.getSurroundingFields(field);
        for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
            surroundingFields[i].type = FieldType.NoBomb;
        }
    }

    public static createNumbers(): void {
        let field: Field;
        let bombs: number;
        let surroundingFields: Field[];

        for (let row: number = 0; row < gameConfiguration.height; row++) {
            for (let column: number = 0; column < gameConfiguration.width; column++) {
                field = matrix[row][column];

                if (FieldHelper.isBomb(field.type)) {
                    continue;
                }

                surroundingFields = FieldHelper.getSurroundingFields(field);
                let hasBomb: boolean = false;
                bombs = surroundingFields.reduce((accumulator: number, currentField: Field) => {
                    const bombValue: number = FieldHelper.bombValue(currentField.type);
                    if (bombValue !== 0) { hasBomb = true; }
                    return accumulator + bombValue;
                }, 0);

                if (!hasBomb) {
                    field.type = FieldType.Empty;
                } else {
                    field.type = FieldType.Number;
                    field.number = bombs;
                }
            }
        }
    }

    public static getAllBombs(): Field[] {
        let field: Field;
        const fields: Field[] = [];

        for (let row: number = 0; row < gameConfiguration.height; row++) {
            for (let column: number = 0; column < gameConfiguration.width; column++) {
                field = matrix[row][column];

                if (FieldHelper.isBomb(field.type)) {
                    field.revealed = true;
                    fields.push(field);
                }
            }
        }

        return fields;
    }
    // todo: Optimize this
    public static createBombsDefault(): void {
        let numberOfBombs: number = 0;
        let row: number;
        let column: number;

        while (numberOfBombs < gameConfiguration.mineAmount) {
            row = Helpers.getRandomInt(0, gameConfiguration.height - 1);
            column = Helpers.getRandomInt(0, gameConfiguration.width - 1);
            const field: Field = matrix[row][column];

            if (field.type === FieldType.Bomb || field.type === FieldType.NoBomb) {
                continue;
            }

            matrix[row][column].type = FieldType.Bomb;
            numberOfBombs++;
        }
    }

    public static createBombsNegative(): void {
        let numberOfBombs: number = 0;
        let row: number;
        let column: number;

        while (numberOfBombs < gameConfiguration.mineAmount) {
            row = Helpers.getRandomInt(0, gameConfiguration.height - 1);
            column = Helpers.getRandomInt(0, gameConfiguration.width - 1);
            const field: Field = matrix[row][column];

            if (FieldHelper.isBomb(field.type) || field.type === FieldType.NoBomb) {
                continue;
            }

            field.type = FieldType.Bomb;
            numberOfBombs++;
        }
        numberOfBombs = 0;
        while (numberOfBombs < gameConfiguration.negativeMineAmount) {
            row = Helpers.getRandomInt(0, gameConfiguration.height - 1);
            column = Helpers.getRandomInt(0, gameConfiguration.width - 1);
            const field: Field = matrix[row][column];

            if (FieldHelper.isBomb(field.type) || field.type === FieldType.NoBomb) {
                continue;
            }

            field.type = FieldType.NegativeBomb;
            numberOfBombs++;
        }
    }

    private static bombValues: Map<FieldType, number> = new Map([[FieldType.Bomb, 1], [FieldType.NegativeBomb, -1]]);
    private static flagValues: Map<FlagType, number> = new Map([[FlagType.Flag, 1], [FlagType.NegativeFlag, -1]]);
}
FieldHelper.createBombs = FieldHelper.createBombsDefault;
