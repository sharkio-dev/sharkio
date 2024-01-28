export const getSnifferDomain = (subdomain: string) => {
  // @ts-ignore
  return `https://${subdomain}.${window._env_.VITE_PROXY_DOMAIN}`;
};
