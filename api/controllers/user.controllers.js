const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.test = function(req, res) {
    res.send('la route des users fonctionne.');
};

exports.admin = (req, res, next) => {
    bcrypt.hash('admin', 10).then(
        (hash) => {
            const user = new User({
                username: 'admin',
                password: hash,
                admin: 1

            });
            user.save().then(
                () => {
                    res.status(200).redirect('/admin');
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
}
exports.user_update = function(req, res) {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, project) {
        if (err) return ("erreur");
        res.send('user udpated.');
    });
};
exports.userdelete = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                username: req.body.username,
                password: hash,
                admin: 0
            });
            user.save().then(
                () => {
                    res.status(200);
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: 'nom d_utilisateur non disponible'
                    });
                }
            );
        } 
    );
};

// exports.login = (req, res, next) => {
//     User.findOne({ username: req.body.username }).then(
//         (user) => {
//             if (!user) {
//                 return res.status(401).json({
//                     error: new Error('User not found!')
//                 });
//             }
//             bcrypt.compare(req.body.password, user.password).then(
//                 (valid) => {
//                     if (!valid) {
//                         return res.status(401).json({
//                             error: new Error('Incorrect password!')
//                         });
//                     }
//                     res.status(200).json({
//                         userId: user._id,
//                         token: 'token'
//                     });
//                 }
//             ).catch(
//                 (error) => {
//                     res.status(500).json({
//                         error: error
//                     });
//                 }
//             );
//         }
//     ).catch(
//         (error) => {
//             res.status(500).json({
//                 error: error
//             });
//         }
//     );
// }

exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username }).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Incorrect password!')
                        });
                    }
                    const token = jwt.sign({ userId: user._id },
                        'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                    //req.header.authorization = "Bearer " + token;
                    res.header('Authorization', "Bearer " + token).status(200).json({ userId: user._id, token: token });//.redirect('http://localhost:3000/Login')//json({ userId: user._id, token: token });


                    //localStorage.setItem('token', token);
                    //req.header.authorization = "Bearer " + token;
                    //res.status(200).headers('Authorization', "Bearer " + token);   
//headers('Authorization', "Bearer " + token).

                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: "password invalide"
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: "username introuvable"
            });
        }
    );
}

exports.user_all = (req, res) => {
    User.find()
        .sort({ name: -1 })
        .then((user) => {
            res.status(200).send(user);
        })
};