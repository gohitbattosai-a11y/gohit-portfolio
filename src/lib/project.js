const DATE = /\s*\((\d{2})\/(\d{2})\/(\d{4})\)\s*$/;

const formatDate = (d, m, y) =>
  new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const splitTitle = (title) => {
  const m = title.match(DATE);
  if (!m) return { name: title, date: "" };
  return { name: title.replace(DATE, ""), date: formatDate(m[1], m[2], m[3]) };
};

const youtubeThumb = (url) => {
  const m = (url || "").match(/embed\/([\w-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : "";
};

export const thumbOf = (p) => p.thumbnail || youtubeThumb(p.videoUrl);
