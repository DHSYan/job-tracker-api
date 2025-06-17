const express = require("express");
const router = express.Router();
const jobService = require("../controllers/jobController.js");
const statusEnum = require("../enums/applicationStatus.js");

router.get("/", (req, res) => {
  res.send("jobs!");
});


router.post("/new/:company/:title/:status", (req, res) => {
  const {company, title, status} = req.params;
  if (statusEnum.isValidStatus(status)) {
    jobService.createApplication(company, title, status);
    res.sendStatus(200).send("Sucess");
  } else {
    res.sendStatus(403).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
  }
});

router.get("/get/company/title/status", (req, res) => {
});

module.exports = router;



