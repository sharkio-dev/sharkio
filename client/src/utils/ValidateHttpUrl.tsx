export const validateHttpUrlFormat = (string: string) => {
  const urlPattern = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  return urlPattern.test(string);
};
