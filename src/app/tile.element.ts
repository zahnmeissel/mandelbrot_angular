import {Point} from './Point';
import {AfterViewInit, Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import {Tile} from './Tile';

@Component({
    selector: 'tileelement',
    templateUrl: './tile.element.html',
    styleUrls: ['./tile.element.css']
})
export class TileElement implements AfterViewInit {
    @ViewChild('tile') private canvas!: ElementRef<HTMLCanvasElement>;
    @Input() tile!: Tile;
    @Input() pos!: Point;
    @Input() zoom: number = 0;
    @Input() screenSize!: Point;

    public position!: Point;
    public size!: Point;
    public visible: boolean = false;
    public rendered: boolean = false;
    public style: string = '';

    constructor() {
    }

    ngAfterViewInit() {
        if (this.canvas) {
            this.tile.loadOnCanvas(this.canvas.nativeElement).then(() => {
                this.rendered = true;
            })
        }
        this.position = this.tile.screenPosition(this.pos, this.zoom, this.screenSize);
        this.size = this.tile.dimensions.times(this.zoom);
        this.visible = this.rendered && this.tile.isVisible(this.pos, this.zoom, this.screenSize);
        this.style = !this.visible ? '' :
            [
                `left:${Math.floor(this.position.x)}px`,
                `top:${Math.floor(this.position.y)}px`,
                `width:${Math.ceil(this.size.x)}px`,
                `height:${Math.ceil(this.size.y)}px`
            ].join(',');
    }

}
