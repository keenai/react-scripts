// @flow
export default (publicUrl: string, initial: {[string]: mixed} = {}) => (
  Object
    .keys(process.env)
    .filter((key) => initial.__SERVER__ || key.startsWith('KEENAI_'))
    .reduce(
      (accumulator, key) => ({
        ...accumulator,
        [key]: JSON.stringify(process.env[key]),
      }),
      {
        ...initial,
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        PUBLIC_URL: JSON.stringify(publicUrl),
      },
    )
);
