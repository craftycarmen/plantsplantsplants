import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../store/user";
import { Link, useNavigate, useParams } from "react-router-dom";
import { titleCase } from "../../../utils";

function UserProfileForm({ formType }) {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user[userId]?.User);
    const shop = useSelector(state => state.user[userId]?.Shop)
    const activeListings = shop?.filter(listing => listing.stockQty > 0)
    const [bio, setBio] = useState(user?.bio || '');
    const [favoritePlant, setFavoritePlant] = useState(user?.favoritePlant || '');
    const [city, setCity] = useState(user?.city || '');
    const [state, setState] = useState(user?.state || '');
    const [accountType, setAccountType] = useState(user?.accountType || '');
    const [shopDescription, setShopDescription] = useState(user?.shopDescription || '');
    const [paymentMethod, setPaymentMethod] = useState(user?.paymentMethod || '');
    const [paymentDetails, setPaymentDetails] = useState(user?.paymentDetails || undefined);
    // const [image, setImage] = useState("");
    const [errors, setErrors] = useState({});

    // const updateFile = e => {
    //     const file = e.target.files[0];
    //     if (file) setImage(file);
    // };
    // const updateBio = (e) => setBio(e.target.value);
    // const updateFavoritePlant = (e) => setFavoritePlant(e.target.value);
    // const updateCity = (e) => setCity(e.target.value);
    // const updateState = (e) => setState(e.target.value);
    // const updateAccountType = (e) => setAccountType(e.target.value);
    // const updateShopDescription = (e) => setShopDescription(e.target.value);
    // const updatePaymentMethod = (e) => setPaymentMethod(e.target.value);
    // const updatePaymentDetails = (e) => setPaymentDetails(e.target.value);

    const isCompleteProfile = formType === 'Complete Profile';
    // const isEditProfile = formType === 'Edit Profile';

    const states = ['AL', 'AK', 'AZ', 'AR',
        'CA', 'CO', 'CT', 'DE', 'DC',
        'FL', 'GA', 'HI', 'ID', 'IL',
        'IN', 'IA', 'KS', 'KY', 'LA',
        'ME', 'MD', 'MA', 'MI', 'MN',
        'MS', 'MO', 'MT', 'NE', 'NV',
        'NH', 'NJ', 'NM', 'NY', 'NC',
        'ND', 'OH', 'OK', 'OR', 'PA',
        'RI', 'SC', 'SD', 'TN', 'TX',
        'UT', 'VT', 'VI', 'VA', 'WA',
        'WV', 'WI', 'WY']

    const banks = ['Bank of Americano', 'Pursuit', 'Fells Wargo'];

    useEffect(() => {
        const errs = {};
        if (!bio) errs.bio = '';
        if (!favoritePlant) errs.favoritePlant = '';
        if (!city) errs.city = '';
        if (!state) errs.state = '';
        // if (isCompleteProfile && !image) errs.image = '';
        if (bio && bio.trim().length < 30) errs.bio = 'Bio must be 30 characters at mininmum';
        if (bio && bio.trim().length > 250) errs.bio = 'Bio must be 250 characters at maximum';
        if (favoritePlant && favoritePlant.trim().length < 3) errs.favoritePlant = 'Favorite plant must be 3 characters at mininmum';
        if (favoritePlant && favoritePlant.trim().length > 100) errs.favoritePlant = 'Favorite plant must be 100 characters at maximum';
        if (city && city.trim().length > 100) errs.city = 'City must be 100 characters at maximum';
        if (accountType == 'buyer') {
            if (activeListings?.length > 0) errs.accountType = 'You currently have active listings. Please delete them or change stock quantity to 0 before changing your account type.';
        }
        if (accountType === "seller") {
            if (!shopDescription) errs.shopDescription = '';
            if (!paymentMethod) errs.paymentMethod = '';
            if (!paymentDetails) errs.paymentDetails = '';
            if (shopDescription && shopDescription.trim().length < 30) errs.shopDescription = 'Shop description must be 30 characters at mininmum';
            if (shopDescription && shopDescription.trim().length > 250) errs.shopDescription = 'Shop description must be 250 characters at maximum';
            if (paymentDetails && isNaN(paymentDetails)) errs.paymentDetails = 'Payment details must be 4 digits';
            if (paymentDetails && paymentDetails.length < 4) errs.paymentDetails = 'Payment details must be 4 digits';
        }

        setErrors(errs);
    }, [isCompleteProfile, bio, favoritePlant, city, state, shopDescription, paymentDetails, paymentMethod, accountType, activeListings?.length])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors();

        const profile = {
            bio,
            favoritePlant: titleCase(favoritePlant),
            city: titleCase(city),
            state,
            shopDescription,
            paymentDetails,
            paymentMethod,
            accountType
        }

        try {
            await dispatch(editProfile(userId, profile));
            navigate(`/user/${userId}`)
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }

    return (
        <section className="formContainer">
            <h1>{formType}</h1>
            {isCompleteProfile && <div>Thanks for signing up for Plantera! Please complete your profile.</div>}
            <form onSubmit={handleSubmit}>
                <div className="inputContainer">
                    <textarea
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder=""
                        id="bio"
                    />
                    <label htmlFor="bio" className="floating-label">Tell us about yourself!*</label>
                    <div className="error">{errors?.bio &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.bio}</>}</div>
                </div>
                <div className="inputContainer">
                    <input
                        type="text"
                        value={favoritePlant}
                        onChange={(e) => setFavoritePlant(e.target.value)}
                        placeholder=""
                        id="favoritePlant"
                    />
                    <label htmlFor="favoritePlant" className="floating-label">What&#39;s your favorite plant?*</label>
                    <div className="error">{errors?.favoritePlant &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.favoritePlant}</>}</div>
                </div>
                <div className='inputContainer'>
                    <input
                        type='text'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder=''
                        id='city'
                    />
                    <label htmlFor='city' className='floating-label'>City*</label>
                </div>
                <div className='error'>{errors?.city &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.city}</>}
                </div>

                <div className='inputContainer'>
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        name="state"
                    >
                        <option value="">-</option>
                        {states.map(stateName => (
                            <option
                                key={stateName}
                                value={stateName}
                            >
                                {stateName}
                            </option>
                        ))}
                    </select>
                    <label htmlFor='state' className='floating-label'>State*</label>
                </div>
                <div className='error'>{errors?.state &&
                    <><i className="fa-solid fa-circle-exclamation" /> {errors.state}</>}
                </div>
                <div className="inputContainer accountType">
                    Would you like to sell plants on Plantera?*
                    <div className='radioInput' style={{ paddingBottom: '10px' }}>
                        <input
                            type="radio"
                            value="seller"
                            name="accountType"
                            defaultChecked={accountType === "seller"}
                            onClick={() => setAccountType("seller")}
                        /><span>Yes</span>

                        <input
                            type="radio"
                            value="buyer"
                            name="accountType"
                            defaultChecked={accountType === "buyer"}
                            onClick={() => setAccountType("buyer")}
                        /><span>No</span>
                    </div>
                    <div className="error">{errors?.accountType &&
                        <><i className="fa-solid fa-circle-exclamation" /> {errors.accountType}</>}</div>
                </div>
                {accountType == "seller" &&
                    <>
                        <div className="inputContainer">
                            <textarea
                                type="text"
                                value={shopDescription}
                                onChange={(e) => setShopDescription(e.target.value)}
                                placeholder=""
                                id="shopDescription"
                            />
                            <label htmlFor="shopDescription" className="floating-label">Tell us about your shop!*</label>
                            <div className="error">{errors?.shopDescription &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.shopDescription}</>}</div>
                        </div>

                        <div className='inputContainer accountType' style={{ paddingBottom: "0px" }}>Where do you want us to send your earnings?*</div>
                        <div className='inputContainer'>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                name="paymentMethod"
                            >
                                <option value="">-</option>
                                {banks.map(bank => (
                                    <option
                                        key={bank}
                                        value={bank}
                                    >
                                        {bank}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor='paymentMethod' className='floating-label'>Bank*</label>
                        </div>
                        <div className='error'>{errors?.paymentMethod &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.paymentMethod}</>}</div>

                        <div className='inputContainer'>
                            <input
                                type='text'
                                value={paymentDetails}
                                onChange={(e) => setPaymentDetails(e.target.value)}
                                placeholder=''
                                id='paymentDetails'
                                minLength="4"
                                maxLength="4"
                            />
                            <label htmlFor='paymentDetails' className='floating-label'>Bank Account # (4 digits)*</label>
                        </div>
                        <div className='error'>{errors?.paymentDetails &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.paymentDetails}</>}</div>
                    </>
                }
                <button
                    type='submit'
                    disabled={errors && !!Object.values(errors)?.length}
                >{formType}</button>

                {isCompleteProfile && <div className="skip"><Link to='/'>Skip for Now</Link></div>}
            </form >
        </section>
    )
}

export default UserProfileForm;
