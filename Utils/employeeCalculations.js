const { PriceCont } = require("../models/priceCont");
const { mealPrice } = require("../models/mealPrice");

const employeeCalculations = async (resultUser) => {
  const sigleMealPrice = await mealPrice.find({});

  const { singleMealPrice } = sigleMealPrice[0];

  const resPriceCont = await PriceCont.find(
    {},
    { companyContPercent: 1, empContPercent: 1, level: 1, _id: 0 }
  );
  console.log(resPriceCont);

  const resultSingleMeal = resPriceCont.reduce((acc, item) => {
    acc[item.level] = {
      companyContPercent: item.companyContPercent,
      empContPercent: item.empContPercent,
      companyContDollar: item.companyContPercent * singleMealPrice,
      empContDollar: item.empContPercent * singleMealPrice,
    };
    return acc;
  }, {});

  const resultDoubleMeal = resPriceCont.reduce((acc, item) => {
    acc[item.level] = {
      companyContPercent: item.companyContPercent,
      empContPercent: item.empContPercent,
      companyContDollar: 2 * (item.companyContPercent * singleMealPrice),
      empContDollar: 2 * (item.empContPercent * singleMealPrice),
    };
    return acc;
  }, {});

  const employeeContributions = resultUser.map((item) => {
    if (item.mealTime.length == 2) {
      updatedItem = { ...item, ...resultDoubleMeal[item.level] };
      return updatedItem;
    }
    updatedItem = { ...item, ...resultSingleMeal[item.level] };
    return updatedItem;
  });

  return employeeContributions;
};

module.exports = { employeeCalculations };
