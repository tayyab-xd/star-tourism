export const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TRIPS':
            return {
                ...state,
                allTrips: action.payload
            };
        case 'PROFILE_SET':
            return {
                ...state,
                profileData: action.payload,
            };
        case 'PROFILE_CLEAR':
            return { ...state, profileData: {} };
        case 'SET_APPLICATIONS':
            return {
                ...state,
                applications: action.payload,
            };
        default:
            break;
    }
}