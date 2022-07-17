type Coord = { x: number, y: number; };

export class Grid {
    private _cells!: boolean[][];

    public constructor(private sizeX: number,
                       private sizeY: number) {
        this._cells = new Array(this.sizeY).fill(null).map((_) => {
            return Grid.createRow(this.sizeX);
        });
    }

    private static createRow(size: number): boolean[] {
        return new Array(size).fill(null).map(_ => {
            return false;
        });
    }

    public get cells(): boolean[][] {
        return this._cells;
    }

    public set cells(cells: boolean[][]) {
        this._cells = structuredClone(cells);
    }

    public reset(negate = false): Grid {
        const grid = this.clone();

        grid.cells.forEach((row, y) => {
            row.forEach((celLState, x) => {
                if (negate) {
                    grid.cells[y][x] = !celLState;
                } else {
                    grid.cells[y][x] = false;
                }
            });
        });

        return grid;
    }

    public toggleCell(x: number, y: number): Grid {
        this._cells[y][x] = !this._cells[y][x];

        return this;
    }

    public setDimensions(x: number, y: number): Grid {
        if (x === this.sizeX && y === this.sizeY) {
            return this;
        }
        const grid = this.clone();

        grid.setYDimension(y);
        grid.setXDimension(x);

        return grid;
    }

    public setNext(): Grid {
        const grid = this.clone();

        if (grid.cells.flat().every(x => !x)) {
            return grid;
        }

        const changesNeeded: Coord[] = [];

        grid.cells.forEach((row, y) => {
            row.forEach((_, x) => {
                if (grid.isChangeNeeded(x, y)) {
                    changesNeeded.push({x, y});
                }
            });
        });

        changesNeeded.forEach(coord => {
            grid.cells[coord.y][coord.x] = !grid.cells[coord.y][coord.x];
        });

        return grid;
    }

    private clone(): Grid {
        const grid = new Grid(this.sizeX, this.sizeY);
        grid.cells = this.cells;
        return grid;
    }

    private setXDimension(x: number): void {
        if (x === this.sizeX) {
            return;
        }

        const size = Math.abs(this.sizeX - x);
        this._cells.forEach(row => {
            let i = size;

            while (i > 0) {
                if (x < this.sizeX) {
                    row.pop();
                } else {
                    row.push(false);
                }
                i--;
            }
        });

        this.sizeX = x;

    }

    private setYDimension(y: number): void {
        if (y === this.sizeY) {
            return;
        }

        let i = Math.abs(this.sizeY - y);
        while (i > 0) {
            if (y < this.sizeY) {
                this._cells.pop();
            } else {
                this._cells.push(Grid.createRow(this.sizeX));
            }

            i--;
        }

        this.sizeY = y;
    }

    private isChangeNeeded(x: number, y: number): boolean {
        const isAlive = this._cells[y][x];
        const aliveNeighbors = this.getAmountOfAliveNeighbors(x, y);

        if (isAlive) {
            return aliveNeighbors < 2 || aliveNeighbors > 3;
        } else {
            return aliveNeighbors === 3;
        }
    }

    private getAmountOfAliveNeighbors(x: number, y: number): number {
        const res: boolean[] = [];
        // clockwise starting at 12
        res.push(
            this.getElementValue(x, y - 1),
            this.getElementValue(x + 1, y - 1),
            this.getElementValue(x + 1, y),
            this.getElementValue(x + 1, y + 1),
            this.getElementValue(x, y + 1),
            this.getElementValue(x - 1, y + 1),
            this.getElementValue(x - 1, y),
            this.getElementValue(x - 1, y - 1),
        );

        return res.filter(x => x).length;
    }

    private getElementValue(x: number, y: number): boolean {
        const row = this._cells[y];

        return row
            ? this._cells[y][x] ?? false
            : false;
    }
}
