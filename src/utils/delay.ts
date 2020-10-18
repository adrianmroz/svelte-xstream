export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function doAfter(ms: number, f: () => void) {
  delay(ms).then(f);
}
