export const getSnifferDomain = (subdomain: string) => {
  // @ts-ignore
  return `http://${subdomain}.${window._env_.VITE_PROXY_DOMAIN}`;
};
