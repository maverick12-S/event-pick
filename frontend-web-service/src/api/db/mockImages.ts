const FOUR_BY_FIVE_HEIGHT_RATIO = 5 / 4;

export const toFourByFiveUnsplash = (url: string, width: number): string => {
  const [baseUrl] = url.split('?');
  const height = Math.round(width * FOUR_BY_FIVE_HEIGHT_RATIO);
  return `${baseUrl}?auto=format&fit=crop&crop=entropy&w=${width}&h=${height}&q=80`;
};