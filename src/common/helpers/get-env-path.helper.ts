export const getEnvPath = (): string =>
  'deploy/envs/' +
  (process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.development');
