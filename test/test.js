var assert = require('assert');
var it = require('it');

var describe = it.describe;

// Please change apiKey
//var API_KEY = 'YOUR_API_KEY';
//var ACCOUNT_NAME = 'YOUR_ACCOUNT_NAME';
var API_KEY = '6cdd8bfc2f356c224bf4e4954dc01ad09c686255';
var ACCOUNT_NAME = 'luscamilocorreiau';


var invoicexpress = require('../index.js').create(API_KEY);
//invoicexpress.setAccount(ACCOUNT_NAME);
setTimeout(function () {
    describe('InvoiceXpress', function(it){
        describe('#listAllInvoices()', function(it){
            describe('should get all invoices', function(done){
                invoicexpress.listAllInvoices(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log('Reponse: invoicexpress.listAllInvoices');
                    //console.log(res.invoices.invoice[0]);
                    done();
                });
            });
        });
        describe('#getInvoice()', function (it) {
            describe('should get invoice', function (done) {
                invoicexpress.getInvoice({per_page: 60 },  function (err, res) {
                    if (err) {
                        throw err;
                    } 
                    console.log('Response: invoicexpress.getInvoice');
                    if (res) {
                        console.log(res.length);
                    } else {
                        console.log('empty');
                    }
                    done();
                });
            });
        });
    });
}, 1000);
