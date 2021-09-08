class MinesweeperBoard extends spnr.GameEngine.Scene {
    constructor(gridSize=spnr.v(10, 10), numMines=70) {
        super('MinesweeperBoard');
        this.gridSize = spnr.v.copy(gridSize);
        this.numMines = numMines;

        spnr.GameEngine.mouse.onPointerUp.add(() => {
            if (! this.firstClickMade) {
                this.firstClickMade = true;
                this.generateMines();
            }
        });
    }

    onSelected() {
        this.reset();
    }

    reset() {
        this.playerHasWon = false;
        this.playerHasLost = false;
        this.firstClickMade = false;
        this.inputLocked = true;
        this.generateCells();
    }

    generateCells() {
        this.cells = [];
        this.removeChildren();

        spnr.doNTimes(this.gridSize.y, row => {
            spnr.doNTimes(this.gridSize.x, col => {
                var cell = new Cell(spnr.v(col, row), 1);
                cell.updateCellList(this.cells);
                this.addChild(cell);
                this.cells.push(cell);
            });
        });

    }

    generateMines() {
        // Safety check to make sure we don't get stuck in infinite loop
        // (subtract 1 because the cell that was clicked has to be kept free)
        if (this.numMines > this.gridSize.x * this.gridSize.y - 1) {
            alert(`Cannot fit ${this.numMines} in ${this.gridSize.x}x${this.gridSize.y} grid`);
        }

        // Find what cell was clicked, to make sure we don't put a mine on it
        var clickedCell = null;
        for (var cell of this.cells) {
            if (cell.mouseHovering) {
                clickedCell = cell;
                break;
            }
        }
        console.log(clickedCell)
        if (clickedCell == null) return;

        var minePositions = [];
        while (minePositions.length < this.numMines) {
            var newPosition = spnr.v.random(spnr.v(0, 0), this.gridSize, false);

            if (spnr.v.equal(newPosition, clickedCell.gridPosition)) continue;

            var positionAlreadyTaken = false;
            innerLoop:
            for (var position of minePositions) {
                if (spnr.v.equal(newPosition, position)) {
                    positionAlreadyTaken = true;
                    break innerLoop;
                }
            }
            if (positionAlreadyTaken) continue;

            // Actually make the
            for (var cell of this.cells) {
                if (spnr.v.equal(cell.gridPosition, newPosition)) {
                    cell.isMine = true;
                }
            }

            minePositions.push(newPosition);
        }
        clickedCell.hidden = false;
        console.log('adfadadsadsf')
        setTimeout(() => this.inputLocked = false, 200);
    }

    update() {
        var canvasSize = spnr.GameEngine.canvasSize;
        var scale = spnr.min(canvasSize.x, canvasSize.y) / spnr.max(this.gridSize.x, this.gridSize.y);

        this.cells.forEach(cell => {
            cell.gridScale = scale;
            cell.inputLocked = this.inputLocked;
        });
        if (! this.playerHasWon && ! this.playerHasLost && ! this.inputLocked) {
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
                this.inputLocked = true;
                setTimeout(() => {
                    alert('You win!');
                    this.reset();
                }, 1000);
            }
            else if (mineClicked) {
                this.playerHasWon = true;
                this.inputLocked = true;
                setTimeout(() => {
                    alert('You lose!');
                    this.reset();
                }, 1000);
            }
        }
    }
}