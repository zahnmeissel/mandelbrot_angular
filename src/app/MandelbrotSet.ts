import {Point} from './Point';

export class MandelbrotSet {

    private static PALETTE_SIZE = 256;

/*
    private static palette = new Uint8ClampedArray(
        palette.generate('tol-dv', MandelbrotSet.PALETTE_SIZE)
            .flatMap(c =>
                c.match(/../g)
                    .map(s => parseInt(s, 16))
                    .concat(255) // alpha channel
            )
    );
*/

    public static mandelbrot_pixels(point: Point, zoom: number, size: Point): Uint8ClampedArray {
        const maxIter = MandelbrotSet.PALETTE_SIZE - 1;
        const pxs = new Uint8ClampedArray(size.x * size.y * 4);
        const ratio_x = 1 / zoom;
        const ratio_y = 1 / zoom;
        for (let i = 0; i < pxs.length; i += 4) {
            let idx = i / 4 | 0;
            let x = idx % size.x;
            let y = idx / size.x | 0;
            let px = point.x + x * ratio_x;
            let py = point.y + y * ratio_y;
            let n = MandelbrotSet.mandelbrot(px, py, maxIter);
            //n = (n * 4) % MandelbrotSet.palette.length;
            //pxs.set(MandelbrotSet.palette.subarray(n, n + 4), i);
            pxs.set([n, n, n], i);
        }
        return pxs;
    }

    private static mandelbrot(cx: number, cy: number, maxIters: number): number {
        if (MandelbrotSet.testBulb(cx, cy) || MandelbrotSet.testCardioid(cx, cy)) return maxIters;
        let i, xs = cx * cx, ys = cy * cy, x = cx, y = cy;
        for (i = 0; i < maxIters && xs + ys < 4; i++) {
            let x0 = x;
            x = xs - ys + cx;
            y = 2 * x0 * y + cy;
            xs = x * x;
            ys = y * y;
        }
        return i;
    }

    private static testCardioid(x: number, y: number): boolean {
        const a = (x - 1 / 4);
        const q = a * a + y * y;
        return q * (q + a) <= .25 * y * y;
    }

    private static testBulb(x: number, y: number): boolean {
        const a = x + 1;
        return a * a + y * y <= 1 / 16;
    }

}
