class Cell extends spnr.GameEngine.Button {
    static hiddenTexture = spnr.GameEngine.Texture.fromUrl('/assets/cellHidden.png');
    static discoveredTexture = spnr.GameEngine.Texture.fromUrl('/assets/cellDiscovered.png');
    static textFormat = {fontSize : 20};

    constructor(gridPosition, gridScale, isMine=false) {
        super('Cell', spnr.v(0, 0), spnr.PI, spnr.v(10, 10), Cell.hiddenTexture,
            '', Cell.textFormat);
        this.addTag('Cell');
        this.gridPosition = spnr.v.copy(gridPosition);
        this.gridScale = gridScale;
        this.isMine = isMine;
        this.isFlagged = false;
        this.hidden = true;

        this.mouseUpCallbacks.add(() => {
            if (spnr.GameEngine.keyboard.keyIsDown.Space) {
                this.isFlagged = true;
            }
            else {
                if (this.isMine && ! this.isFlagged) {
                    this.uncoverAllCells();
                    alert('You lost');
                }
                if (! this.isMine && ! this.isFlagged && this.hidden) {
                    this.hidden = false;
                }
            }
        });
    }

    set gridScale(gridScale) {
        this._gridScale = gridScale;
        this.setTextureSize(spnr.v(this._gridScale, this._gridScale));
        this.setLocalPosition(spnr.v(
            (this.gridPosition.x + 0.5) * this.gridScale,
            (this.gridPosition.y + 0.5) * this.gridScale
        ));
    }

    get gridScale() {
        return this._gridScale;
    }

    set hidden(value) {
        this._hidden = value;

        if (this._hidden) {
            this.label.setText('');
            this.setTexture(Cell.hiddenTexture);
        }
        else {
            this.label.setText(this.numSurroundingMines);
            this.setTexture(Cell.discoveredTexture);
        }
    }

    get hidden() {
        return this._hidden;
    }

    updateCellList(cellList) {
        this.cells = cellList;
    }

    calcSurroundingMines() {
        this.numSurroundingMines = 0;
        for (var cell of this.cells) {
            if (cell == this) continue;
            if (spnr.abs(this.gridPosition.x - cell.gridPosition.x) <= 1 &&
                spnr.abs(this.gridPosition.y - cell.gridPosition.y) <= 1) {
                if (cell.isMine) this.numSurroundingMines ++;
            }
        }
    }

    uncoverAllCells() {
        for (var cell of this.cells) {
            cell.hidden = false;
        }
    }
    
    update() {
    }
}