const express = require('express');
const { Guide, Image, ListingGuide, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { singleFileUpload, singleMulterUpload } = require('../../awsS3');

const router = express.Router();

router.get('/', async (req, res) => {
    const guides = await Guide.findAll({
        include: [
            {
                model: Image,
                as: 'GuideImages',
                attributes: {
                    exclude: ['avatar']
                }
            },
            {
                model: User,
                as: 'Author',
                attributes: ['id', 'username']
            }
        ]
    });

    let guidesList = [];

    guides.forEach(guide => {
        guidesList.push(guide.toJSON());
    });

    return res.json({ Guides: guidesList })
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const guides = await Guide.findAll({
            include: [
                {
                    model: Image,
                    as: 'GuideImages',
                    attributes: {
                        exclude: ['avatar']
                    }
                },
            ],
            where: {
                userId: user.id
            }
        });

        let guidesList = [];

        guides.forEach(guide => {
            guidesList.push(guide.toJSON())
        });

        if (guidesList.length === 0) {
            return res.json({ Guides: "No guides found" })
        } else {
            return res.json({ Guides: guidesList })
        }
    }
})

router.get('/:guideId', async (req, res) => {
    const guide = await Guide.findByPk(req.params.guideId, {
        include: [
            {
                model: Image,
                as: 'GuideImages',
                attributes: {
                    exclude: ['avatar']
                }
            },
            {
                model: User,
                as: 'Author',
                attributes: ['id', 'username']
            }
        ]
    })

    if (guide) {
        return res.json(guide)
    } else {
        return res.status(404).json({
            message: "Guide couldn't be found"
        })
    }
});

router.post('/', singleMulterUpload("image"), requireAuth, async (req, res) => {
    try {
        const { title, description, image, content } = req.body;

        const guideImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;

        const guide = await Guide.create({
            userId: req.user.id,
            title,
            description,
            content
        });

        await Image.create({
            imageableId: guide.id,
            imageableType: 'Guide',
            url: guideImageUrl
        })

        return res.status(201).json(guide)
    } catch (err) {
        return res.json(err.message);
    }
})

module.exports = router;
