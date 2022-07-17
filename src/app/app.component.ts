import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, filter, from, interval, startWith, switchMap} from 'rxjs';
import {Grid} from '../model/Grid';

const defaultX = 64;
const defaultY = 40;

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
    private grid = new Grid(defaultX, defaultY);
    private _fg = new FormGroup({
        x: new FormControl<number>(defaultX, [Validators.min(this.minCols), Validators.max(this.maxCols)]),
        y: new FormControl<number>(defaultY, [Validators.min(this.minRows), Validators.max(this.maxRows)]),
    });

    public constructor() {
    }

    public get fg(): typeof this._fg {
        return this._fg;
    }

    public ngOnInit(): void {
        this._fg.valueChanges.pipe(
            startWith(this._fg.value),
            filter(() => this.fg.valid)
        ).subscribe((formValue) => {
            this.updateUiGrid(
                this.grid.setDimensions(formValue.x ?? defaultX, formValue.y ?? defaultY)
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
            this.grid.setNext()
        );
    }

    public async handleClickReset(): Promise<void> {
        this.updateUiGrid(
            this.grid.reset()
        );
    }

    public async handleClickNegate(): Promise<void> {
        this.updateUiGrid(
            this.grid.reset(true)
        );
    }

    private updateUiGrid(grid: Grid): void {
        this.grid = grid;
        this.grid$.next(grid);
    }
}
