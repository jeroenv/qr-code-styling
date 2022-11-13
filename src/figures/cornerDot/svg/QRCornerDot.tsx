import React, { ReactNode } from "react";
import cornerDotTypes from "../../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs } from "../../../types";

export default class QRCornerDot {
  _type: CornerDotType;

  constructor({ type }: { type: CornerDotType }) {
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): ReactNode {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    return drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): ReactNode {
    const cx = x + size / 2;
    const cy = y + size / 2;

    return draw(`rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): ReactNode {
    const { size, x, y } = args;

    return this._rotateFigure({
      ...args,
      draw: (rotation) => <circle cx={x + size / 2} cy={y + size / 2} r={size / 2} transform={rotation} />
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): ReactNode {
    const { size, x, y } = args;

    return this._rotateFigure({
      ...args,
      draw: (rotation) => <rect x={x} y={y} width={size} height={size} transform={rotation} />
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): ReactNode {
    return this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): ReactNode {
    return this._basicSquare({ x, y, size, rotation });
  }
}
