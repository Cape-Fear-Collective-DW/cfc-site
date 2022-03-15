import styles from "style.yml";

const magenta = "#e22ac5";
const other = "#93BD66";
const two = "#fcc201";
const islander = "#a23e60";
const asian = "#D5D83E";
const native = "#d8abe8";
const unknown = "#D6DCE5";

export default [
  {
    key: "County",
    colors: {
      Projection: "#a54bc5",
      Indicator: styles.purple,
      Target: styles.darkblue
    }
  },
  {
    key: "Tract",
    colors: {
      Projection: "#a54bc5",
      Indicator: styles.purple,
      Target: styles.darkblue
    }
  },
  {
    key: "Data",
    colors: {
      Projection: "#a54bc5",
      Indicator: styles.purple,
      Target: styles.darkblue
    }
  },
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
      3: asian, // Asian
      4: styles.midblue, // Asian (non-Hispanic)

      5: styles.emerald, // Black
      6: styles.darkemerald, // African American (non-Hispanic)

      7: islander, // Hawaiian Native or Pacific Islander
      8: styles.red, // Hawaiian Native or Pacific Islander (non-Hispanic)

      9: styles.purple, // Hispanic

      10: styles.orange, // White
      11: magenta, // White (non-Hispanic)

      12: other, // Other
      13: other, // Other (non-Hispanic)
      99: unknown, // Unknown

      14: two, // Multiracial/2+ Races

      98: styles.green, // All

      1: native, // American Indian or Alaskan Native
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
