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
}
