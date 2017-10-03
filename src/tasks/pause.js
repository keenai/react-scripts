// @flow
const wait: (interval: number) => Promise<void> = (interval) => (
  new Promise(() => {
    setTimeout(
      () => wait(interval),
      interval,
    );
  })
);

export default async function (): Promise<void> {
  await wait(60 * 1000);
}
