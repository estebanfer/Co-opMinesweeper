abstract class InputHelper {
    public static setInputEventListenersCommon(peer: SimplePeer) {
        otherMouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
            InputHelper.handleInputMouseMove(e, peer)
        });
        otherMouseCanvas.addEventListener("mousedown", InputHelper.mouseDownFunc);
        otherMouseCanvas.addEventListener("mouseup", InputHelper.mouseUpFunc);
        
    }

    public static handleInputMouseMove(e: MouseEvent, peer: SimplePeer) {
        const mousePosition: MousePosition = Helpers.getMousePosition(otherMouseCanvas, e);
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Move, mousePosition)));

        const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);
        const surroundingFields: Field[] | undefined = ((e.buttons & 1) && field.revealed)
            ? FieldHelper.getSurroundingFieldsForChord(field)
            : undefined;
        Renderer.renderMouseMove(field, surroundingFields);
    }

    public static handleInputClick(e: MouseEvent, callback: (field: Field, mousePos: MousePosition) => void): void {
        const mousePosition: MousePosition = Helpers.getMousePosition(otherMouseCanvas, e);
        const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);
    
        if ((field.revealed && field.type !== FieldType.Number) || FieldHelper.isFlag(field.flag)) {
            return;
        }
    
        callback(field, mousePosition);
    }

    public static handleInputRightClick(e: MouseEvent, callback: (field: Field, mousePos: MousePosition) => void) {
        e.preventDefault();
        const mousePosition: MousePosition = Helpers.getMousePosition(otherMouseCanvas, e);
        const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);
    
        if (field.revealed) {
            return;
        }

        callback(field, mousePosition)
    }

    public static mouseDownFunc(e: MouseEvent): void {
        if (e.button !== 0) return
        const mousePosition: MousePosition = Helpers.getMousePosition(otherMouseCanvas, e);
        const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);
    
        if (field.revealed && field.type === FieldType.Number) {
            Renderer.renderMouseChord(FieldHelper.getSurroundingFieldsForChord(field));
        }
    }

    public static mouseUpFunc(e: MouseEvent): void {
        if (e.button !== 0) return
        const mousePosition: MousePosition = Helpers.getMousePosition(otherMouseCanvas, e);
        const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);
        
        if (field.revealed && field.type === FieldType.Number) {
            Renderer.clearMouseChord(field);
        }
    }
}