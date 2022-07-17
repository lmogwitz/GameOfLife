class Cell {
    public isAlive = false;
}

export class Grid {

    private readonly _cells: Cell[][];

    public constructor(public sizeX: number,
                       public sizeY: number) {
        this._cells = new Array(sizeY).fill(null).map((y) => {
            return new Array(sizeX).fill(null).map(x => {
                return new Cell();
            });
        });
    }

    public get cells(): Cell[][] {
        return this._cells;
    }
}
