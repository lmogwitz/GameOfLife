import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, debounceTime, filter, from, interval, startWith, switchMap} from 'rxjs';
import {Coord} from '../model/Coord';
import {Grid} from '../model/Grid';
import {Util} from '../model/Util';

const defaultX = 48;
const defaultY = 30;

@Component({
    selector: 'gol-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    public grid$ = new BehaviorSubject<null | Grid>(null);

    public minCols = 3;
    public minRows = 3;
    public maxCols = 100;
    public maxRows = 100;

    public isAutoRunActive = false;
    public isShiftDown = false;
    public currentCell: null | Coord = null;

    private _grid = new Grid(defaultX, defaultY);
    private _fg = new FormGroup({
        x: new FormControl<number>(defaultX, [Validators.min(this.minCols), Validators.max(this.maxCols)]),
        y: new FormControl<number>(defaultY, [Validators.min(this.minRows), Validators.max(this.maxRows)]),
    });

    private _multiSelectStart: null | Coord = null;

    public constructor() {
    }

    public get fg(): typeof this._fg {
        return this._fg;
    }

    @HostListener('window:keydown', ['$event'])
    public keydown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;
        }
    }

    @HostListener('window:keyup', ['$event'])
    public keyup(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = false;
        }
    }

    public ngOnInit(): void {
        this._fg.valueChanges.pipe(
            startWith(this._fg.value),
            filter(() => this.fg.valid),
            debounceTime(100)
        ).subscribe((formValue) => {
            this.updateUiGrid(
                this._grid.setDimensions(formValue.x ?? defaultX, formValue.y ?? defaultY)
            );
        });

        interval(500).pipe(
            filter(() => this.isAutoRunActive),
            switchMap(() => {
                return from(this.handleClickSetNextState());
            })
        ).subscribe();
    }

    public async handleClickSetNextState(): Promise<void> {
        this.updateUiGrid(
            this._grid.setNext()
        );
    }

    public async handleClickReset(): Promise<void> {
        this.updateUiGrid(
            this._grid.reset()
        );
    }

    public async handleClickNegate(): Promise<void> {
        this.updateUiGrid(
            this._grid.reset(true)
        );
    }

    public async handleClickToggleCell(grid: Grid, x: number, y: number): Promise<void> {
        if (this.isAutoRunActive) {
            return;
        }

        if (this.isShiftDown || this._multiSelectStart !== null) {
            if (this._multiSelectStart === null) {
                this._multiSelectStart = {x, y};
            } else {
                grid.toggleCells(Util.getBoundingBox(this._multiSelectStart, {x, y}));

                this._multiSelectStart = null;
                this.currentCell = null;
            }
            return;
        }

        grid.toggleCell(x, y);
    }

    public isInMultiSelect(x: number, y: number): boolean {
        if (this._multiSelectStart === null || this.currentCell === null) {
            return false;
        }

        const {min, max} = Util.getBoundingBox(this._multiSelectStart, this.currentCell);

        return x >= min.x
            && x <= max.x
            && y >= min.y
            && y <= max.y;
    }

    private updateUiGrid(grid: Grid): void {
        this._grid = grid;
        this.grid$.next(grid);
    }
}
