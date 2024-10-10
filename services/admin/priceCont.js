const { mealPrice } = require("../../models/mealPrice");
const { PriceCont } = require("../../models/priceCont");

exports.getMealPrice = async (req, res) => {
  try {
    const result = await mealPrice.find({});
    console.log(result);
    return res.send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.updateMealPrice = async (req, res) => {
  const updateObj = req.body;

  console.log(updateObj);
  try {
    const update = await mealPrice.updateMany(
      {},
      { singleMealPrice: updateObj.singleMealPrice },
      { runValidators: true }
    );
    console.log(update);
  } catch (error) {
    console.log(error, "Singl e EMal prices");
  }
  res.status(200).send({ message: "Price updated successfully" });
};

exports.getContPercent = async (req, res) => {
  try {
    const Price = await PriceCont.find({});
    return res.send(Price);
  } catch (error) {
    res.send(res.status(404));
  }
};

exports.updateContPercent = async (req, res) => {
  try {
    const updateObj = req.body;

    const result = await PriceCont.updateOne(
      { _id: updateObj.contributionId },
      { $set: { ...updateObj } },
      { runValidators: true }
    );

    if (!result) {
      console.log("Error here");
      return res.status(404).send({ error: "Document not found" });
    }
    console.log(result);
    return res.status(200).send({ message: "Record updated successfully" });
  } catch (error) {
    console.log("error:::", error);
  }
};
