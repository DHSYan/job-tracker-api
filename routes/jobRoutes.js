import express from "express";
const router = express.Router();
import { getApplication, listAllApplication, createApplication,
         idApplication, suggestion, idApplicationAndUpdate }
from "../controllers/jobController.js";
import { isValidStatus }  from "../enums/applicationStatus.js";

router.use(express.json());

router.post("/", (req, res) => {
  const { company, title, status } = req.body;

  if (isValidStatus(status)) {
    createApplication(company, title, status);
    res.status(200).send("Sucess");
  } else {
    res.status(403).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
  }
})

router.get("/", (req, res) => {
  const { company, title, status } = req.query;

  console.log(company);
  console.log(title);
  console.log(status);

  const searchResult = getApplication(company, title, status);
  searchResult.then(result => {
    res.status(200).json(result);
  })
})

router.get("/:id", (req, res) => {
  const { id } = req.params;
  idApplication(id).then(result => {
    res.status(200).json(result);
  }).catch(_ => {
    res.status(404).json({ error: "no such application was found"});
  })
})

router.get("/list-all", (_, res) => {
  const result = listAllApplication();
  result.then(result => {
    res.status(200).json(result);
  })
})

router.get("/:id/suggestion", (_, res) => {
  res.status(200).json({ message: suggestion() });
})

router.put("/:id", (req, res) => {
  res.status(403).json({ messeage: "TODO" });
});

export default router;
