"use strict";

const Benchmarker = require("../benchmarker");
const bench = new Benchmarker({ async: false, name: "Benchmark #1 - Simple object"});

const obj = {
    name: "John Doe",
    email: "john.doe@company.space",
    firstName: "John",
    phone: "123-4567",
	age: 33
};

// ---- validator.js ----
(function() {
	const is = require( 'validator.js' ).Assert;
	const validator = require( 'validator.js' ).validator();

	const constraints = {
		name: [ is.notBlank(), is.ofLength( { min: 4, max: 25 } ) ],
		email: is.email(),
		firstName: is.notBlank(),
		phone: is.notBlank(),
		age: [ is.required(), is.greaterThan(18) ]
	};

	bench.add("validator.js", () => {
		validator.validate(obj, constraints);
	});

}());


// ---- validate.js ----
(function() {
	const validate = require("validate.js");

	const constraints = {
		name: {
			presence: true,
			length: {
				minimum: 4,
				maximum: 25
			}
		},
		email: { email: true },
		firstName: { presence: true },
		phone: { presence: true },
		age: { 
			numericality: {
      			onlyInteger: true,
      			greaterThan: 18
			}
		}
	};

	bench.add("validate.js", () => {
		return validate(obj, constraints);
	});
}());

// ---- validatorjs ----
(function() {
	const Validator = require('validatorjs');

	const constraints = {
		name: "required|min:4|max:25",
		email: "required|email",
		firstName: "required",
		phone: "required",
		age: "required|integer|min:18"
	};

	bench.add("validatorjs", () => {
		let validation = new Validator(obj, constraints);
		return validation.passes();
	});

}());

// ---- joi ----
(function() {
	const Joi = require('joi');

	const constraints = Joi.object().keys({
		name: Joi.string().min(4).max(25).required(),
		email: Joi.string().email().required(),
		firstName: Joi.required(),
		phone: Joi.required(),
		age: Joi.number().integer().min(18).required()
	});
	
	bench.add("joi", () => {
		return Joi.validate(obj, constraints);
	});

}());



// ---- ajv ----
(function() {
	const Ajv = require('ajv');
	const ajv = new Ajv();

	const constraints = {
		properties: {
			name: { type: "string", minLength: 4, maxLength: 25 },
			email: { type: "string", format: "email" },
			firstName: { type: "string" },
			phone: { type: "string" },
			age: { type: "integer", minimum: 18 }
		},
		required: [
			"name",
			"email",
			"firstName",
			"phone",
			"age"
		]
	};

	bench.add("ajv", () => {
		return ajv.validate(constraints, obj);
	});
}());


// ---- mschema ----
(function() {
	const mschema = require('mschema');

	const constraints = {
		name: {
			type: "string",
			minLength: 4,
			maxLength: 25
		},
		email: "string",
		firstName: "string",
		phone: "string",
		age: {
			type: "number",
			min: 18
		}
	};

	bench.add("mschema", () => {
		return mschema.validate(obj, constraints);
	});

}());


// ---- mschema ----
(function() {
	const parambulator = require('parambulator');

	const constraints = {
		name: {
			type$: "string",
			required$: true,
			minlen$: 4,
			maxlen$: 25
		},
		email: { type$: "string", required$: true },
		firstName: { type$: "string", required$: true },
		phone: { type$: "string", required$: true },
		age: {
			type$: "number",
			required$: true,
			min$: 18
		}
	};

	let check = parambulator(constraints);

	bench.add("parambulator", () => {
		return check.validate(obj, (err) => {
			//console.log(err);
		});		
	});

}());


bench.run();