export function createCounter<T>(data: T[], startIndex = 0) {
  let index = startIndex;
  return () => data[
    Math.max(
      startIndex,
      index++ % data.length,
    )
  ];

}
