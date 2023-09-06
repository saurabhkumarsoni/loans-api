const express = require('express');
const router = express.Router();


router.get('/users', (req, res) =>{
    res.send('users called');
});

module.exports = router;