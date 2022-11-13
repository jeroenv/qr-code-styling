import React, { FC, ReactNode } from "react";
import QRDot from "../figures/dot/svg/QRDot";
import QRCornerSquare from "../figures/cornerSquare/svg/QRCornerSquare";
import QRCornerDot from "../figures/cornerDot/svg/QRCornerDot";
import { RequiredOptions } from "./QROptions";
import gradientTypes from "../constants/gradientTypes";
import { FilterFunction, Gradient } from "../types";
import getMode from "../tools/getMode";
import qrcode from "qrcode-generator";

const squareMask = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
];

const dotMask = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

const QRSVG: FC<RequiredOptions> = (options) => {
  const {
    width,
    height,
    margin,
    backgroundOptions,
    qrOptions,
    data,
    dotsOptions,
    imageOptions,
    cornersSquareOptions,
    cornersDotOptions
  } = options;

  // TODO make hook
  const qr = qrcode(qrOptions.typeNumber, qrOptions.errorCorrectionLevel);
  qr.addData(data, qrOptions.mode || getMode(data));
  qr.make();

  const count = qr.getModuleCount();
  //const minSize = Math.min(width, height) - margin * 2;
  //const dotSize = Math.floor(minSize / count);
  const drawImageSize = {
    hideXDots: 0,
    hideYDots: 0,
    width: 0,
    height: 0
  };

  const defs = new Array<ReactNode>();
  const dots = new Array<ReactNode>();
  const elements = new Array<ReactNode>();

  const drawBackground = () => {
    const gradientOptions = backgroundOptions?.gradient;
    const color = backgroundOptions?.color;

    if (gradientOptions || color) {
      _createColor({
        options: gradientOptions,
        color: color,
        additionalRotation: 0,
        x: 0,
        y: 0,
        height: options.height,
        width: options.width,
        name: "background-color"
      });
    }
  };

  const drawDots = (filter?: FilterFunction) => {
    //if (count > options.width || count > options.height) {
    //  throw "The canvas is too small.";
    //}

    const minSize = Math.min(width, height) - margin * 2;
    const dotSize = Math.floor(minSize / count);
    const xBeginning = Math.floor((width - count * dotSize) / 2);
    const yBeginning = Math.floor((height - count * dotSize) / 2);
    const dot = new QRDot({ type: dotsOptions.type });

    _createColor({
      options: dotsOptions?.gradient,
      color: dotsOptions.color,
      additionalRotation: 0,
      x: xBeginning,
      y: yBeginning,
      height: count * dotSize,
      width: count * dotSize,
      name: "dot-color"
    });

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if (filter && !filter(i, j)) {
          continue;
        }
        if (!qr.isDark(i, j)) {
          continue;
        }

        dots.push(
          dot.draw(
            xBeginning + i * dotSize,
            yBeginning + j * dotSize,
            dotSize,
            (xOffset: number, yOffset: number): boolean => {
              if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count) return false;
              if (filter && !filter(i + xOffset, j + yOffset)) return false;
              return !!qr && qr.isDark(i + xOffset, j + yOffset);
            }
          )
        );
      }
    }
  };

  const drawCorners = () => {
    const minSize = Math.min(width, height) - margin * 2;
    const dotSize = Math.floor(minSize / count);
    const cornersSquareSize = dotSize * 7;
    const cornersDotSize = dotSize * 3;
    const xBeginning = Math.floor((width - count * dotSize) / 2);
    const yBeginning = Math.floor((height - count * dotSize) / 2);

    [
      [0, 0, 0],
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([column, row, rotation]) => {
      const x = xBeginning + column * dotSize * (count - 7);
      const y = yBeginning + row * dotSize * (count - 7);

      debugger;

      if (cornersSquareOptions?.gradient || cornersSquareOptions?.color) {
        _createColor({
          options: cornersSquareOptions?.gradient,
          color: cornersSquareOptions?.color,
          additionalRotation: rotation,
          x,
          y,
          height: cornersSquareSize,
          width: cornersSquareSize,
          name: `corners-square-color-${column}-${row}`
        });
      }

      const cornersSquareClipPath = new Array<ReactNode>();
      if (cornersSquareOptions?.type) {
        const cornersSquare = new QRCornerSquare({ type: cornersSquareOptions.type });
        cornersSquareClipPath.push(cornersSquare.draw(x, y, cornersSquareSize, rotation));
      } else {
        const dot = new QRDot({ type: dotsOptions.type });

        for (let i = 0; i < squareMask.length; i++) {
          for (let j = 0; j < squareMask[i].length; j++) {
            if (!squareMask[i]?.[j]) {
              continue;
            }

            cornersSquareClipPath.push(
              dot.draw(
                x + i * dotSize,
                y + j * dotSize,
                dotSize,
                (xOffset: number, yOffset: number): boolean => !!squareMask[i + xOffset]?.[j + yOffset]
              )
            );
          }
        }
      }

      if (cornersSquareClipPath.length) {
        console.log(cornersSquareClipPath);

        defs.push(<clipPath id={`clip-path-corners-square-color-${column}-${row}`}>{cornersSquareClipPath}</clipPath>);
      }

      const cornersDotClipPath = new Array<ReactNode>();
      if (cornersDotOptions?.gradient || cornersDotOptions?.color) {
        _createColor({
          options: cornersDotOptions?.gradient,
          color: cornersDotOptions?.color,
          additionalRotation: rotation,
          x: x + dotSize * 2,
          y: y + dotSize * 2,
          height: cornersDotSize,
          width: cornersDotSize,
          name: `corners-dot-color-${column}-${row}`
        });
      }

      if (cornersDotOptions?.type) {
        const cornersDot = new QRCornerDot({ type: cornersDotOptions.type });

        cornersDotClipPath.push(cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation));
      } else {
        const dot = new QRDot({ type: dotsOptions.type });

        for (let i = 0; i < dotMask.length; i++) {
          for (let j = 0; j < dotMask[i].length; j++) {
            if (!dotMask[i]?.[j]) {
              continue;
            }

            cornersDotClipPath.push(
              dot.draw(
                x + i * dotSize,
                y + j * dotSize,
                dotSize,
                (xOffset: number, yOffset: number): boolean => !!dotMask[i + xOffset]?.[j + yOffset]
              )
            );
          }
        }
      }

      console.log(cornersDotClipPath);

      if (cornersDotClipPath.length) {
        defs.push(<clipPath id={`clip-path-corners-dot-color-${column}-${row}`}>{cornersDotClipPath}</clipPath>);
      }
    });
  };

  /* const loadImage = () => {
    const image = new Image();

    //if (!options.image) {
    //return reject("Image is not defined");
    //}

    //if (typeof options.imageOptions.crossOrigin === "string") {
    //  image.crossOrigin = options.imageOptions.crossOrigin;
    //}

    //image.onload = (): void => {
    //resolve();
    //};
    if (options.image) {
      image.src = options.image;
    }
  }; */

  /* const drawImage = ({
    width,
    height,
    count,
    dotSize
  }: {
    width: number;
    height: number;
    count: number;
    dotSize: number;
  }): void => {
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);
    const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
    const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
    const dw = width - options.imageOptions.margin * 2;
    const dh = height - options.imageOptions.margin * 2;

    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", options.image || "");
    image.setAttribute("x", String(dx));
    image.setAttribute("y", String(dy));
    image.setAttribute("width", `${dw}px`);
    image.setAttribute("height", `${dh}px`);

    //this._element.appendChild(image);
  }; */

  const _createColor = ({
    options,
    color,
    additionalRotation,
    x,
    y,
    height,
    width,
    name
  }: {
    options?: Gradient;
    color?: string;
    additionalRotation: number;
    x: number;
    y: number;
    height: number;
    width: number;
    name: string;
  }) => {
    const size = width > height ? width : height;

    let gradient: ReactNode;
    if (options) {
      const getColorStops = (): ReactNode[] =>
        options.colorStops.map(({ offset, color }: { offset: number; color: string }) => (
          <stop offset={`${100 * offset}%`} stopColor={color} />
        ));

      if (options.type === gradientTypes.radial) {
        gradient = (
          <radialGradient
            id={name}
            gradientUnits="userSpaceOnUse"
            fx={x + width / 2}
            fy={y + height / 2}
            cx={x + width / 2}
            cy={y + height / 2}
            r={size / 2}
          >
            {getColorStops()}
          </radialGradient>
        );
      } else {
        const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
        const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
        let x0 = x + width / 2;
        let y0 = y + height / 2;
        let x1 = x + width / 2;
        let y1 = y + height / 2;

        if (
          (positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
          (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)
        ) {
          x0 = x0 - width / 2;
          y0 = y0 - (height / 2) * Math.tan(rotation);
          x1 = x1 + width / 2;
          y1 = y1 + (height / 2) * Math.tan(rotation);
        } else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
          y0 = y0 - height / 2;
          x0 = x0 - width / 2 / Math.tan(rotation);
          y1 = y1 + height / 2;
          x1 = x1 + width / 2 / Math.tan(rotation);
        } else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
          x0 = x0 + width / 2;
          y0 = y0 + (height / 2) * Math.tan(rotation);
          x1 = x1 - width / 2;
          y1 = y1 - (height / 2) * Math.tan(rotation);
        } else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
          y0 = y0 + height / 2;
          x0 = x0 + width / 2 / Math.tan(rotation);
          y1 = y1 - height / 2;
          x1 = x1 - width / 2 / Math.tan(rotation);
        }
        gradient = (
          <linearGradient id={name} gradientUnits="userSpaceOnUse" x1={x0} y1={y0} x2={x1} y2={y1}>
            {getColorStops()}
          </linearGradient>
        );
      }
      defs.push(gradient);
    }

    elements.push(
      <rect
        x={x}
        y={y}
        height={height}
        width={width}
        clipPath={`url('#clip-path-${name}')`}
        fill={gradient ? `url('#${name}')` : color}
      />
    );
  };

  drawBackground();

  /*if (image) {
    //We need it to get image size
    this.loadImage();
    if (!this._image) return false;
    const { imageOptions, qrOptions } = this._options;
    const coverLevel = imageOptions.imageSize * errorCorrectionPercents[qrOptions.errorCorrectionLevel];
    const maxHiddenDots = Math.floor(coverLevel * count * count);

    drawImageSize = calculateImageSize({
      originalWidth: this._image.width,
      originalHeight: this._image.height,
      maxHiddenDots,
      maxHiddenAxisDots: count - 14,
      dotSize
    });
  }*/

  drawDots((i: number, j: number): boolean => {
    if (imageOptions.hideBackgroundDots) {
      if (
        i >= (count - drawImageSize.hideXDots) / 2 &&
        i < (count + drawImageSize.hideXDots) / 2 &&
        j >= (count - drawImageSize.hideYDots) / 2 &&
        j < (count + drawImageSize.hideYDots) / 2
      ) {
        return false;
      }
    }

    if (squareMask[i]?.[j] || squareMask[i - count + 7]?.[j] || squareMask[i]?.[j - count + 7]) {
      return false;
    }

    if (dotMask[i]?.[j] || dotMask[i - count + 7]?.[j] || dotMask[i]?.[j - count + 7]) {
      return false;
    }

    return true;
  });

  drawCorners();

  //if (this._options.image) {
  //  this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
  //}

  console.log(defs);

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      {elements}
      <defs>
        {defs.map((def) => def)}
        <clipPath id="clip-path-dot-color">{dots}</clipPath>
      </defs>
    </svg>
  );
};

export default QRSVG;
