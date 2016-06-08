/**
 * Module dependencies.
 */
var request = require('request'),
qs = require('qs'),
_ = require('lodash'),
debug = require('debug')('invoicexpress'),
// Represents errors thrown by invoicexpress, see [InvoiceXpressError.js](./InvoiceXpressError.js.html)
InvoiceXpressError = require('./InvoiceXpressError'),
url = require('url'),
Q = require('q');

var xmlToJson = require('xml2json');


// Define some sane default options
var defaultOptions = {
    endpoint: 'https://www.app.invoicexpress.com/'
};

/**
 * `InvoiceXpress` constructor.
 *
 * @param {String} apiKey - your api key
 * @param {Object} options - an options object
 * @api public
 */
function InvoiceXpress(apiKey, options) {
    // Overload the contractor
    // Parse out single option objects
    if (_.isObject(apiKey) && !_.isString(apiKey) && apiKey.apiKey) {
        apiKey = apiKey.apiKey;
        options = _.omit(apiKey, 'apiKey');
    }
    
    // Preform some sane validation checks and throw errors
    // We need the appId
    if (!apiKey) {
        throw new InvoiceXpressError('Invalid Api Key: ' + apiKey);
    }
    
    // Copy over the relavant data
    this.apiKey = apiKey;
    
    // Extend the defaults
    this.options = _.defaults(options || {}, InvoiceXpress.defaultOptions);
    
    // Contruct the endpoint with the correct auth from the apiKey
    this.endpoint = this.options.endpoint;
}

/**
 * Expose `defaultOptions` for the intercom library so that this is changable.
 */
InvoiceXpress.defaultOptions = defaultOptions;

/**
 * Helper method to create an instance easily
 *
 * Enables use like this:
 *
 *     `var invoicexpress = require('invoicexpress').create("your_API_key");`
 *
 *      or
 *
 *     `var invoicexpress = require('invoicexpress').create(options);`
 *
 * @param {String} apiKey - your api key
 * @param {Object} options - an options object
 * @api public
 */
InvoiceXpress.create = function(apiKey, options) {
    var invoicexpress = new InvoiceXpress(apiKey, options);
    invoicexpress.setDefaultAccount();
    return invoicexpress;
};

InvoiceXpress.prototype.request = function(method, path, parameters, cb) {
    debug('Requesting [%s] %s with data %o', method, path, parameters);
    
    var url = this.endpoint + path;
    
    var requestOptions = {
        method: method,
        url: url,
        strictSSL: false   
    };
    
    if (method === 'GET') {
        parameters.api_key = this.apiKey;
        requestOptions.qs = parameters;
        requestOptions.headers = {
            'Content-Type': 'application/xml; charset=utf-8',
            'Accept': 'application/xml'
        };
    } else {
        parameters.api_key = this.apiKey;
        // requestOptions.form = parameters;
        requestOptions.body = JSON.stringify(parameters);
        requestOptions.headers = {
            'x-api-key' : this.apiKey
            //'Accept': 'application/json',
            //'Content-Type' : 'application/json'
        };
    }
    // create a promise to return
    var deferred = Q.defer();
    request(requestOptions, function(err, res, data) {
        if (err) {
            // Reject the promise
            return deferred.reject(err);
        }
        // Try to parse the data
        var parsed;
        if (data) {
            debug('Recieved response %s', data);
            
            try {
                parsed =  JSON.parse(xmlToJson.toJson(data));
                if (parsed && (parsed.error || parsed.errors && parsed.errors.length > 0)) {
                    err = new InvoiceXpressError(data);
                        
                    // Reject the promise
                    return deferred.reject(err);
                };
               
            } catch (exception) {
                // Reject the promise
                return deferred.reject(exception);
            }
        }
        
        // Resolve the promise
        return deferred.resolve(parsed || data);
    });
    
    // Return the promise and promisify any callback provided
    return deferred.promise.nodeify(cb);
};

/**
 * GETs all the pages of an InvoiceXpress resource in parallel.
 * @param {String} path The resource to retrieve (e.g. companies)
 * @param {Object} parameters Query parameters for the root resource
 * @param {Function} cb Optional request callback
 * @returns {Promise} A promise of an array containing all the elements of the
 * requested resource.
 *
 * @api public
 */
// ### Users

InvoiceXpress.prototype.setDefaultAccount = function () {
    var that = this;
    this.request('GET', 'users/accounts.xml', {}, function (err, data) {
        if (err) {
            throw new InvoiceXpressError('Error fetching users: ' + err);
            return;
        }
        if (data !== null) {
            var userData = data;
            if (userData.accounts) {
                that.accountId = userData.accounts.account.id;
                that.accountName = userData.accounts.account.name;
                that.endpoint = userData.accounts.account.url + '/';
            } else {
                throw new InvoiceXpressError('Account not found');
            }
        } else {
            throw new InvoiceXpressError('Account not found');
        }
    });
    
};

InvoiceXpress.prototype.setAccount = function (accountName) {
    if (_.isString(accountName)) {
        this.accountName = accountName;
        var that = this;
        this.request('GET', 'users/accounts.xml', {}, function (err, data) {
            if (err) {
                throw new InvoiceXpressError('Error fetching users: ' + err);
                return;
            }
            if (data !== null) {
                var userData = data;
                if (userData.accounts) {
                    for (var i = 0, account; account = userData.accounts[i].account[0]; i++) {
                        if (account.name[0].toLowerCase() == accountName.toLowerCase()) {
                            that.accountId = account.id[0];
                            that.accountName = account.name[0];
                            that.endpoint = account.url[0] + '/';
                            return;
                        }
                    }
                }
                throw new InvoiceXpressError('Invalid accountName: '+ accountName);               
            } else {
                throw new InvoiceXpressError('Invalid accountName: '+ accountName);               
            }
        });
    } else {
        throw new InvoiceXpressError('Invalid accountName: '+ accountName);               
    }
};

InvoiceXpress.prototype.listAllInvoices = function(options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }
    return this.request('GET', 'invoices.xml', options, cb);
};


InvoiceXpress.prototype.getInvoice = function(options, cb) {
    var defaultOptions = {
        'type[]': 'Invoice',
        non_archived: true,
        'status[]': ['settled', 'sent']
    };
    if (_.isFunction(options)) {
        cb = options;
        options = defaultOptions;
    } else {
        for (var key in options) {
            defaultOptions[key] = options[key];
        }
        options = defaultOptions;
        if (options['invoice-id']) {
            return this.request('GET', 'invoices/' + invoiceId + '.xml', options, function (err, response) {
                cb(err, response.invoices.invoice);
            });
        }
        return this.request('GET', 'invoices.xml', options, function (err, response) {
            return cb(err, response.invoices.invoice);
        });
    }
    return this.request('GET', 'invoices.xml', options, function (err, response) {
        return cb(err, response.invoices.invoice);
    });
};

/**
 * Expose `InvoiceXpress` Library.
 */
module.exports = InvoiceXpress;
