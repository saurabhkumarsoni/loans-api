const express = require('express');
const router = express.Router();


router.get('/payments', (req, res) =>{
    res.send('payments called');
});

module.exports = router;




