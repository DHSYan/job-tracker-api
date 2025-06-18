const express = require("express");
const router = express.Router();
const jobService = require("../controllers/jobController.js");
const statusEnum = require("../enums/applicationStatus.js");

router.use(express.json());

router.get("/", (req, res) => {
  res.send("jobs!");
});


// router.post("/new/:company/:title/:status", (req, res) => {
//   const {company, title, status} = req.params;
//   if (statusEnum.isValidStatus(status)) {
//     jobService.createApplication(company, title, status);
//     res.status(200).send("Sucess");
//   } else {
//     res.status(403).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
//   }
// });
//
router.post("/new", (req, res) => {
  const { company, title, status } = req.body;

  console.log(company);
  console.log(title);
  console.log(status);

  if (statusEnum.isValidStatus(status)) {
    jobService.createApplication(company, title, status);
    res.status(200).send("Sucess");
  } else {
    res.status(403).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
  }
})

// router.get("/get/:company/:title/:status", (req, res) => {
//   const {company, title, status} = req.params;
//
//   if (!statusEnum.isValidStatus(status)) {
//     res.status(403).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
//   }
//
//   const searchResult = jobService.getApplication(company, title, status);
//   searchResult.then(result => {
//     res.status(200).json(result);
//   })
// });
//
// // TODO figure out how to do optional route parameters
// router.get("/get/:company/:title", (req, res) => {
//   const {company, title} = req.params;
//
//   const searchResult = jobService.getApplication(company, title);
//   searchResult.then(result => {
//     res.status(200).json(result);
//   })
// });

module.exports = router;



