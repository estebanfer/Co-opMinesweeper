// #region Game properties

let matrix: Field[][] = new Array<Field[]>(16);
let previousActiveField: Field | undefined;

let gameConfiguration: GameConfiguration = new GameConfiguration();
let fieldSize: number = 32;

let flagsLeft: number = 99;
let negativeFlagsLeft: number = 0;

let elapsedTime: number = 0;
let timerIntervalId: number = 0;

const latencyTestStamps: number[] = [];
const latencyTestResults: number[] = [];
let averageLatency: number;

const baseSignalrUrl: string = location.host.indexOf("coopminesweeper.com") !== -1 ? "https://api.coopminesweeper.com" : "";
const debugSimplePeer: boolean = false;

let revealedFields: number = 0;

// #endregion Game properties

// #region Html globals

let canvasHolder: HTMLElement = document.getElementById("canvas-holder") as HTMLElement;

let gameCanvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gameCanvasContext: CanvasRenderingContext2D = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
gameCanvas.width = gameCanvas.offsetWidth;
gameCanvas.height = gameCanvas.offsetHeight;

let mouseCanvas: HTMLCanvasElement = document.getElementById("mouse-canvas") as HTMLCanvasElement;
let mouseCanvasContext: CanvasRenderingContext2D = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;
mouseCanvas.width = mouseCanvas.offsetWidth;
mouseCanvas.height = mouseCanvas.offsetHeight;

let otherMouseCanvas: HTMLCanvasElement = document.getElementById("other-mouse-canvas") as HTMLCanvasElement;
let otherMouseCanvasContext: CanvasRenderingContext2D = otherMouseCanvas.getContext("2d") as CanvasRenderingContext2D;
otherMouseCanvas.width = otherMouseCanvas.offsetWidth;
otherMouseCanvas.height = otherMouseCanvas.offsetHeight;

let cursorImage: HTMLImageElement = new Image();
cursorImage.src = "cursor.png";

let flagImage: HTMLImageElement = new Image();
flagImage.src = "flag.png";

let negativeFlagImage: HTMLImageElement = new Image();
negativeFlagImage.src = "negativeFlag.png";

let bombImage: HTMLImageElement = new Image();
bombImage.src = "bomb.png";

let negativeBombImage: HTMLImageElement = new Image();
negativeBombImage.src = "negativeBomb.png";

const overlay: HTMLElement = document.getElementById("overlay") as HTMLElement;
const overlayStatus: HTMLElement = document.getElementById("overlay-status") as HTMLElement;

const newGameButton: HTMLButtonElement = document.getElementById("new-game-button") as HTMLButtonElement;
const endGameButton: HTMLButtonElement = document.getElementById("end-game-button") as HTMLButtonElement;

const testLatencyButton: HTMLButtonElement = document.getElementById("test-latency-button") as HTMLButtonElement;

let flagsElement: HTMLElement = document.getElementById("flags") as HTMLElement;
let negativeFlagsElement: HTMLElement = document.getElementById("negative-flags") as HTMLElement;
let negativeFlagsContainerElement: HTMLElement = document.getElementById("negative-flags-container") as HTMLElement;
let timerElement: HTMLElement = document.getElementById("timer") as HTMLElement;

// Host only
const gameIdText: HTMLElement = document.getElementById("game-id-text") as HTMLElement;
const copyToClipboardButton: HTMLButtonElement = document.getElementById("copy-to-clipboard-button") as HTMLButtonElement;
const gamemodeSelectElement: HTMLSelectElement = document.getElementById("setting-gamemode") as HTMLSelectElement;
const gameDifficultySelectElement: HTMLInputElement = document.getElementById("setting-difficulty") as HTMLInputElement;
const advancedSettingsElement: HTMLElement = document.getElementById("advanced-settings") as HTMLElement;
const bombAmountElement: HTMLInputElement = document.getElementById("bomb-count") as HTMLInputElement;
const negativeBombAmountElement: HTMLInputElement = document.getElementById("negative-bomb-count") as HTMLInputElement;
const widthSettingElement: HTMLInputElement = document.getElementById("setting-width") as HTMLInputElement;
const heightSettingElement: HTMLInputElement = document.getElementById("setting-height") as HTMLInputElement;

// Client only
const gameIdInput: HTMLInputElement = document.getElementById("game-id-input") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connect-button") as HTMLButtonElement;

// #endregion Html globals
