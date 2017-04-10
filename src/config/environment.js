// @flow
export default (publicUrl: string) => (
  Object
    .keys(process.env)
    .reduce(
      (accumulator, key) => ({
        ...accumulator,
        [key]: JSON.stringify(process.env[key]),
      }),
      {
        NODE_ENV: JSON.stringify(
          process.env.NODE_ENV || 'development',
        ),
        PUBLIC_URL: JSON.stringify(publicUrl),
      },
    )
);
