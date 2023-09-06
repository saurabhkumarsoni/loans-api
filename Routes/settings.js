const express = require('express');
const router = express.Router();


router.get('/settings', (req, res) =>{
    res.send('setting called');
});

module.exports = router;