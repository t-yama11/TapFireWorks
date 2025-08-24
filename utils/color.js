// RGBオブジェクト { r, g, b } をCSS用文字列に変換するユーティリティ
export function toRgbString(color) {
  const { r, g, b } = color;
  return `rgb(${r}, ${g}, ${b})`;
}