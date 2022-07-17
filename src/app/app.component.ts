import {Component, OnInit} from '@angular/core';
import {Grid} from '../model/Grid';

@Component({
    selector: 'gol-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public grid: undefined | Grid;

    public constructor() {
    }

    public ngOnInit(): void {
        this.grid = new Grid(10, 10);
    }
}
