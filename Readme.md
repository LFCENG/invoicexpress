
# invoicexpress    

An API client in Node.JS for talking to invoicexpress.com. This package implements the complete API for talking with the invoicexpress.com API 

There complete docs can be found here - https://invoicexpress.com/api/overview

## Installation

To install the latest stable release with the command-line tool:
```sh
npm install --save invoicexpress
```

## Usage

See [docs](http://lfceng.github.io/invoicexpress/) for complete API documentation and the [invoicexpress API documentation](https://invoicexpress.com/api/overview).

```javascript
// installs pinvoicexpress package
var InvoiceXpress = require('invoicexpress');

// authenticate invoicexpress
var invoicexpress = new InvoiceXpress("your_API_key");

// set account by providing the account name. If it is not called we assign to the first account found in invoicexpress
invoicexpress.setAccount('my_account_name');

// Note: you can also require and create an instance in the same step if you would like.
// Example:
// var invoicexpress = require('invoicexpress').create("your_API_key");

// To fectch all invoices
// Every method supports promises or callbacks.
// by default only fecthes 10 invoices
invoicexpress.listAllInvoices(function(err, data) {
    // console.log(data);
});

// To fecth more invoices use
// In the example fetches 30 invoices
invoicexpress.listAllInvoices({per_page: 30}, function(err, data) {
    // console.log(data);
});

// To get invoices using a query use
// specify what you want to get in the query 
// use invoice-id to get a specific invoice
var query = {'invoice-id': '444'};
//or
var query = {'date[from]': '01/05/2016', 'date[to]': '30/05/2016'};
invoicexpress.getInvoice(query, function (err, data) {
   // console.log(data);
});

List of supported methods:
```javascript
* invoicexpress.setAccount
* invoicexpress.listAllInvoices
* invoicexpress.getInvoice
```

See [docs](http://lfceng.github.io/invoicexpress/) for complete API documentation and the [invoicexpress API documentation](https://invoicexpress.com/api/overview). See tests for more examples.

__Note__: Every method returns a promise but accepts callbacks too.

## License

(The MIT License)

Copyright (c) 2016 Luis Correia &lt;luiscorreia.ist@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.