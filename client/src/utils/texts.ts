export const toLowerCaseNoSpaces = (str: string) => {
  return str.toLowerCase().replace(/\s/g, "-");
};
