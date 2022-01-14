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
  barConfig: {
    stroke: styles.background
  },
  gridConfig: {
    stroke: styles.background,
    "stroke-dasharray": "2"
  },
  labelConfig: labelStyle,
  shapeConfig: {
    labelConfig: {...labelStyle, fontColor: styles.verydarkblue},
    stroke: styles.background
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
  colorScalePosition: "bottom",
  confidenceConfig: {
    fillOpacity: 0.4
  },
  groupPadding: 1,
  legendConfig: {
    shapeConfig: {
      labelConfig: {
        fontColor: styles.gris
      }
    }
  },
  legendTooltip: {
    tbody: []
  },
  legendPosition: "bottom",
  shapeConfig: {
    fill: colorLogic,
    labelConfig: labelStyle,
    Line: {
      stroke: colorLogic,
      strokeDasharray: d => d["Data ID"] === "Target" ? "10 5" : "none",
      strokeWidth: d => d["Data ID"] === "Indicator" ? 4 : 2
    },
    Path: {
      fillOpacity: 0.75,
      stroke: styles.darkblue
    }
  },
  tooltipConfig: {
    arrowStyle: {
      height: "15px",
      width: "15px"
    },
    background: "white",
    borderRadius: "6px",
    padding: "21px",
    tbodyStyle: {
      "color": styles.darkblue,
      "font-family": "Poppins",
      "font-style": "normal",
      "font-weight": "300",
      "font-size": "13px",
      "line-height": "19px",
      "text-align": "left"
    },
    titleStyle: {
      "color": styles.darkblue,
      "font-family": "'Oswald', sans-serif",
      "font-weight": "500",
      "font-size": "16px",
      "line-height": "24px",
      "text-transform": "uppercase"
    },
    tdStyle: {
      "padding": "6px"
    },
    trStyle: {
      "border-top": `1px solid ${styles.background}`
    }
  },
  topojsonFill: "#bbbbc2",
  xConfig: axisConfig,
  yConfig: axisConfig
};
