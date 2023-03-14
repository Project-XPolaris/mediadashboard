
export const isDarkColor = (color?: string) => {
  if (!color) {
    return false;
  }
  const a = 1 - (0.299 * parseInt(color.substr(1, 2), 16) + 0.587 * parseInt(color.substr(3, 2), 16) + 0.114 * parseInt(color.substr(5, 2), 16)) / 255;
  return a > 0.5;
}
