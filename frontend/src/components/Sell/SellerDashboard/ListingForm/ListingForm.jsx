import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addListing, editListing } from '../../../../store/listings';
import ErrorHandling from "../../../ErrorHandling";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { fetchAllGuides } from '../../../../store/guides';
import { titleCase, upperCaseFirst } from '../../../../../utils';
import Menu from '../Menu';
import Sell from '../../SellPage/Sell';

function ListingForm({ listing, formType }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const listingId = listing.id
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth >= 481);
    const [showMenu, setShowMenu] = useState(!(isMobile || isTablet));

    const sellerContainerStyle = {
        marginLeft: (!isTablet && !isMobile) && showMenu ? '250px' : '0',
        transition: 'margin-left 0.2s ease-in-out'
    };
    const sessionUser = useSelector(state => state.session.user);
    const user = useSelector(state => state.user[sessionUser?.id]?.User)
    const currUser = user || sessionUser;
    const isSeller = currUser && currUser.accountType === 'seller';
    const [plantName, setPlantName] = useState(listing?.plantName || "");
    const [description, setDescription] = useState(listing?.description || "");
    const [price, setPrice] = useState(listing?.price || "");
    const [potSize, setPotSize] = useState(listing?.potSize || "");
    const [stockQty, setStockQty] = useState(listing?.stockQty !== undefined ? listing.stockQty : "");
    const [image, setImage] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const updatePlantName = (e) => setPlantName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updatePotSize = (e) => setPotSize(e.target.value);
    const updateStockQty = (e) => setStockQty(e.target.value);
    // const updateGuideId = (e) => setGuideId(e.target.value);
    const animatedComponents = makeAnimated();
    const guides = Object.values(useSelector(state => state.guides));

    const [selectedGuides, setSelectedGuides] = useState([]);

    const guideOptions = guides
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(guide => ({
            value: guide.id,
            label: guide.title
        }));


    useEffect(() => {
        dispatch(fetchAllGuides())
    }, [dispatch])

    useEffect(() => {
        const selectedOptions = (listing?.Guides || []).map(guide => ({
            value: guide.id,
            label: guide.title
        }));
        setSelectedGuides(selectedOptions);
    }, [listing.Guides, listing]);


    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };
    let guidesArray = selectedGuides.map(guide => guide.value)
    const createForm = formType === 'Create Listing';
    const updateForm = formType === 'Update Listing';

    useEffect(() => {

        const errs = {};

        if (!plantName) errs.plantName = '';
        if (!description) errs.description = '';
        if (!price) errs.price = '';
        if (!potSize) errs.potSize = '';
        if (!stockQty) errs.stockQty = '';
        if (plantName && plantName.trim().length < 3 || plantName.trim().length > 50) errs.plantName = 'Plant name must be between 3-50 characters';
        if (description && description.trim().length < 30 || description.trim().length > 250) errs.description = 'Description must be between 30-250 characters';
        if (price && price <= 0) errs.price = 'Price must be greater than $0';
        if (potSize && potSize < 2 && potSize > 12) errs.potSize = 'Pot size must be btween 2-12 inches';
        if (createForm && stockQty && stockQty <= 0) errs.stockQty = 'Stock quantity must be greater than 0';
        if (createForm && !image) errs.image = ""
        // if (guideId && guideId > 10) errs.imag = "Guide is invalid"

        setErrors(errs);
    }, [plantName, description, price, potSize, stockQty, createForm, image])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({})
        // const guideIds = selectedGuides
        listing = {
            ...listing,
            sellerId: sessionUser.id,
            plantName: titleCase(plantName),
            description: upperCaseFirst(description),
            price,
            potSize,
            stockQty,
            guideIds: guidesArray,
            image
        }
        // 

        if (createForm) {
            try {
                setImageLoading(true)
                const newListing = await dispatch(addListing(listing));

                const { id } = newListing

                navigate(`/listings/${id}`);
            } catch (error) {
                console.error('Error creating listing:', error);
            }
        } else if (updateForm) {
            try {
                await dispatch(editListing(listing));

                navigate(`/listings/${listingId}`);
            } catch (error) {
                console.error('Error updating listing:', error);
            }
        }
    }

    const customSelectStyle = {
        control: (base, state) => ({
            ...base,
            background: "#B9CDCA",
            borderRadius: "3px",
            // match with the menu
            // borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
            // // Overwrittes the different states of border
            borderColor: state.isFocused ? "#28635A" : "#28635A",
            // // Removes weird border around container
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                //     // Overwrittes the different states of border
                borderColor: state.isFocused ? "#28635A" : "#28635A"
            },
            color: "#28635A",
            cursor: "pointer",
            width: "auto"
        }),
        menu: base => ({
            ...base,
            marginTop: 0,
            background: "#B9CDCA",
            cursor: "pointer",
            borderRadius: "3px",
            width: "auto"
        }),
        menuList: base => ({
            ...base,
            // kill the white space on first and last option
            padding: 0,
            background: "#B9CDCA",
            cursor: "pointer",
            width: "auto"
        }),
        dropdownIndicator: base => ({
            ...base,
            color: "#28635A",
            "&:hover": { color: "#E38251" }
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#28635A" : "#28635A",
            "&:hover": { color: "#E38251" }
        }),
        option: (base, state) => ({
            ...base,
            color: state.isDisabled ? "gray" : "#28635A",
            cursor: state.isDisabled ? 'default' : 'cursor',
            backgroundColor: state.isSelected ? '#B9CDCA' : 'inherit',
            '&:hover': {
                // backgroundColor: state.isSelected ? '#B9CDCA' : '#FDAC8A',
                backgroundColor: state.isDisabled ? '#B9CDCA' : '#FDAC8A',
            },
            width: "auto"
        }),
        valueContainer: (base) => ({
            ...base,
            width: "578px",
        }),
        multiValueRemove: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#B9CDCA' : 'inherit',
            '&:hover': {
                // backgroundColor: state.isSelected ? '#B9CDCA' : '#E38251',
                // backgroundColor: state.isDisabled ? '#B9CDCA' : '#E38251',
                backgroundColor: '#E6E6E6',
                color: '#E38251'
            },
        })
    };


    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 480);
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 481);

    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize]);

    return (
        <>
            {(!sessionUser || (sessionUser && !isSeller)) &&
                <Sell />
            }
            {sessionUser && isSeller &&
                <>
                    <h1>Sell(er Dashboard) for {sessionUser.username}</h1>
                    <div>Purge your plants and plant babies on Plantera, and get paid!</div>
                    <br />
                    <div>
                        <div className="filterSort">
                            <Menu sessionUser={sessionUser} handleToggle={handleToggle} />
                        </div>
                        <div style={sellerContainerStyle} className="sellerDashContainer">
                            <h2>{formType}</h2>
                            {!sessionUser ? (
                                <ErrorHandling />
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className='inputContainer' style={{ marginTop: '20px' }}>
                                        <input
                                            type='text'
                                            value={plantName}
                                            onChange={updatePlantName}
                                            placeholder=''
                                            id='plantName'
                                        />
                                        <label htmlFor='plantName' className='floating-label'>Plant Name*</label>
                                    </div>
                                    <div className='error'>{errors.plantName &&
                                        <><i className="fa-solid fa-circle-exclamation" /> {errors.plantName}</>}</div>
                                    <div className='inputContainer'>
                                        <textarea
                                            value={description}
                                            onChange={updateDescription}
                                            placeholder=''
                                            id='description'
                                        />
                                        <label htmlFor='description' className='floating-label'>Description*</label>
                                    </div>
                                    <div className='error'>{errors.description &&
                                        <><i className="fa-solid fa-circle-exclamation" /> {errors.description}</>}</div>
                                    <div className='inputContainer'>
                                        <input
                                            type='number'
                                            step='0.01'
                                            min='1'
                                            value={price}
                                            onChange={updatePrice}
                                            placeholder=''
                                            id='price'
                                        />
                                        <label htmlFor='price' className='floating-label'>Price*</label>
                                    </div>
                                    <div className='error'>{errors.price &&
                                        <><i className="fa-solid fa-circle-exclamation" /> {errors.price}</>}</div>
                                    <div className='inputContainer'>
                                        <input
                                            type='number'
                                            step='1'
                                            min='2'
                                            max='12'
                                            value={potSize}
                                            onChange={updatePotSize}
                                            placeholder=''
                                            id='potSize'
                                        />
                                        <label htmlFor='potSize' className='floating-label'>Pot Size (inches)*</label>
                                    </div>
                                    <div className='error'>{errors.potSize &&
                                        <><i className="fa-solid fa-circle-exclamation" /> {errors.potSize}</>}</div>
                                    <div className='inputContainer'>
                                        <input
                                            type='number'
                                            step='1'
                                            min='0'
                                            value={stockQty}
                                            onChange={updateStockQty}
                                            placeholder=''
                                            id='stockQty'
                                        />
                                        <label htmlFor='stockQty' className='floating-label'>Stock Quantity*</label>
                                    </div>
                                    <div className='error'>{errors.stockQty &&
                                        <><i className="fa-solid fa-circle-exclamation" /> {errors.stockQty}</>}</div>
                                    {createForm &&
                                        <>
                                            <div className='inputContainer'>
                                                <input
                                                    type="file"
                                                    accept=".jpg, .jpeg, .png"
                                                    // multiple
                                                    onChange={updateFile}
                                                    id='image'
                                                />
                                                <label htmlFor='image' className='floating-label'>Image*</label>
                                                <div className='error'>{errors.image &&
                                                    <><i className="fa-solid fa-circle-exclamation" /> {errors.image}</>}</div>
                                            </div>
                                        </>}
                                    <div className='inputContainer'>
                                        <div>Select up to 3 guides to include:</div>
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            value={selectedGuides}
                                            onChange={(e) => setSelectedGuides(e)}
                                            options={guideOptions}
                                            name="guides"
                                            isOptionDisabled={() => selectedGuides.length >= 3}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#FDAC8A',
                                                    primary: '#FDAC8A',
                                                    neutral80: '#28635A',
                                                    color: '#28635A',
                                                },
                                            })}
                                            styles={customSelectStyle}
                                        />

                                    </div>
                                    {createForm &&
                                        <>
                                            {imageLoading && (<div className="dots"></div>)}
                                        </>}
                                    <button
                                        type='submit'
                                        disabled={!!Object.values(errors).length}
                                    >
                                        {formType}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </>
            }
        </>
    );

}

export default ListingForm
