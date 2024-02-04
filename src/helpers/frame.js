const setting = {
  wastagePerLengthInInches: 3,
  glassRatePerSqFeet: 50,
  cardboardRatePerSqFeet: 25,
  mountRatePerSqFeet: 30,
  margin: 2.25,
  mountWidth: 1.5,
};

const convertMillisToInches = (value) => {
  return value / 25.4;
};

export const ceilToNearest = (value, nearest = 3) => {
  return Math.ceil(value / nearest) * nearest;
};

export const calulatePrice = ({
  lengthInInches,
  breadthInInches,
  frameRatePerFeet,
  frameWidthInMillis,
  hasMount,
  hasGlass,
  hasCardboard,
}) => {
  const increaseInLength = hasMount ? 2 * setting.mountWidth : 0;
  const length = ceilToNearest(lengthInInches) + increaseInLength;
  const breadth = ceilToNearest(breadthInInches) + increaseInLength;
  const perimeterInInches =
    2 * (length + breadth) +
    4 * setting.wastagePerLengthInInches +
    4 * convertMillisToInches(frameWidthInMillis);
  const perimeterInFeet = perimeterInInches / 12;
  const areaInSqFeet = (length * breadth) / 144;
  const effectiveMargin = setting.margin > 1 ? setting.margin : 2.5;
  const glassRate = hasGlass ? setting.glassRatePerSqFeet : 0;
  const mountRate = hasMount ? setting.mountRatePerSqFeet : 0;
  const cardboardRate = hasCardboard ? setting.cardboardRatePerSqFeet : 0;
  const totalCost =
    perimeterInFeet * frameRatePerFeet +
    areaInSqFeet * (glassRate + cardboardRate + mountRate);

  return totalCost * effectiveMargin;
};
