export const randomLetterFromString = (str: string): string => {
  const index = Math.floor(Math.random() * str.length);
  return str[index];
};

export const randomMinMax = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloatMinMax = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
}


export const randomFromArray = <T>(arr: T[]): T => {
  return arr[randomMinMax(0, arr.length - 1)];
}