class Cell extends spnr.GameEngine.Button {
    static hiddenTexture =
        spnr.GameEngine.Texture.fromUrl('assets/cellHidden.png');
    static discoveredTexture =
        spnr.GameEngine.Texture.fromUrl('assets/cellDiscovered.png');
    static flaggedTexture =
        spnr.GameEngine.Texture.fromUrl('assets/cellFlagged.png');
    static falselyFlaggedTexture =
        spnr.GameEngine.Texture.fromUrl('assets/cellFalselyFlagged.png');
    static mineDiscoveredClickedTexture =
        spnr.GameEngine.Texture.fromUrl('assets/mineDiscoveredClicked.png');
    static mineDiscoveredUnlickedTexture =
        spnr.GameEngine.Texture.fromUrl('assets/mineDiscoveredUnclicked.png');
    static textFormat = {fontSize : 20};

    constructor(gridPosition, gridScale, isMine=false) {
        super('Cell', spnr.v(0, 0), spnr.PI, spnr.v(10, 10), Cell.hiddenTexture,
            '', Cell.textFormat);
        this.addTag('Cell');
        this.gridPosition = spnr.v.copy(gridPosition);
        this.gridScale = gridScale;
        this.isMine = isMine;
        this.isFlagged = false;
        this.isHidden = true;
        this.inputLocked = false;
        this.discoveredByClicking = false;
        this.numSurroundingMines = 0;
        
        this.mouseUpCallbacks.add(() => {
            if (this.inputLocked) return;
            if (spnr.GameEngine.keyboard.keyIsDown('ControlLeft') ||
                spnr.GameEngine.keyboard.keyIsDown('ControlRight')) {
                if (this.isHidden) {
                    this.isFlagged = ! this.isFlagged;
                }
            }
            else {
                this.discoveredByClicking = true;
                if (this.isMine && ! this.isFlagged) {
                    this.uncoverAllCells();
                }
                if (! this.isMine && ! this.isFlagged && this.isHidden) {
                    this.isHidden = false;
                }
            }
        });
    }

    get gridScale() {
        return this._gridScale;
    }

    set gridScale(gridScale) {
        this._gridScale = gridScale;
        this.setTextureSize(spnr.v(this._gridScale, this._gridScale));
        this.setLocalPosition(spnr.v(
            (this.gridPosition.x + 0.5) * this.gridScale,
            (this.gridPosition.y + 0.5) * this.gridScale
        ));
    }

    get isHidden() {
        return this._hidden;
    }

    set isHidden(value) {
        this._hidden = value;

        if (this._hidden) {
            this.label.setText('');
        }
        else {
            if (this.numSurroundingMines == 0 || this.isMine) this.label.setText('');
            else this.label.setText(this.numSurroundingMines);

            for (var cell of this.surroundingCells) {
                if (cell.isHidden && ! cell.isMine) {
                    if (cell.numSurroundingMines == 0 || this.numSurroundingMines == 0) {
                        cell.isHidden = false;
                    }
                }
            }
        }
        this.updateTexture();
    }

    get isFlagged() {
        return this._isFlagged;
    }

    set isFlagged(value) {
        this._isFlagged = value;
        this.updateTexture();
    }

    get isMine() {
        return this._isMine;
    }

    set isMine(value) {
        this._isMine = value;
        this.updateTexture();
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

    updateTexture() {
        // Make the texture match the cell's current state
        if (this.isHidden)
            this.setTexture(Cell.hiddenTexture);
        else if (this.isMine && this.discoveredByClicking)
            this.setTexture(Cell.mineDiscoveredClickedTexture);
        else if (this.isMine && ! this.discoveredByClicking)
            this.setTexture(Cell.mineDiscoveredUnlickedTexture);
        else if (this.isFlagged && ! this.isMine)
            this.setTexture(Cell.falselyFlaggedTexture);
        else this.setTexture(Cell.discoveredTexture);
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
            cell.isHidden = false;
        }
    }
}