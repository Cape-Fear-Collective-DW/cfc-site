import styles from "style.yml";
import colorLookup from "$app/helpers/colors";

import {colorDefaults} from "d3plus-color";
colorDefaults.dark = styles.gris;

// function to lookup & assign color depending on present dimension keys
function colorLogic(d) {

  // lookup grouping color schemes in helpers/colors.js
  for (let i = 0; i < colorLookup.length; i++) {
    const {colors, key} = colorLookup[i];
    const value = `${key} ID` in d ? d[`${key} ID`] : d[key];
    if (value !== undefined && colors[value]) return colors[value];
  }

  return styles.darkblue;

}

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
  groupPadding: 1,
  shapeConfig: {
    fill: colorLogic,
    labelConfig: labelStyle,
    Line: {
      stroke: colorLogic
    },
    Path: {
      fillOpacity: 0.75,
      stroke: styles.darkblue
    }
  },
  topojsonFill: "#bbbbc2",
  xConfig: axisConfig,
  yConfig: axisConfig
};
