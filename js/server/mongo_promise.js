"use strict";
var mongodb_1 = require("mongodb");
var mongodb_2 = require("mongodb");
var Server = (function () {
    function Server(host, port, opts) {
        this._server = mongodb_1.Server(host, port, opts);
    }
    Server.prototype.db = function (databaseName, dbOptions) {
        return new Db(databaseName, this._server, dbOptions);
    };
    return Server;
}());
exports.Server = Server;
var Db = (function () {
    function Db(databaseName, serverConfig, dbOptions) {
        this._db = mongodb_2.Db(databaseName, serverConfig, dbOptions);
        this._db.open(function () { });
    }
    return Db;
}());
exports.Db = Db;
var Collection = (function () {
    function Collection() {
    }
    return Collection;
}());
exports.Collection = Collection;
