const testRouter = require('express').Router();
const {uploadExcel} = require('../middleware/mutler');
const fs = require('fs');
testRouter.post('/', uploadExcel.single('file'), (req, res, next) => {
    try {
        console.log(req.file);
        const url = "/statics/excels/" + req.file.filename;
        res.json({url});
    } catch (error) {
        fs.unlinkSync(url);
        next(error);
        res.status(400).json({message: error.message})
    }
});


module.exports = testRouter;