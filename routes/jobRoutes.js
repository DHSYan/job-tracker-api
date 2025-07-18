import express from "express";
const router = express.Router();
import { getApplication, createApplication,
         idApplication, suggestion, idApplicationAndUpdate,
         idApplicationNoteAppend, 
         deleteApplication,
         deleteApplicationById}
from "../controllers/jobController.js";
import { isValidStatus }  from "../enums/applicationStatus.js";

router.use(express.json());

router.post("/", (req, res) => {
  const { company, title, status, notes } = req.body;

  if (company === undefined || title == undefined) {
    res.status(400).json({ error: "Company and Title are required fields" });
  } else if (isValidStatus(status)) {
    createApplication(company, title, status, notes);
    res.status(200).json({ message: "Sucess" });
  } else {
    res.status(400).json({ error: "Status not accepted, needs to be either saved, applied, interview, offered, rejected, accepted" });
  }
})

router.get("/", (req, res) => {
  const { company, title, status } = req.query;

  // console.log(company);
  // console.log(title);
  // console.log(status);

  const searchResult = getApplication(company, title, status);
  searchResult.then(result => {
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  idApplication(id).then(result => {
    res.status(200).json(result);
  }).catch(_ => {
    res.status(400).json({ error: `no such application with '${id}' was found` });
  });
});

router.get("/:id/suggestion", (_, res) => {
  res.status(200).json({ message: suggestion() });
});

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

router.delete("/", async (req, res) => {
  const { company, title } = req.body;

  // console.log(company);
  // console.log(title);

 try {
    const result = await deleteApplication(company, title);
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "success" });
    } else {
      throw new Error();
    }
  } catch (_) {
    res.status(400).json({ error: "Job Application does not exist" });
  }

});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  deleteApplicationById(id);

  res.status(200).json({ message: "success" })
});

export default router;
