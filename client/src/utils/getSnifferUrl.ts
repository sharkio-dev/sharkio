export const getSnifferDomain = (subdomain: string) => {
  return `https://${subdomain}.${import.meta.env.VITE_PROXY_DOMAIN}`;
};
