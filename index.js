const express = require("express");
const app = express();
const QRCode = require("qrcode");
const generatePayload = require("promptpay-qr");
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
    console.log("Server started on port 3000");
});

app.post('/generate-qr', (req, res) => {
    const amount = parseFloat(_.get(req, ["body", "amount"]));
    const mobileNumber = '0948104265';
    const payload = generatePayload(mobileNumber, { amount });
    const option = {
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    }
    QRCode.toDataURL(payload, option, (err, url) => {
        if (err) {
            console.log('generate failed')
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'generate failed' + err
            });
        } else {
            console.log('generate success');
            return res.status(200).json({
                RespCode: 200,
                RespMessage: 'generate success',
                result: url
            });
        }
    });

});

module.exports = app;