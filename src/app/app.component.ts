import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {filter, startWith} from 'rxjs';
import {Grid} from '../model/Grid';

const defaultX = 16;
const defaultY = 10;

@Component({
    selector: 'gol-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public grid = new Grid(defaultX, defaultY);

    public minCols = 3;
    public minRows = 3;
    public maxCols = 100;
    public maxRows = 100;

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
            this.grid.setDimensions(formValue.x ?? defaultX, formValue.y ?? defaultY);
        });
    }

    public async handleClickSetNextState(): Promise<void> {
        this.grid.setNext();
    }
}
