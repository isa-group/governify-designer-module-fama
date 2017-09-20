'use strict'

const yaml = require('js-yaml');
const request = require('request');
const fs = require('fs');
const path = require('path');

const FaMaTools = require("governify-fama-tools");
const Reasoner = FaMaTools.Reasoner;

module.exports = {

    /**
     * Future implementation
     */
    //  products: function (res, data, parameters) {
    //     res.send(new responseModel('OK', "No operation ", data, null));
    // },

    executeDocument: function (res, data, parameters) {
        var famaDocument = data[0].content;

        var reasoner = new Reasoner({
            type: 'local',
            folder: 'fama_files'
        });

        reasoner.solve(famaDocument, (err, stdout, stderr, isSatisfiable, document) => {
            if (err || (parameters && parameters.format === "json")) {
                res.send({
                    error: err,
                    stdout: stdout,
                    stderr: stderr,
                    isSatisfiable: isSatisfiable,
                    document: document
                });
            } else {
                res.send(new responseModel('OK', buildResponse(stdout), data, null));
            }
        });

    },
    check: function (syntax, res, data) {
        res.status(200).json(new responseModel('OK', null, null, null));
    },
    checkConsistency: function (syntax, res, data) {
        res.status(200).json(new responseModel('OK', null, null, null));
    },
    translate: function (syntaxSrc, syntaxDes, res, data) {
        res.status(200).json(new responseModel('OK', "Nothing to translate", null, []));
    }
}

function translateCombinationError(res, syntaxDes) {
    res.status(200).json(new responseModel("ERROR", "It is not possible to translate from yaml to " + syntaxDes, null, []));
}

function responseModel(status, message, data, annotations) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.annotations = annotations;
}

function annotation(type, row, column, text) {
    this.type = type;
    this.row = row;
    this.column = column;
    this.text = text;
}

let buildResponse = (stdout) => {
    return '<pre>' + stdout + '</pre>';
};