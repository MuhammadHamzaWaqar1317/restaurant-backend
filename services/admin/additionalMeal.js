const { additionalMeal } = require("../../models/additionalMeal");
const { guestModel } = require("../../models/guestModel");

const createAdditionalMeal = async (res, guestMails, additionalMealArray) => {
  try {
    let guestIDs = await guestModel.find({ email: { $in: guestMails } });
    console.log(guestIDs);
    guestIDs = guestIDs.reverse();
    const storeAdditionalMeal = additionalMealArray?.map(
      ({ mealTime, date }, index) => {
        return { mealTime, date, guestId: guestIDs[index]._id };
      }
    );

    const result = await additionalMeal.create(storeAdditionalMeal);
    console.log(result);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error });
  }
};

exports.postMealReq = async (req, res) => {
  const additionalMealArray = req.body;
  const guestMails = additionalMealArray?.map((item) => item.email);

  try {
    const savedGuests = await guestModel.find({ email: { $in: guestMails } });
    const savedGuestMails = savedGuests?.map((item) => item.email);

    if (savedGuests.length != additionalMealArray.length) {
      const missingGuests = additionalMealArray
        ?.map(({ email, name, level }) => {
          return { name, email, level };
        })
        ?.filter((item) => !savedGuestMails.includes(item.email));
      console.log("missing guests", missingGuests);
      await guestModel.create(missingGuests);
      createAdditionalMeal(res, guestMails, additionalMealArray);
    } else {
      createAdditionalMeal(res, guestMails, additionalMealArray);
    }

    res.status(200).send({ message: "Record created Successfully" });
  } catch (error) {
    console.log(error);
  }
};
