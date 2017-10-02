"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
// Mongo
var mongodb = require('mongodb');
var bluebirdPromise = require('bluebird');
global.Promise = bluebirdPromise;
var pmongodb = bluebirdPromise.promisifyAll(mongodb);
var server = new mongodb.Server('localhost', 27017);
var db = new mongodb.Db('mydb', server, { w: 1 });
db.open(function () { });
function getUser(id, callback) {
    db.collection('users', function (error, users) {
        if (error) {
            console.error(error);
            return;
        }
        users.findOne({ _id: id }, function (error, user) {
            if (error) {
                console.error(error);
                return;
            }
            callback(user);
        });
    });
}
exports.getUser = getUser;
function getUsers(callback) {
    db.collection('users', function (error, users_collection) {
        if (error) {
            console.error(error);
            return;
        }
        users_collection.find({}, { '_id': 1 }).toArray(function (error, userobjs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(userobjs);
        });
    });
}
exports.getUsers = getUsers;
function getImage(imageId, callback) {
    db.collection('images', function (error, images_collection) {
        if (error) {
            console.error(error);
            return;
        }
        images_collection.findOne({ _id: new mongodb.ObjectID(imageId) }, function (error, image) {
            if (error) {
                console.error(error);
                return;
            }
            callback(image);
        });
    });
}
exports.getImage = getImage;
function getImages(imageIds, callback) {
    db.collection('images', function (error, images_collection) {
        if (error) {
            console.error(error);
            return;
        }
        images_collection.find({ _id: { $in: imageIds } }).toArray(function (error, images) {
            callback(images);
        });
    });
}
exports.getImages = getImages;
function addBoard(userid, title, description, callback) {
    db.collection('users', function (error, users) {
        if (error) {
            console.error(error);
            return;
        }
        users.update({ _id: userid }, { "$push": { boards: { title: title, description: description, images: [] } } }, function (error, user) {
            if (error) {
                console.error(error);
                return;
            }
            callback(user);
        });
    });
}
exports.addBoard = addBoard;
function collection(name) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = Promise();
        db.collection(name, function (error, coll) {
            if (error)
                res.reject(error);
            else
                res.resolve(coll);
        });
        return Promise(db.collection);
    });
}
function addPin(userid, boardid, imageUri, link, caption, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        var coll = yield collection('images');
        db.collection('images', function (error, images_collection) {
            if (error) {
                console.error(error);
                return;
            }
            images_collection.insert({
                user: userid,
                caption: caption,
                imageUri: imageUri,
                link: link,
                board: boardid,
                comments: []
            }, function (error, image) {
                console.log(image);
                db.collection('users', function (error, users) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    users.update({ _id: userid, "boards.title": boardid }, { "$push": { "boards.$.images": image[0]._id } }, function (error, user) {
                        callback(user);
                    });
                });
            });
        });
    });
}
exports.addPin = addPin;
