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
  private static MIN_ZOOM = 250;
  private static MAX_ZOOM = 1e16;

  title = 'mandelbrot';
  tiles: Map<string, Tile> = new Map<string, Tile>();

  public zoom: number = AppComponent.MIN_ZOOM;
  public pos: Point = new Point(-0.5, 0); // Current position
  public size: Point = new Point(0, 0); // Display size in pixels

  ngAfterViewInit() {
    this.updateTiles(this.tiles, this.zoom, this.pos, this.size);
  }

  getTiles(): Array<Tile> {
    return Array.from(this.tiles.values());
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
