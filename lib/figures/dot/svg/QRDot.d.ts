import { ReactNode } from "react";
import { DotType, GetNeighbor, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs } from "../../../types";
export default class QRDot {
    _type: DotType;
    constructor({ type }: {
        type: DotType;
    });
    draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): ReactNode;
    _rotateFigure({ x, y, size, rotation, draw }: RotateFigureArgs): ReactNode;
    _basicDot(args: BasicFigureDrawArgs): ReactNode;
    _basicSquare(args: BasicFigureDrawArgs): ReactNode;
    _basicSideRounded(args: BasicFigureDrawArgs): ReactNode;
    _basicCornerRounded(args: BasicFigureDrawArgs): ReactNode;
    _basicCornerExtraRounded(args: BasicFigureDrawArgs): ReactNode;
    _basicCornersRounded(args: BasicFigureDrawArgs): ReactNode;
    _drawDot({ x, y, size }: DrawArgs): ReactNode;
    _drawSquare({ x, y, size }: DrawArgs): ReactNode;
    _drawRounded({ x, y, size, getNeighbor }: DrawArgs): ReactNode;
    _drawExtraRounded({ x, y, size, getNeighbor }: DrawArgs): ReactNode;
    _drawClassy({ x, y, size, getNeighbor }: DrawArgs): ReactNode;
    _drawClassyRounded({ x, y, size, getNeighbor }: DrawArgs): ReactNode;
}
