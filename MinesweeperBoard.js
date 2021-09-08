class MinesweeperBoard extends spnr.GameEngine.Scene {
    constructor(gridSize=spnr.v(10, 10)) {
        super('MinesweeperBoard');
        this.gridSize = spnr.v.copy(gridSize);
    }

    onSelected() {
        this.reset();
    }

    reset() {
        this.playerHasWon = false;
        this.playerHasLost = false;
        this.generateCells();
    }

    generateCells() {
        this.cells = [];
        this.removeChildren();

        spnr.doNTimes(this.gridSize.y, row => {
            spnr.doNTimes(this.gridSize.x, col => {
                var isMine = spnr.randflt(0, 1) < 0.125;
                var cell = new Cell(spnr.v(col, row), 1, isMine);
                cell.updateCellList(this.cells);
                this.addChild(cell);
                this.cells.push(cell);
            });
        });

        this.cells.forEach(cell => cell.calcSurroundingMines());
    }

    update() {
        var canvasSize = spnr.GameEngine.canvasSize;
        var scale = spnr.min(canvasSize.x, canvasSize.y) / spnr.max(this.gridSize.x, this.gridSize.y);

        this.cells.forEach(cell => cell.gridScale = scale);
        if (! this.playerHasWon && ! this.playerHasLost) {
            var allNonMinesDiscovered = true;
            var mineClicked = false;
            for (var cell of this.cells) {
                if (! cell.isMine && cell.isHidden) {
                    allNonMinesDiscovered = false;
                }
                if (cell.isMine && ! cell.isHidden) {
                    mineClicked = true;
                }
            }

            if (allNonMinesDiscovered && ! mineClicked) {
                this.playerHasWon = true;
                setTimeout(() => {
                    alert('You win!');
                    this.reset();
                }, 1000);
            }
            else if (mineClicked) {
                this.playerHasWon = true;
                setTimeout(() => {
                    alert('You lose!');
                    this.reset();
                }, 1000);
            }
        }
    }
}