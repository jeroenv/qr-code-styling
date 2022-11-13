import { ReactNode } from "react";
import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs } from "../../../types";
export default class QRCornerSquare {
    _type: CornerSquareType;
    constructor({ type }: {
        type: CornerSquareType;
    });
    draw(x: number, y: number, size: number, rotation: number): ReactNode;
    _rotateFigure({ x, y, size, rotation, draw }: RotateFigureArgs): ReactNode;
    _basicDot(args: BasicFigureDrawArgs): ReactNode;
    _basicSquare(args: BasicFigureDrawArgs): ReactNode;
    _basicExtraRounded(args: BasicFigureDrawArgs): ReactNode;
    _drawDot({ x, y, size, rotation }: DrawArgs): ReactNode;
    _drawSquare({ x, y, size, rotation }: DrawArgs): ReactNode;
    _drawExtraRounded({ x, y, size, rotation }: DrawArgs): ReactNode;
}
