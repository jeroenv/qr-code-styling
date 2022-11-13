import { ReactNode } from "react";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs } from "../../../types";
export default class QRCornerDot {
    _type: CornerDotType;
    constructor({ type }: {
        type: CornerDotType;
    });
    draw(x: number, y: number, size: number, rotation: number): ReactNode;
    _rotateFigure({ x, y, size, rotation, draw }: RotateFigureArgs): ReactNode;
    _basicDot(args: BasicFigureDrawArgs): ReactNode;
    _basicSquare(args: BasicFigureDrawArgs): ReactNode;
    _drawDot({ x, y, size, rotation }: DrawArgs): ReactNode;
    _drawSquare({ x, y, size, rotation }: DrawArgs): ReactNode;
}
