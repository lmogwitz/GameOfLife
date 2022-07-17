type Coord = { x: number, y: number; };

export class Grid {
    private readonly _cells: boolean[][];

    public constructor(public sizeX: number,
                       public sizeY: number) {
        this._cells = new Array(sizeY).fill(null).map((_) => {
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

    public toggleCell(x: number, y: number): void {
        this._cells[y][x] = !this._cells[y][x];
    }

    public setDimensions(x: number, y: number): void {
        if (x === this.sizeX && y === this.sizeY) {
            return;
        }

        this.setYDimension(y);
        this.setXDimension(x);
    }

    public setNext(): void {
        const changesNeeded: Coord[] = [];

        this._cells.forEach((row, y) => {
            row.forEach((_, x) => {
                if (this.isChangeNeeded(x, y)) {
                    changesNeeded.push({x, y});
                }
            });
        });

        changesNeeded.forEach(coord => {
            this._cells[coord.y][coord.x] = !this._cells[coord.y][coord.x];
        });
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
