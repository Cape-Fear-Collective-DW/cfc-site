const stripP = require("@datawheel/canon-cms/src/utils/formatters/stripP");

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
 function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const regions = [
  "Cape Fear",
  "Charlotte",
  "Eastern",
  "Mountains",
  "Northeast",
  "Sandhills",
  "Triad",
  "Triangle"
].map((d, i) => ({
  id: i ? false : "cf",
  hierarchy: "Region",
  slug: d.replace(/\s/g, "-").toLowerCase(),
  name: d
}));

module.exports = function(app) {

  const {db} = app.settings;

  app.get("/tiles", async(req, res) => {

    const {id} = req.query;

    const showCounties = id !== "<id>";

    const profiles = showCounties ? await db.search
      .findAll({
        include: [{association: "content"}],
        where: {hierarchy: "County"}
      })
      .then(rows => rows.map(d => ({
        id: d.id,
        hierarchy: d.hierarchy,
        slug: d.slug,
        name: d.content.find(c => c.locale === "en").name
      }))) : regions;

    const sections = await db.section
      .findAll({
        include: [{association: "content"}]
      })
      .then(rows => rows.map(d => ({
        icon: d.icon,
        ordering: d.ordering,
        type: d.type,
        slug: d.slug,
        title: d.content.find(c => c.locale === "en").title
      })).sort((a, b) => a.ordering - b.ordering));

    const tabs = [
      {
        icon: "map-marker",
        title: "Overview",
        tiles: profiles.map(d => ({
          image: `/api/image?slug=geo&id=${d.id}&size=thumb`,
          subtitle: d.hierarchy,
          title: d.name.replace(" County", ""),
          url: d.id ? `/profile/geo/${d.slug}` : false
        }))
      }
    ];

    for (let i = 0; i < sections.length; i++) {
      const group = sections[i];
      if (group.type === "Grouping") {

        const nextGroup = sections.slice(i + 1).findIndex(d => d.type === "Grouping");
        const topics = sections
          .slice(i + 1, nextGroup > 0 ? i + 1 + nextGroup : undefined)
          .filter(d => d.type !== "SubGrouping");

        if (topics.length) {
          tabs.push({
            icon: group.icon,
            title: stripP(group.title),
            tiles: (showCounties ? shuffle(profiles.slice()) : profiles.slice()).map(d => {
              const topic = shuffle(topics)[0];
              return {
                image: `/api/image?slug=geo&id=${d.id}&size=thumb`,
                subtitle: `${d.name.replace(" County", "")} ${d.hierarchy}`,
                title: stripP(topic.title),
                url: d.id ? `/profile/geo/${d.slug}#${topic.slug}` : false
              };
            })
          });
        }
      }
    }

    res.json(tabs);

  });

};
