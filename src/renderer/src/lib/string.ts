export const unicodeToChar = (text: string): string => {
  return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
    console.log(match);
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });
};
