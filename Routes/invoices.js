const express = require('express');
const router = express.Router();


router.get('/invoice', (req, res) =>{
    res.send('invoice called');
});

module.exports = router;