const getYarnVersion = (): number => {
  // @FIX add actual parser check for yarn version, casted to a number
  return 1;
};

const yarnParser = (data: string) => {
  const ver = getYarnVersion();

  if (ver === 1) {
  } else if (ver === 2) {
  } else {
    throw new Error(`Yarn v${String(ver)} is not yet implemented.`);
  }
};

export { getYarnVersion };
export default yarnParser;
