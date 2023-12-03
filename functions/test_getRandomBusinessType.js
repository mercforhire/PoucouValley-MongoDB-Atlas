exports = async function() {
  const businessTypesResult = await context.functions.execute("api_getBusinessTypes");
  const businessTypes = businessTypesResult.data;
  const randomType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  return randomType.type;
};