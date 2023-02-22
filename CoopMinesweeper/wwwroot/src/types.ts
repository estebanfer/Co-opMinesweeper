class Field {
    public startX: number;
    public startY: number;

    public row: number;
    public column: number;

    public number: number;
    public revealed: boolean;
    public flag: FlagType;
    public type: FieldType;

    constructor(x: number, y: number, row: number, column: number) {
        this.startX = x;
        this.startY = y;

        this.row = row;
        this.column = column;

        this.number = 0;
        this.revealed = false;
        this.flag = FlagType.NoFlag;
        this.type = FieldType.None;
    }
}

enum FlagType {
    NoFlag,
    Flag,
    NegativeFlag
}

enum FieldType {
    None,
    NoBomb,
    Empty,
    Number,
    Bomb,
    NegativeBomb
}

enum GameMode {
    Normal,
    NegativeBombs
}

class MousePosition {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class ClientDataObject {
    public mousePosition!: MousePosition;
    public stamp!: number;
    public clientEventType: ClientEventType;

    constructor(clientEventType: ClientEventType.NewGame);
    constructor(clientEventType: ClientEventType.Move | ClientEventType.Click | ClientEventType.Flag, mousePosition: MousePosition);
    constructor(clientEventType: ClientEventType.LatencyTest | ClientEventType.LatencyResponse, stamp: number);
    constructor(clientEventType: ClientEventType, arg?: MousePosition | number) {
        if (arg) {
            if (arg instanceof MousePosition) {
                this.mousePosition = arg;
            } else {
                this.stamp = arg;
            }
        }

        this.clientEventType = clientEventType;
    }
}

enum ClientEventType {
    Move,
    Click,
    Flag,
    NewGame,
    LatencyTest,
    LatencyResponse
}

class GameConfiguration {
    public gamemode!: GameMode | undefined;
    constructor(gamemode?: GameMode) {
        this.gamemode = gamemode;
    }
}

class ServerDataObject {
    public mousePosition!: MousePosition;
    public stamp!: number;
    public affectedFields!: Field[];
    public flagsLeft!: number | undefined;
    public negativeFlagsLeft!: number | undefined;
    public elapsedTime!: number | undefined;
    public serverEventType: ServerEventType;
    public config!: GameConfiguration;

    constructor(serverEventType: ServerEventType.NewGame);
    constructor(serverEventType: ServerEventType.Move, mousePosition: MousePosition);
    constructor(serverEventType: ServerEventType.ConfigChange, config: GameConfiguration);
    constructor(serverEventType: ServerEventType.LatencyTest | ServerEventType.LatencyResponse, stamp: number);
    constructor(serverEventType: ServerEventType.Game, affectedFields: Field[], flagsLeft?: number, negativeFlagsLeft?: number);
    constructor(serverEventType: ServerEventType.GameWon, affectedFields: Field[], elapsedTime: number);
    constructor(serverEventType: ServerEventType.GameOver, affectedFields: Field[], elapsedTime: number);
    constructor(serverEventType: ServerEventType, arg?: MousePosition | number | Field[] | GameConfiguration, arg2?: number, arg3?: number) {
        if (arg) {
            if (arg instanceof MousePosition) {
                this.mousePosition = arg;
            } else if (arg instanceof GameConfiguration) {
                this.config = arg;
            } else if (typeof arg === "number") {
                this.stamp = arg;
            } else { // Game
                this.affectedFields = arg;
                if (serverEventType === ServerEventType.Game) {
                    this.flagsLeft = arg2;
                    this.negativeFlagsLeft = arg3;
                } else {
                    this.elapsedTime = arg2;
                }
            }
        }

        this.serverEventType = serverEventType;
    }
}

enum ServerEventType {
    Move,
    Game,
    GameWon,
    GameOver,
    NewGame,
    LatencyTest,
    LatencyResponse,
    ConfigChange
}
