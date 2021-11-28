spnr.GameEngine.init(spnr.v(1, 1), 1, 0x000000);
var minesweeperBoard = new MinesweeperBoard(spnr.v(15, 15));
var canvasSizer = new spnr.GameEngine.FixedARCanvasSizer(spnr.v(500, 500), spnr.v(10, 60));
spnr.GameEngine.selectCanvasSizer(canvasSizer);
spnr.GameEngine.selectScene(minesweeperBoard);
spnr.GameEngine.pixiApp.view.oncontextmenu = () => false; // disable right click context menu
