const express = require('express');
const { User, ShoppingCart, CartItem, Listing, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    // const { user } = req;
    const cartId = Number(req.query.cartId);

    // if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    // }

    const shoppingCart = await ShoppingCart.findOne({
        include: {
            model: CartItem,
            include: {
                model: Listing,
                attributes: ['id', 'plantName', 'price', 'stockQty'],
                include: {
                    model: Image,
                    as: 'ListingImages',
                    attributes: ['id', 'url']
                }
            },
        },
        where: {
            id: cartId
        }
    })

    return res.json({ ShoppingCart: shoppingCart })

});

router.get('/:cartId', async (req, res) => {
    const cartId = Number(req.params.cartId);

    const { user } = req;

    let buyerId = null;
    if (user) {
        buyerId = user.id;
    }

    const shoppingCart = await ShoppingCart.findOne({
        include: [
            {
                model: CartItem,
                include: {
                    model: Listing,
                    attributes: ['id', 'plantName', 'price', 'stockQty'],
                    include: {
                        model: Image,
                        as: 'ListingImages',
                        attributes: ['id', 'url']
                    }
                }
            },
        ],
        where: {
            id: cartId
        }
    })

    const cartItemsList = []

    shoppingCart.CartItems.forEach(item => {
        cartItemsList.push(item.toJSON())
    })

    let cartTotalArray = []
    cartItemsList.forEach(item => {
        itemSubTotal = item.cartQty * item.Listing.price
        item.subTotal = itemSubTotal
        cartTotalArray.push(itemSubTotal)
    })

    let cartTotal = cartTotalArray.reduce((total, amount) => total + amount)

    let getCartById = {
        id: shoppingCart.id,
        buyerId: buyerId,
        createdAt: shoppingCart.createdAt,
        updatedAt: shoppingCart.updatedAt,
        cartTotal: cartTotal,
        CartItems: cartItemsList
    }

    return res.json({ ShoppingCart: getCartById })

});

router.post('/', async (req, res) => {

    try {
        const { buyerId, cartId } = req.body;

        const existingCart = await ShoppingCart.findByPk(cartId);

        if (!existingCart) {
            const newCart = await ShoppingCart.create({ buyerId, cartId })
            return res.status(201).json(newCart);
        } else {
            return res.status(200).json(existingCart);
        }
    }
    catch (err) {
        return res.json(err.message)
    }
});

router.post('/:cartId/items', async (req, res) => {

    try {
        const cartId = Number(req.params.cartId);
        const { listingId, cartQty } = req.body;

        const existingCart = await ShoppingCart.findByPk(cartId);

        if (!existingCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const cartItem = await CartItem.create({
            cartId: cartId,
            listingId: Number(listingId),
            cartQty: cartQty
        })

        return res.status(201).json(cartItem)
    } catch (err) {
        return res.status(500).json(err.message)
    }
});

router.put('/:cartId/item/:itemId', async (req, res) => {
    try {
        const cartId = Number(req.params.cartId);
        const itemId = Number(req.params.itemId)

        const cart = await ShoppingCart.findOne({
            where: {
                id: cartId
            }
        })

        const cartItem = await CartItem.findOne({
            where: {
                id: itemId
            }
        })

        const { cartQty } = req.body
        // cartItem.cartQty = cartQty;
        // await cartItem.save();

        if (cartItem) {
            cartItem.cartQty += cartQty;
            // if (cartQty <= listing.stockQty) {
            await cartItem.save();
            // } else {
            //     return res.status(400).json({ error: "Cart quantity exceeds stock quantity" })
            // }
        }

        await cart.reload();

        return res.json(cartItem)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

router.put('/:cartId/items/:cartItemListingId', async (req, res) => {
    try {
        const cartId = Number(req.params.cartId);
        const listingId = Number(req.params.cartItemListingId)
        const listing = Listing.findOne({
            where: {
                id: listingId
            }
        })

        const cart = await ShoppingCart.findOne({
            where: {
                id: cartId
            }
        })

        const cartItem = await CartItem.findOne({
            where: {
                cartId: cart.id,
                listingId
            }
        })

        const { cartQty } = req.body
        // cartItem.cartQty = cartQty;
        // await cartItem.save();

        if (cartItem) {
            cartItem.cartQty += cartQty;
            // if (cartQty <= listing.stockQty) {
            await cartItem.save();
            // } else {
            //     return res.status(400).json({ error: "Cart quantity exceeds stock quantity" })
            // }
        }

        await cart.reload();

        return res.json(cartItem)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

module.exports = router;
