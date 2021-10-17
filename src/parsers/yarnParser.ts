import { yarnV1Parser } from ".";

const getYarnVersion = (): number => {
  // @FIX add actual parser check for yarn version, casted to a number
  return 1;
};

const yarnParser = (data: string) => {
  const ver = getYarnVersion();

  if (ver === 1) {
    const parsed = yarnV1Parser(data);
    return parsed;
  } else if (ver === 2) {
    // @FIX Yarn 2 support needs to be added
    throw new Error(`Yarn v${String(ver)} is not yet implemented.`);
  } else {
    throw new Error(`Yarn v${String(ver)} is not yet implemented.`);
  }
};

export { getYarnVersion };
export default yarnParser;
