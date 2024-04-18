import ShoppingCartModal from '../Cart/CartModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchCartItems } from '../../store/cart';

function ShoppingCartButton({ cartId }) {
    const dispatch = useDispatch();
    const numCartItems = useSelector(state => state.cart.numCartItems);

    useEffect(() => {
        const runDispatches = async () => {
            dispatch(fetchCartItems())

        }
        runDispatches();
    }, [dispatch])

    return (
        <div className='shoppingCartIconWrapper'>
            <OpenModalMenuItem
                itemText={<>

                    <i style={{ color: "#28635A" }} className="fa-solid fa-cart-shopping" />

                    {numCartItems > 0 &&
                        (

                            <span className="cartCircle">
                                <i style={{ fontSize: "large", marginTop: "-20px" }} className="fa-solid fa-circle" />

                                <span className='cartNum'>
                                    {numCartItems}
                                </span>

                            </span>
                        )}



                </>}
                modalComponent={<ShoppingCartModal cartId={cartId} />}
            />


        </div>
    )
}

export default ShoppingCartButton