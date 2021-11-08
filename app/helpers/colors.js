import styles from "style.yml";

export default [
  {
    key: "Gender",
    colors: {
      1: styles.emerald, // Male
      2: styles.purple // Female
    }
  },
  {
    key: "Race",
    colors: {
      3: styles.midblue, // Asian
      4: styles.midblue, // Asian (non-Hispanic)

      5: styles.emerald, // Black
      6: styles.emerald, // African American (non-Hispanic)

      7: styles.red, // Hawaiian Native or Pacific Islander
      8: styles.red, // Hawaiian Native or Pacific Islander (non-Hispanic)

      9: styles.purple, // Hispanic

      10: styles.orange, // White
      11: styles.orange, // White (non-Hispanic)

      12: styles.gris, // Other
      13: styles.gris, // Other (non-Hispanic)
      14: styles.gris, // Multiracial
      99: styles.gris, // Unknown

      98: styles.green, // All

      1: styles.lightpurple, // American Indian or Alaskan Native
      2: styles.lightpurple, // Native American or Alaskan Native (non-Hispanic)
      15: styles.lightpurple // American Indian
    }
  },
  {
    key: "Cape Fear Member",
    colors: {
      0: "#7ba3c9",
      1: "#143f6a"
    }
  }
];
