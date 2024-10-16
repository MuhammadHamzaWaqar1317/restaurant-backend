const { Branch } = require("../../models/branch");
const { io } = require("../../socket");
const { v4: uuidv4 } = require("uuid");

exports.getBranch = async (req, res) => {
  try {
    const result = await Branch.find({});

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.addBranch = async (req, res) => {
  try {
    const { address, contactNum, tables } = req.body;
    tables?.forEach((table) => {
      table.id = uuidv4();
    });
    console.log(tables);

    const result = await Branch.create({
      address,
      contactNum,
      tables,
    });
    io.emit("branch_added", result);

    res.status(200).send({ message: "Branch added Successfully", result });
  } catch (error) {
    console.log(error);
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const { address, contactNum, tables, _id } = req.body;
    tables?.forEach((table) => {
      if (!table.id) {
        table.id = uuidv4();
      }
    });
    console.log(tables);

    const result = await Branch.updateOne(
      { _id },
      {
        address,
        contactNum,
        tables,
      }
    );
    io.emit("branch_updated", { address, contactNum, tables, _id });

    res.status(200).send({ message: "Branch updated Successfully", result });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const { _id } = req.query;

    const result = await Branch.deleteOne({ _id });
    io.emit("branch_deleted", { _id });

    res.status(200).send({ message: "Branch deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
