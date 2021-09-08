class Cell extends spnr.GameEngine.Button {
    static hiddenTexture =
        spnr.GameEngine.Texture.fromUrl('/assets/cellHidden.png');
    static discoveredTexture =
        spnr.GameEngine.Texture.fromUrl('/assets/cellDiscovered.png');
    static flaggedTexture =
        spnr.GameEngine.Texture.fromUrl('/assets/cellFlagged.png');
    static falselyFlaggedTexture =
        spnr.GameEngine.Texture.fromUrl('/assets/cellFalselyFlagged.png');
    static mineDiscoveredClickedTexture =
        spnr.GameEngine.Texture.fromUrl('/assets/mineDiscoveredClicked.png');
    static mineDiscoveredUnlickedTexture =
        spnr.GameEngine.Texture.fromUrl('/assets/mineDiscoveredUnclicked.png');
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
        this.discoveredByClicking = false;

        this.mouseUpCallbacks.add(() => {
            if (spnr.GameEngine.keyboard.keyIsDown('ControlLeft') ||
                spnr.GameEngine.keyboard.keyIsDown('ControlRight')) {
                this.isFlagged = ! this.isFlagged;
            }
            else {
                this.discoveredByClicking = true;
                if (this.isMine && ! this.isFlagged) {
                    this.uncoverAllCells();
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
            if (this.numSurroundingMines == 0 || this.isMine) this.label.setText('');
            else this.label.setText(this.numSurroundingMines);

            if (this.isMine && this.discoveredByClicking)
                this.setTexture(Cell.mineDiscoveredClickedTexture);
            else if (this.isMine && ! this.discoveredByClicking)
                this.setTexture(Cell.mineDiscoveredUnlickedTexture);
            else if (this.isFlagged && ! this.isMine)
                this.setTexture(Cell.falselyFlaggedTexture);
            else this.setTexture(Cell.discoveredTexture);

            for (var cell of this.surroundingCells) {
                if (cell.hidden && ! cell.isMine) {
                    if (cell.numSurroundingMines == 0 || this.numSurroundingMines == 0) {
                        cell.hidden = false;
                    }
                }
            }
        }
    }

    get hidden() {
        return this._hidden;
    }

    set isFlagged(value) {
        this._isFlagged = value;
        if (this._isFlagged) this.setTexture(Cell.flaggedTexture);
        else if (this.hidden) this.setTexture(Cell.hiddenTexture);
        else this.setTexture(Cell.discoveredTexture)
    }

    get isFlagged() {
        return this._isFlagged;
    }

    get surroundingCells() {
        if (this._surroundingCells != undefined) return this._surroundingCells;
        else {
            this._surroundingCells = [];
            for (var cell of this.cells) {
                if (cell == this) continue;
                if (spnr.abs(this.gridPosition.x - cell.gridPosition.x) <= 1 &&
                    spnr.abs(this.gridPosition.y - cell.gridPosition.y) <= 1) {
                    this._surroundingCells.push(cell);
                }
            }
            return this._surroundingCells;
        }
    }

    updateCellList(cellList) {
        this.cells = cellList;
    }

    calcSurroundingMines() {
        this.numSurroundingMines = 0;
        for (var cell of this.surroundingCells) {
            if (cell.isMine) this.numSurroundingMines ++;
        }
    }

    uncoverAllCells() {
        for (var cell of this.cells) {
            cell.hidden = false;
        }
    }
}