const wordCache = new Map<string, number>();

export const measureWordWidth = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
}: {
  text: string;
  fontFamily: string;
  fontWeight: number | string;
  fontSize: number;
}) => {
  if (wordCache.has(text)) {
    return wordCache.get(text) as number;
  }

  const node = document.createElement("span");

  node.style.fontFamily = fontFamily;
  node.style.display = "inline";
  node.style.position = "absolute";
  node.style.top = `-10000px`;
  node.style.whiteSpace = "pre";
  node.style.fontWeight = fontWeight.toString();
  node.style.fontSize = `${fontSize}px`;
  node.innerText = text;

  document.body.appendChild(node);

  const boundingBox = node.getBoundingClientRect();

  document.body.removeChild(node);
  const result = boundingBox.width;
  wordCache.set(text, result);
  return result;
};
