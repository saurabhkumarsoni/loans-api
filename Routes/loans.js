const express = require('express');
const router = express.Router();


router.get('/loan', (req, res) =>{
    res.send('loan called');
});

module.exports = router;