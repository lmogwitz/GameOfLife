export class Grid {
    private readonly _cells: boolean[][];

    public constructor(public sizeX: number,
                       public sizeY: number) {
        this._cells = new Array(sizeY).fill(null).map((y) => {
            return new Array(sizeX).fill(null).map(x => {
                return false;
            });
        });
    }

    public get cells(): boolean[][] {
        return this._cells;
    }

    public toggleCell(x: number, y: number): void {
        this._cells[y][x] = !this._cells[y][x];
    }
}
