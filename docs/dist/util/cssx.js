function choose(set, selector) {
  return Array.from(function* () {
    for (const item of set) {
      const value = selector(item);
      if (value != null) {
        yield value;
      }
    }
  }());
}
export default function cssx(...css) {
  return choose(css, (item) => {
    if (item == null) {
      return null;
    } else if (typeof item === "string") {
      return item;
    } else if (typeof item === "boolean") {
      return null;
    } else {
      return Object.keys(item).filter((v) => item[v]).join(" ");
    }
  }).join(" ");
}
