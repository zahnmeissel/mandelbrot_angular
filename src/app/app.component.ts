import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Tile} from './Tile';
import {Point} from './Point';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  private static MAX_TILES = 2048;

  title = 'mandelbrot';
  @ViewChild('sceneCanvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private gl!: WebGLRenderingContext | undefined;
  private renderingContext!: RenderingContext | null;

  ngAfterViewInit() {
    if (!this.canvas) {
      alert('canavs not supplied! cannot bind WebGL context!');
      return;
    }
    this.gl = this.initialiseWebGLContext(this.canvas.nativeElement);
  }

  initialiseWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | undefined {
    // Try to grab the standard context. If it fails, fallback to experimental.
    this.renderingContext =
        canvas.getContext('2d');

    // If we don't have a GL context, give up now... only continue if WebGL is available and working...
    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    this.setWebGLCanvasDimensions(canvas);

    return this.gl;
  }

  setWebGLCanvasDimensions(canvas: HTMLCanvasElement): void {
    // set width and height based on canvas width and height - good practice to use clientWidth and clientHeight
    this.gl!.canvas.width = canvas.clientWidth;
    this.gl!.canvas.height = canvas.clientHeight;
  }

  updateTiles(tiles: Map<string, Tile>, zoom: number, pos: Point, size: Point): Map<string, Tile> {
    console.log('-> tiles.count = ' + tiles.size);
    const z = Math.max(0, Math.ceil(Math.log2(zoom)));
    let min = pos
        .minus(size.times(1 / (2 * zoom)))
        .scale(2 ** z / Tile.TILE_SIZE);
    let max = pos
        .plus(size.times(1 / (2 * zoom)))
        .scale(2 ** z / Tile.TILE_SIZE);
    for (let i = Math.floor(min.x); i < max.x; i++) {
      for (let j = Math.floor(min.y); j < max.y; j++) {
        let idx = `${z},${i},${j}`;
        let tile = tiles.get(idx) || new Tile(i, j, z);
        tiles.set(idx, tile);
      }
    }
    if (tiles.size > AppComponent.MAX_TILES) {
      for (const [idx, tile] of tiles) {
        if (!tile.isVisible(pos, zoom, size)) {
          tiles.delete(idx);
        }
      }
    }
    console.log('<- tiles.count = ' + tiles.size);
    // Sort the tiles by increasing z so that they are rendered in order
    return new Map([...tiles].sort(([x, a], [y, b]) => a.z - b.z));
  }

}
