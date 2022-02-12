class Cell extends spnr.GameEngine.Button {
    constructor(gridPosition, gridScale, isMine=false) {
        super('Cell', spnr.v(0, 0), spnr.PI, spnr.v(10, 10), Cell.hiddenTexture,
            '', Cell.textFormat);
        if (Cell.hiddenTexture == undefined) Cell.setupStatics();
        this.addTag('Cell');
        this.gridPosition = spnr.v.copy(gridPosition);
        this.gridScale = gridScale;
        this.isMine = isMine;
        this.isFlagged = false;
        this.isHidden = true;
        this.discoveredByClicking = false;

        this.mouseUpCallbacks.add(() => {
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

        this.sprite.rightdown = () => {
            if (this.isHidden) {
                this.isFlagged = ! this.isFlagged;
            }
        }
    }

    static setupStatics() {
        this.hiddenTexture =
            spnr.GameEngine.Texture.fromUrl('assets/cellHidden.png');
        this.discoveredTexture =
            spnr.GameEngine.Texture.fromUrl('assets/cellDiscovered.png');
        this.flaggedTexture =
            spnr.GameEngine.Texture.fromUrl('assets/cellFlagged.png');
        this.falselyFlaggedTexture =
            spnr.GameEngine.Texture.fromUrl('assets/cellFalselyFlagged.png');
        this.mineDiscoveredClickedTexture =
            spnr.GameEngine.Texture.fromUrl('assets/mineDiscoveredClicked.png');
        this.mineDiscoveredUnlickedTexture =
            spnr.GameEngine.Texture.fromUrl('assets/mineDiscoveredUnclicked.png');
        this.textFormat = {fontSize : 20};
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

    set isHidden(value) {
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
                if (cell.isHidden && ! cell.isMine) {
                    if (cell.numSurroundingMines == 0 || this.numSurroundingMines == 0) {
                        cell.isHidden = false;
                    }
                }
            }
        }
    }

    get isHidden() {
        return this._hidden;
    }

    set isFlagged(value) {
        this._isFlagged = value;
        if (this._isFlagged) this.setTexture(Cell.flaggedTexture);
        else if (this.isHidden) this.setTexture(Cell.hiddenTexture);
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
            cell.isHidden = false;
        }
    }
}
