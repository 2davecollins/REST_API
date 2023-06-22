/**
 * v2 of api
 */

const express = require('express');
const router = express.Router();
const stat500= {
  status:500,
  "msg":"ok"
}
/* GET quotes listing. */
router.get('/', function(req, res, next) {
  try {
    console.log(stat500);
    res.json(stat500);
  } catch(err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

module.exports = router;