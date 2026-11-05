const sitemapSearch = document.querySelector("#sitemap-search");
const sitemapCategory = document.querySelector("#sitemap-category");
const sitemapResults = document.querySelector("#sitemap-results");
const sitemapEmpty = document.querySelector("#sitemap-empty");
const sitemapToggle = document.querySelector("#sitemap-toggle");
const sitemapGroups = [...document.querySelectorAll(".sitemap-group")];
const sitemapLinks = sitemapGroups.flatMap((group) =>
  [...group.querySelectorAll("[data-sitemap-link]")].map((item) => ({ group, item, link: item.querySelector("a") }))
);

function updateSitemap() {
  const query = sitemapSearch.value.trim().toLocaleLowerCase();
  const topic = sitemapCategory.value;
  const topicCounts = new Map(sitemapGroups.map((group) => [group, 0]));
  let visibleCount = 0;

  sitemapLinks.forEach(({ group, item, link }) => {
    const searchable = `${group.querySelector("summary").textContent} ${link.textContent} ${link.dataset.keywords}`.toLocaleLowerCase();
    const matches = (topic === "all" || group.dataset.topic === topic) && searchable.includes(query);
    item.hidden = !matches;
    if (matches) {
      visibleCount += 1;
      topicCounts.set(group, topicCounts.get(group) + 1);
    }
  });

  let visibleTopics = 0;
  sitemapGroups.forEach((group) => {
    const count = topicCounts.get(group);
    group.hidden = count === 0;
    group.querySelector(".sitemap-group-count").textContent = `${count} ${count === 1 ? "link" : "links"}`;
    if (count) {
      visibleTopics += 1;
      if (query || topic !== "all") group.open = true;
    }
  });

  sitemapResults.textContent = `${visibleCount} ${visibleCount === 1 ? "link" : "links"} · ${visibleTopics} ${visibleTopics === 1 ? "topic" : "topics"}`;
  sitemapEmpty.hidden = visibleCount > 0;
  sitemapToggle.textContent = sitemapGroups.every((group) => group.hidden || group.open)
    ? "Collapse all sections"
    : "Expand all sections";
}

sitemapSearch.addEventListener("input", updateSitemap);
sitemapCategory.addEventListener("change", updateSitemap);
sitemapToggle.addEventListener("click", () => {
  const expand = sitemapGroups.some((group) => !group.hidden && !group.open);
  sitemapGroups.forEach((group) => {
    if (!group.hidden) group.open = expand;
  });
  updateSitemap();
});
document.querySelector("#sitemap-print").addEventListener("click", () => window.print());
sitemapGroups.forEach((group) => group.addEventListener("toggle", updateSitemap));
updateSitemap();
