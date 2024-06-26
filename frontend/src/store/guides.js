import { csrfFetch } from "./csrf";

const LOAD_ALL_GUIDES = 'guides/LOAD_ALL_GUIDES';
const LOAD_ONE_GUIDE = 'guides/LOAD_ONE_GUIDE';
const LOAD_OWNED_GUIDES = 'guides/LOAD_OWNED_GUIDES';
const CREATE_GUIDE = 'guides/CREATE_GUIDE';
const UPDATE_GUIDE = 'guides/UPDATE_GUIDE';
const DELETE_GUIDE = 'guides/DELETE_GUIDE';

export const loadAllGuides = (guides) => ({
    type: LOAD_ALL_GUIDES,
    guides
});

export const loadOneGuide = (guide) => ({
    type: LOAD_ONE_GUIDE,
    guide
});

export const loadOwnedGuides = (guides) => ({
    type: LOAD_OWNED_GUIDES,
    guides
});

export const createGuide = (guide) => ({
    type: CREATE_GUIDE,
    guide: guide
});

export const updateGuide = (guide) => ({
    type: UPDATE_GUIDE,
    guide
});

export const deleteGuide = (guideId) => ({
    type: DELETE_GUIDE,
    guideId
})

export const fetchAllGuides = () => async (dispatch) => {
    const res = await fetch('/api/guides');

    if (res.ok) {
        const guides = await res.json();
        dispatch(loadAllGuides(guides))
        return guides;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchOneGuide = (guideId) => async (dispatch) => {
    const res = await fetch(`/api/guides/${guideId}`);

    if (res.ok) {
        const guide = await res.json();
        dispatch(loadOneGuide(guide));
        return guide;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchOwnedGuides = () => async (dispatch) => {
    const res = await fetch('/api/guides/current');

    if (res.ok) {
        const guides = await res.json();
        dispatch(loadOwnedGuides(guides));
        return guides;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const addGuide = (guide) => async (dispatch) => {
    const { title, description, image, content } = guide;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("imageable_id", guide.id);
    formData.append("imageable_type", "Guide");
    formData.append("content", content);

    try {
        const res = await csrfFetch('/api/guides', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error('Failed to create guide');
        }

        const data = await res.json();
        dispatch(createGuide(data));
        return data
    } catch (error) {
        console.error('Error creating guide:', error);
        throw error;
    }
}

export const editGuide = (guide) => async (dispatch) => {
    const res = await csrfFetch(`/api/guides/${guide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...guide })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateGuide(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const removeGuide = (guideId) => async (dispatch) => {
    const res = await csrfFetch(`/api/guides/${guideId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        dispatch(deleteGuide(guideId))
    }
}

const guidesReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALL_GUIDES: {
            const guidesState = { ...state };
            action.guides.Guides.forEach(guide => {
                guidesState[guide.id] = guide;
            });

            return guidesState
        }
        case LOAD_ONE_GUIDE: {
            return { ...state, [action.guide.id]: action.guide }
        }
        case LOAD_OWNED_GUIDES: {
            const guidesState = {};
            if (action.guides.Guides !== "No guides found") {
                action.guides.Guides.forEach(guide => {
                    guidesState[guide.id] = guide;
                });
                return guidesState
            } else {
                return state;
            }
        }
        case CREATE_GUIDE: {
            return { ...state, [action.guide.id]: action.guide }
        }
        case UPDATE_GUIDE: {
            return { ...state, [action.guide.id]: action.guide }
        }
        case DELETE_GUIDE: {
            const newState = { ...state };
            delete newState[action.guideId];
            return newState;
        }
        default:
            return { ...state }
    }
}

export default guidesReducer
