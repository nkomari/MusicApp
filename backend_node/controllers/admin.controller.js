const Song = require('../models/song.model.js');
const Review = require('../models/review.model.js');
const Rating = require('../models/rating.model.js');
const User = require('../models/user.model.js');

exports.add = (req, res) => {
    Song.create(req.body)
        .then(data => {
            if (Boolean(data["_id"])) {
                res.status(200).send({ message: data["_id"] })
            }
            else {
                res.status(500).send({ message: "false" })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while adding a new song."
            })
        });

};

exports.del = (req, res) => {
    var songID = req.params.songID
    Song.deleteOne({ _id: songID })
        .then(data => {
            if (Boolean(data["deletedCount"])) {

                res.status(200).send({ message: "success" })
            }
            else {
                res.status(200).send({ message: "false" })
            }

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting a song."
            })
        });
};

exports.hide = (req, res) => {
    Song.updateOne({ _id: req.body.songid }, { $set: { Hidden: req.body.hidden } })
        .then(data => {
            if (Boolean(data["nModified"])) {

                res.status(200).send({ message: "success" })
            }
            else {
                res.status(200).send({ message: "false" })
            }

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while hiding a song."
            })
        });

};

exports.update = (req, res) => {
    Song.updateOne({ _id: req.body.songID }, { $set: req.body })
        .then(data => {
            if (Boolean(data["nModified"])) {
                res.status(200).send({ message: "true" })
            }
            else {
                res.status(500).send({ message: "false" })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while editing song details."
            })
        });
}

exports.delreview = (req, res) => {
    var reviewid = req.body.reviewid

    Review.deleteOne({ _id: reviewid })
        .then(data => {
            if (Boolean(data["deletedCount"])) {

                res.status(200).send({ message: "success" })
            }
            else {
                res.status(200).send({ message: "false" })
            }

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting a song review."
            })
        });
};


exports.deactivate = (req, res) => {

    User.updateOne({ _id: req.body.userid }, { $set: { active: req.body.status } })
        .then(data => {
            if (Boolean(data["nModified"])) {
                res.status(200).send({ message: "true" })
            }
            else {
                // didnt insert 
                res.status(500).send({ message: "false" })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while deactivating a user."
            })
        });
};

exports.changetype = (req, res) => {

    var userid = req.body.userid
    var type = req.body.usertype
    console.log(type)
    console.log(userid)
    if (type) {
        type = "SM"
    }
    else {
        type = "user"
    }
    console.log(type)
    User.updateOne({ _id: userid }, { $set: { usertype: type } })
        .then(data => {
            console.log(data)
            if (Boolean(data["nModified"])) {
                res.status(200).send({ message: "true" })
            }
            else {
                // didnt insert 
                res.status(500).send({ message: "false" })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while deactivating a user."
            })
        });
};

exports.getsong = (req, res) => {
    Song.find().sort('-Ratings')
        .then(data => { res.send({ list: data }) })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while fetching song list."
            })
        });
}

exports.userlist = (req, res) => {
    User.find()
        .then(data => { res.send({ list: data }) })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while fetching song list."
            })
        });
}