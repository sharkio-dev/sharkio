export const validateHttpUrlFormat = (string: string) => {
  const domainPattern = /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
  const localhostPattern = /^(http|https):\/\/localhost:\d+$/;

  return domainPattern.test(string) || localhostPattern.test(string);
};
