import { createBrowserRouter } from 'react-router-dom';
import Listings from './components/Listings/ListingsIndex';
import ListingPage from './components/Listings/ListingPage';
import CreateListingForm from './components/Listings/ListingForm/CreateListingForm';
import UpdateListingForm from './components/Listings/ListingForm/UpdateListingForm';
import ManageListings from './components/listings/ManageListings';
import ShoppingCartPage from './components/Cart/CartPage';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/Checkout/OrderConfirmation';
import CheckoutUser from './components/Checkout/CheckoutUser/CheckoutUser';
import UserProfile from './components/User/UserProfile';
import EditProfile from './components/User/EditProfile';
import CompleteProfile from './components/User/CompleteProfile';
import Shop from './components/User/Shop';
import Layout from './Layout';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <h1>Welcome!</h1>
            },
            {
                path: '/listings',
                element: <Listings />
            },
            {
                path: '/listings/current',
                element: <ManageListings />
            },
            {
                path: '/listings/:listingId',
                element: <ListingPage />
            },
            {
                path: '/listings/new',
                element: <CreateListingForm />
            },
            {
                path: '/listings/:listingId/edit',
                element: <UpdateListingForm />
            },
            {
                path: '/cart',
                element: <ShoppingCartPage />
            },
            {
                path: '/checkout',
                element: <Checkout />
            },
            {
                path: '/checkout/user',
                element: <CheckoutUser />
            },
            {
                path: '/order/:orderId',
                element: <OrderConfirmation />
            },
            {
                path: '/user/:userId',
                element: <UserProfile />
            },
            {
                path: '/user/:userId/editprofile',
                element: <EditProfile />
            },
            {
                path: '/user/:userId/completeprofile',
                element: <CompleteProfile />
            },
            {
                path: '/user/:userId/shop',
                element: <Shop />
            },
        ]
    }
]);

export default router;