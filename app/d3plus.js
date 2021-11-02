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
    axisConfig,
    color: ["#E1F7CD", styles.lightgreen, styles.emerald, styles.darkblue]
  },
  shapeConfig: {
    labelConfig: labelStyle,
    Path: {
      fillOpacity: 0.75,
      stroke: styles.darkblue
    }
  },
  topojsonFill: "#bbbbc2",
  xConfig: axisConfig,
  yConfig: axisConfig
};
