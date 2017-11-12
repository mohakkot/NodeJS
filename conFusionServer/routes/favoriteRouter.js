const express = require('express'),
bodyparser = require('body-parser');
const favoriteRouter = express.Router();
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('./cors');
ObjectId = require('mongodb').ObjectID;

favoriteRouter.use(bodyparser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.all(authenticate.verifyUser, cors.corsWithOptions)
.get((req, res, next) => {
    Favorites.find({'user' : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err)=> next(err));
})
.post((req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then((favorite) => {
        req.body.user = req.user._id;
        if (favorite.length) {
            console.log(req.body[j])
            for(var j = (req.body.length -1); j>=0; j--){
                var favoriteAlreadyExist = false;
                if (favorite[0].dishes.length) {
                    for (var i = (favorite[0].dishes.length - 1); i >= 0; i--) {
                        if(favorite[0].dishes[i].toString() === req.body[j].toString()){
                            favoriteAlreadyExist = true;
                        }
                        if(favoriteAlreadyExist){
                            err = new Error('Dish ' + req.body[j] + ' Already in Favorites. Favorites Not Added');
                            err.status = 500;
                            return next(err); 
                        }
                    }
                }
                if (!favoriteAlreadyExist) {
                    console.log(req.body)
                    favorite[0].dishes.push(req.body[j]);
                    favorite[0].save() 
                    .then((favor) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json'); 
                        res.json(favor);
                    }, (err) => next(err));
                } 
            }
        } 
        else {
            Favorites.create({user: req.body.user})
            .then((favorite) => {
                for(var j = (req.body.length -1); j>=0; j--){
                    favorite.dishes.push(ObjectId(req.body[j]));
                }
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json'); 
                    res.json(favorite);
                }, (err) => next(err));

            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Favorites.remove({'user' : req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.all(authenticate.verifyUser, cors.corsWithOptions)
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorite/' + req.params.dishId);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite/'+ req.params.dishId);
})

.post((req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then((favorite) => {
        req.body.user = req.user._id;
        console.log(favorite);
        if (favorite.length) {
            var favoriteAlreadyExist = false;
            console.log(favorite[0].dishes[0]);
            console.log(req.params.dishId)
            if (favorite[0].dishes.length) {
                for (var i = (favorite[0].dishes.length - 1); i >= 0; i--) {
                    if(favorite[0].dishes[i].toString() === req.params.dishId.toString()){
                        favoriteAlreadyExist = true;
                        err = new Error('Dish ' + req.params.dishId + ' Already in Favorites');
                        err.status = 500;
                        return next(err); 
                        break;

                    }
                }
            }
            if (!favoriteAlreadyExist) {
                favorite[0].dishes.push(req.params.dishId);
                favorite[0].save() 
                .then((favor) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json'); 
                    res.json(favor);
                }, (err) => next(err));
            } 
        } 
        else {
            Favorites.create({user: req.body.user})
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json'); 
                    res.json(favorite);
                }, (err) => next(err));

            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then((favorite) => {
        console.log(favorite);
        if (favorite.length){
            var deleted = false;
            for (var i = (favorite[0].dishes.length - 1); i >= 0; i--) {
                if (favorite[0].dishes[i].toString() === req.params.dishId.toString()) {
                    favorite[0].dishes.remove(req.params.dishId);
                    deleted = true;
                }
            }
            if(deleted){
                favorite[0].save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found in Favorites');
                err.status = 404;
                return next(err); 
            }
        }
        else {
            err = new Error('Favorites are empty');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;