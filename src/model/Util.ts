import {BoundingBox} from './BoundingBox';
import {Coord} from './Coord';

export abstract class Util {
    public static getBoundingBox(coord1: Coord, coord2: Coord): BoundingBox {
        const minX = Math.min(coord1.x, coord2.x);
        const maxX = Math.max(coord1.x, coord2.x);
        const minY = Math.min(coord1.y, coord2.y);
        const maxY = Math.max(coord1.y, coord2.y);

        return {
            min: {x: minX, y: minY},
            max: {x: maxX, y: maxY}
        };
    }
}
