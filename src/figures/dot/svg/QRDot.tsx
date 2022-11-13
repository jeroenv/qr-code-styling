import React, { ReactNode } from "react";
import dotTypes from "../../../constants/dotTypes";
import { DotType, GetNeighbor, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs } from "../../../types";

export default class QRDot {
  _type: DotType;

  constructor({ type }: { type: DotType }) {
    this._type = type;
  }

  draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): ReactNode {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case dotTypes.dots:
        drawFunction = this._drawDot;
        break;
      case dotTypes.classy:
        drawFunction = this._drawClassy;
        break;
      case dotTypes.classyRounded:
        drawFunction = this._drawClassyRounded;
        break;
      case dotTypes.rounded:
        drawFunction = this._drawRounded;
        break;
      case dotTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case dotTypes.square:
      default:
        drawFunction = this._drawSquare;
    }

    return drawFunction.call(this, { x, y, size, getNeighbor });
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

  //if rotation === 0 - right side is rounded
  _basicSideRounded(args: BasicFigureDrawArgs): ReactNode {
    const { size, x, y } = args;

    return this._rotateFigure({
      ...args,
      draw: (rotation) => (
        <path
          d={
            `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size / 2}` + //draw line to left bottom corner + half of size right
            `a ${size / 2} ${size / 2}, 0, 0, 0, 0 ${-size}` // draw rounded corner}
          }
          transform={rotation}
        />
      )
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(args: BasicFigureDrawArgs): ReactNode {
    const { size, x, y } = args;

    return this._rotateFigure({
      ...args,
      draw: (rotation) => (
        <path
          d={
            `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size}` + //draw line to right bottom corner
            `v ${-size / 2}` + //draw line to right bottom corner + half of size top
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded corner
          }
          transform={rotation}
        />
      )
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(args: BasicFigureDrawArgs): ReactNode {
    const { size, x, y } = args;

    return this._rotateFigure({
      ...args,
      draw: (rotation) => (
        <path
          d={
            `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size}` + //draw line to right bottom corner
            `a ${size} ${size}, 0, 0, 0, ${-size} ${-size}` // draw rounded top right corner
          }
          transform={rotation}
        />
      )
    });
  }

  //if rotation === 0 - left bottom and right top corners are rounded
  _basicCornersRounded(args: BasicFigureDrawArgs): ReactNode {
    const { size, x, y } = args;

    return this._rotateFigure({
      ...args,
      draw: (rotation) => (
        <path
          d={
            `M ${x} ${y}` + //go to left top position
            `v ${size / 2}` + //draw line to left top corner + half of size bottom
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${size / 2} ${size / 2}` + // draw rounded left bottom corner
            `h ${size / 2}` + //draw line to right bottom corner
            `v ${-size / 2}` + //draw line to right bottom corner + half of size top
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded right top corner
          }
          transform={rotation}
        />
      )
    });
  }

  _drawDot({ x, y, size }: DrawArgs): ReactNode {
    return this._basicDot({ x, y, size, rotation: 0 });
  }

  _drawSquare({ x, y, size }: DrawArgs): ReactNode {
    return this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawRounded({ x, y, size, getNeighbor }: DrawArgs): ReactNode {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      return this._basicDot({ x, y, size, rotation: 0 });
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      return this._basicSquare({ x, y, size, rotation: 0 });
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      return this._basicCornerRounded({ x, y, size, rotation });
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      return this._basicSideRounded({ x, y, size, rotation });
    }

    return null;
  }

  _drawExtraRounded({ x, y, size, getNeighbor }: DrawArgs): ReactNode {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      return this._basicDot({ x, y, size, rotation: 0 });
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      return this._basicSquare({ x, y, size, rotation: 0 });
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      return this._basicCornerExtraRounded({ x, y, size, rotation });
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      return this._basicSideRounded({ x, y, size, rotation });
    }

    return null;
  }

  _drawClassy({ x, y, size, getNeighbor }: DrawArgs): ReactNode {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      return this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
    }

    if (!leftNeighbor && !topNeighbor) {
      return this._basicCornerRounded({ x, y, size, rotation: -Math.PI / 2 });
    }

    if (!rightNeighbor && !bottomNeighbor) {
      return this._basicCornerRounded({ x, y, size, rotation: Math.PI / 2 });
    }

    return this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawClassyRounded({ x, y, size, getNeighbor }: DrawArgs): ReactNode {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      return this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
    }

    if (!leftNeighbor && !topNeighbor) {
      return this._basicCornerExtraRounded({ x, y, size, rotation: -Math.PI / 2 });
    }

    if (!rightNeighbor && !bottomNeighbor) {
      return this._basicCornerExtraRounded({ x, y, size, rotation: Math.PI / 2 });
    }

    return this._basicSquare({ x, y, size, rotation: 0 });
  }
}
