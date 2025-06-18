import express from "express";
const router = express.Router();
import { getApplication, listAllApplication, createApplication } from "../controllers/jobController.js";
import { isValidStatus }  from "../enums/applicationStatus.js";

router.use(express.json());

router.get("/", (_, res) => {
  res.send("jobs!");
});

router.post("/new", (req, res) => {
  const { company, title, status } = req.body;

  if (isValidStatus(status)) {
    createApplication(company, title, status);
    res.status(200).send("Sucess");
  } else {
    res.status(403).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
  }
})

router.get("/find", (req, res) => {
  const { company, title, status } = req.query;

  console.log(company);
  console.log(title);
  console.log(status);

  const searchResult = getApplication(company, title, status);
  searchResult.then(result => {
    res.status(200).json(result);
  })
})

router.get("/list-all", (_, res) => {
  const result = listAllApplication();
  result.then(result => {
    res.status(200).json(result);
  })
})

export default router;
