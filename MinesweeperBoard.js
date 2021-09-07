class MinesweeperBoard extends spnr.GameEngine.Scene {
    constructor(gridSize=spnr.v(10, 10)) {
        super('MinesweeperBoard');
        this.gridSize = spnr.v.copy(gridSize);
        this.generateCells();
    }

    generateCells() {
        var canvasSize = spnr.GameEngine.canvasSize;
        var scale = spnr.min(canvasSize.x, canvasSize.y) / spnr.max(this.gridSize.x, this.gridSize.y);
        
        this.cells = [];

        spnr.doNTimes(this.gridSize.y, row => {
            spnr.doNTimes(this.gridSize.x, col => {
                var isMine = spnr.randflt(0, 1) < 0.25;
                var cell = new Cell(spnr.v(col, row), scale, isMine);
                cell.updateCellList(this.cells);
                this.addChild(cell);
                this.cells.push(cell);
            });
        });

        this.cells.forEach(child => child.calcSurroundingMines());
    }

}