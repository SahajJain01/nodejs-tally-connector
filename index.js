var http = require('http');
const xml2js = require('xml2js');

async function postToTally(postString, tallyIp, tallyPort) {
    var postOptions = {
        host: tallyIp,
        port: tallyPort,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
            'Content-Length': Buffer.byteLength(postString)
        }
    };
    return new Promise(function (resolve, reject) {
        try {
            var postReq = http.request(postOptions, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    xml2js.parseString(data, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        console.log(result);
                        resolve(result);
                    });
                });
                res.on('error', function (data) {
                    reject(data);
                });
            });
            postReq.write(postString);
            postReq.end();
        }
        catch (ex) {
            console.log('Error: ' + ex);
        }
    });
}

exports.createLedger = async function (data) {
    console.log("Creating Ledger");
    /* #region  postString */
    postString =
        '<ENVELOPE>' +
        '<HEADER>' +
        '<TALLYREQUEST>Import Data</TALLYREQUEST>' +
        '</HEADER>' +
        '<BODY>' +
        '<IMPORTDATA>' +
        '<REQUESTDESC>' +
        '<REPORTNAME>Vouchers</REPORTNAME>' +
        '</REQUESTDESC>' +
        '<REQUESTDATA>' +
        '<TALLYMESSAGE>' +
        '<LEDGER>' +
        '<PARENT>' +
        data.parent +
        '</PARENT>' +
        '<OPENINGBALANCE>' +
        data.opBalance +
        '</OPENINGBALANCE>' +
        '<GSTREGISTRATIONTYPE>' +
        data.gstRegType +
        '</GSTREGISTRATIONTYPE>' +
        '<PARTYGSTIN>' +
        data.gstin +
        '</PARTYGSTIN>' +
        '<MAILINGNAME.LIST TYPE="String">' +
        '<MAILINGNAME>' +
        data.mailing.name +
        '</MAILINGNAME>' +
        '</MAILINGNAME.LIST>' +
        '<ADDRESS.LIST TYPE="String">' +
        '<ADDRESS>' +
        data.mailing.address1 +
        '</ADDRESS>' +
        '<ADDRESS>' +
        data.mailing.address2 +
        '</ADDRESS>' +
        '</ADDRESS.LIST>' +
        '<STATENAME>' +
        data.mailing.state +
        '</STATENAME>' +
        '<COUNTRYNAME>' +
        data.mailing.country +
        '</COUNTRYNAME>' +
        '<PINCODE>' +
        data.mailing.pincode +
        '</PINCODE>' +
        '<LEDGERMOBILE>' +
        data.mailing.mobile +
        '</LEDGERMOBILE>' +
        '<LANGUAGENAME.LIST>' +
        '<NAME.LIST TYPE="String">' +
        '<NAME>' +
        data.ledgerName +
        '</NAME>' +
        '</NAME.LIST>' +
        '</LANGUAGENAME.LIST>' +
        '</LEDGER>' +
        '</TALLYMESSAGE>' +
        '</REQUESTDATA>' +
        '</IMPORTDATA>' +
        '</BODY>' +
        '</ENVELOPE>';
    /* #endregion */
    return new Promise(function (resolve, reject) {
        postToTally(postString, data.tallyIp, data.tallyPort).then(res => {
            console.log(res);
            resolve(res);
        });
    });
}