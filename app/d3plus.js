import styles from "style.yml";

import {colorDefaults} from "d3plus-color";
colorDefaults.dark = styles.gris;

const labelStyle = {
  fontFamily: () => "'Oswald', sans-serif",
  fontSize: () => 13,
  fontWeight: () => 300
};

const axisConfig = {
  labelConfig: labelStyle,
  shapeConfig: {
    labelConfig: labelStyle
  },
  titleConfig: {
    fontFamily: () => "'Oswald', sans-serif",
    fontSize: () => 15,
    fontWeight: () => 300
  }
};

export default {
  colorScaleConfig: {
    axisConfig
  },
  shapeConfig: {
    labelConfig: labelStyle
  },
  xConfig: axisConfig,
  yConfig: axisConfig
};
