const reservation = require("../../services/admin/reservation");

exports.getReservation = async (req, res) => {
  reservation.getReservation(req, res);
};

exports.addReservation = async (req, res) => {
  reservation.addReservation(req, res);
};

exports.updateReservation = async (req, res) => {
  reservation.updateReservation(req, res);
};

exports.deleteReservation = async (req, res) => {
  reservation.deleteReservation(req, res);
};
