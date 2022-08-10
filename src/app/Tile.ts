import {Point} from './Point';
import {MandelbrotSet} from './MandelbrotSet';

export class Tile {

    public static TILE_SIZE = 256;

    public x: number;
    public y: number;
    public z: number;
    public size: Point;
    public dimensions: Point;

    private zoom: number;
    private position: Point;
    private rendered: boolean;
    private canvas: HTMLCanvasElement | null;


    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = new Point(Tile.TILE_SIZE, Tile.TILE_SIZE);
        this.zoom = 2 ** this.z;
        this.dimensions = this.size.times(1 / this.zoom);
        this.position = new Point(this.x * this.dimensions.x, this.y * this.dimensions.y);
        this.canvas = null;
        this.rendered = false;
    }

    public async loadOnCanvas(canvas: HTMLCanvasElement) {
        if (this.canvas === canvas) {
            return;
        }
        this.canvas = canvas;
        const ctx: CanvasRenderingContext2D | null = this.canvas.getContext("2d");
        let pxs = MandelbrotSet.mandelbrot_pixels(this.position, this.zoom, this.size);
        let iData = new ImageData(pxs, this.size.x, this.size.y);
        ctx!.putImageData(iData, 0, 0);
        this.rendered = true;
    }

    screenPosition(pos: Point, zoom: number, screenSize: Point) {
        return this.position.minus(pos).scale(zoom).add(screenSize.times(.5));
    }

    isVisible(pos: Point, zoom: number, screenSize: Point) {
        const screenPosition = this.screenPosition(pos, zoom, screenSize);
        const size = this.dimensions.times(zoom);
        return size.x >= 1 &&
            size.y >= 1 &&
            -size.x < screenPosition.x &&
            screenPosition.x < screenSize.x &&
            -size.y < screenPosition.y &&
            screenPosition.y < screenSize.y;
    }
}
