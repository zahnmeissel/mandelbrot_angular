export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    plus(other: Point) {
        return this.copy().add(other);
    }

    minus(other: Point) {
        return this.copy().sub(other);
    }

    times(r: number) {
        return this.copy().scale(r);
    }

    add(other: Point) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    sub(other: Point) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    scale(r: number): Point {
        this.x *= r;
        this.y *= r;
        return this;
    }

    copy(): Point {
        return new Point(this.x, this.y);
    }
}
