import express from "express";
const router = express.Router();
import { getApplication, listAllApplication, createApplication,
         idApplication, suggestion, idApplicationAndUpdate,
         idApplicationNoteAppend, 
         deleteApplication,
         deleteApplicationById}
from "../controllers/jobController.js";
import { isValidStatus }  from "../enums/applicationStatus.js";

router.use(express.json());

router.post("/", (req, res) => {
  const { company, title, status, notes } = req.body;

  if (isValidStatus(status)) {
    createApplication(company, title, status, notes);
    res.status(200).send("Sucess");
  } else {
    res.status(400).send("Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted");
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
  const { id } = req.params;
  const update = req.body;

  idApplicationAndUpdate(id, update)
    .then(_ => {
      res.status(200).json({ message: "success" })
    }).catch(e => {
      res.status(400).json({ error: e.message });
    })

});

router.put("/:id/new-note", (req, res) => {
  const { id } = req.params;
  const { note }  = req.body;

  idApplicationNoteAppend(id, note)
    .then(_ => {
      res.status(200).json({ message: "success" })
    }).catch(e => {
      res.status(400).json({ error: e.message });
    })
});

router.delete("/", (req, res) => {
  const { company, title } = req.body;

  // console.log(company);
  // console.log(title);

  if (deleteApplication(company, title) === 1) {
      res.status(200).json({ message: "success" })
  } else {
      res.status(400).json({ error: "Job Application does not exists" });
  }
})

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  let ret;
  deleteApplicationById(id).then(x => ret = x);

  if (ret) {
      res.status(400).json({ error: "Job Application does not exists" });
  } else {
    res.status(200).json({ message: "success" })
  }
})

export default router;
