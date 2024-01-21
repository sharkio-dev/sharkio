export const getSnifferDomain = (subdomain: string) => {
  return `${import.meta.env.VITE_PROXY_DOMAIN_PROTOCOL}://${subdomain}.${
    import.meta.env.VITE_PROXY_DOMAIN
  }`;
};
