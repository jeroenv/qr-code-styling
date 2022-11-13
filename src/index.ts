import dotTypes from "./constants/dotTypes";
import cornerDotTypes from "./constants/cornerDotTypes";
import cornerSquareTypes from "./constants/cornerSquareTypes";
import errorCorrectionLevels from "./constants/errorCorrectionLevels";
import errorCorrectionPercents from "./constants/errorCorrectionPercents";
import modes from "./constants/modes";
import qrTypes from "./constants/qrTypes";
import drawTypes from "./constants/drawTypes";
import QRSVG from "./core/QRSVG";

export * from "./types";

export {
  dotTypes,
  cornerDotTypes,
  cornerSquareTypes,
  errorCorrectionLevels,
  errorCorrectionPercents,
  modes,
  qrTypes,
  drawTypes
};

export default QRSVG;
