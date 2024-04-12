const express = require('express')
const bcrypt = require('bcryptjs');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    singleMulterUpload("image"),
    validateSignup,
    async (req, res) => {
        const { email, firstName, lastName, password, username,
            bio,
            favoritePlant,
            accountType,
            shopDescription,
            paymentMethod,
            paymentDetails } = req.body;
        const profileImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            email, username, firstName, lastName, hashedPassword,
            bio,
            favoritePlant,
            accountType,
            shopDescription,
            paymentMethod,
            paymentDetails,
            profileImageUrl
        });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            // bio: user.bio,
            // favoritePlant: user.favoritePlant,
            // accountType: user.accountType,
            // shopDescription: user.shopDescription,
            // paymentMethod: user.paymentMethod,
            // paymentDetails: user.paymentDetails
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);

module.exports = router;
