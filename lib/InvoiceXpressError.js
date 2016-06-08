/**
 * Module dependencies.
 */
var util = require('util');

/**
 * `AbstractError` error.
 *
 * @api private
 */
function AbstractError(message, constr) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, constr || this);
    
    this.name = 'AbstractError';
    this.message = message;
}

/**
 * Inherit from `Error`.
 */
util.inherits(AbstractError, Error);

/**
 * `InvoiceXpressError` error.
 *
 * @api private
 */
function InvoiceXpressError(message) {
    AbstractError.apply(this, arguments);
    this.name = 'InvoiceXpressError';
    this.message = message;
}

/**
 * Inherit from `AbstractError`.
 */
util.inherits(InvoiceXpressError, AbstractError);


/**
 * Expose `InvoiceXpressError`.
 */
module.exports = InvoiceXpressError;
