abstract class Renderer {
    public static drawBackground(): void {
        gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameCanvasContext.beginPath();
        gameCanvasContext.lineWidth = 2;
        gameCanvasContext.strokeStyle = "rgba(255, 255, 255, 1)";

        for (let xIndex: number = 1, line: number = 0; line < 32; xIndex += 32, line++) {
            gameCanvasContext.moveTo(xIndex, 0);
            gameCanvasContext.lineTo(xIndex, 514);
        }

        for (let yIndex: number = 1, line: number = 0; line < 18; yIndex += 32, line++) {
            gameCanvasContext.moveTo(0, yIndex);
            gameCanvasContext.lineTo(962, yIndex);
        }

        gameCanvasContext.stroke();
    }

    public static renderMouseMove(field: Field, surroundingFieldsChord?: Field[]): void {
        // Optimization: if the mouse moved but it is still in the same filed we don’t need to draw anything so just stop the function
        if (field === previousActiveField) {
            return;
        }

        if (previousActiveField) {
            mouseCanvasContext.clearRect(previousActiveField.startX-32, previousActiveField.startY-32, 94, 94);
        }

        previousActiveField = field;

        mouseCanvasContext.fillStyle = "rgba(255, 255, 255, 0.5)";
        mouseCanvasContext.fillRect(field.startX, field.startY, 30, 30);
        
        surroundingFieldsChord && this.renderMouseChord(surroundingFieldsChord);
    }

    public static renderMouseChord(fields: Field[]): void {
        for (const curField of fields) {
            mouseCanvasContext.fillStyle = "rgba(0, 0, 0, 0.5)";
            mouseCanvasContext.fillRect(curField.startX, curField.startY, 30, 30);
        }
    }

    public static clearMouseChord(field: Field): void {
        mouseCanvasContext.clearRect(field.startX-32, field.startY-32, 94, 94);
        previousActiveField = undefined;
        this.renderMouseMove(field)
    }

    // todo: Definitely move this method in some other helper for the client only
    public static drawAffectedFields(affectedFields: Field[]): void {
        for (let i: number = 0, len: number = affectedFields.length; i < len; i++) {
            const field: Field = affectedFields[i];

            // Reset field
            gameCanvasContext.clearRect(field.startX, field.startY, 30, 30);

            if (field.flag === FlagType.Flag) {
                gameCanvasContext.drawImage(flagImage, field.startX, field.startY);
                continue;
            } else if (field.flag === FlagType.NegativeFlag) {
                gameCanvasContext.drawImage(negativeFlagImage, field.startX, field.startY);
                continue;
            }

            if (!field.revealed) {
                continue;
            }

            if (field.type === FieldType.Bomb) {
                Renderer.fillField(field, "rgba(203, 66, 66, 1)");

                gameCanvasContext.drawImage(bombImage, field.startX, field.startY);
            } else if (field.type === FieldType.NegativeBomb) {
                Renderer.fillField(field, "rgba(203, 66, 66, 1)");

                gameCanvasContext.drawImage(negativeBombImage, field.startX, field.startY);
            } else if (field.type === FieldType.Number) {
                Renderer.fillField(field, "rgba(194, 219, 198, 1)");

                gameCanvasContext.fillStyle = "rgb(0, 0, 0)";
                gameCanvasContext.font = "20px Arial, Helvetica, sans-serif";
                gameCanvasContext.fillText(`${field.number}`, field.startX + 9, field.startY + 23);
            } else {
                Renderer.fillField(field, "rgba(194, 219, 198, 1)");
            }
        }
    }

    public static fillField(field: Field, fillStyle: string): void {
        gameCanvasContext.fillStyle = fillStyle;
        gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);
    }

    public static drawMouse(position: MousePosition): void {
        otherMouseCanvasContext.clearRect(0, 0, otherMouseCanvas.width, otherMouseCanvas.height);

        const field: Field = FieldHelper.getField(position.x, position.y);
        otherMouseCanvasContext.fillStyle = "rgba(255, 255, 255, 0.5)";
        otherMouseCanvasContext.fillRect(field.startX, field.startY, 30, 30);

        otherMouseCanvasContext.drawImage(cursorImage, position.x, position.y);
    }
}
