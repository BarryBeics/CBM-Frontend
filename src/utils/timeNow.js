import { isProd, fixedDevTime } from "../config";

export const timeNow = () => {
  return isProd ? Math.floor(Date.now() / 1000) : fixedDevTime;
};
