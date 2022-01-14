import { authenticateConstant } from "../../constants";

const {LOGIN_SUCCESS, LOUGOUT_SUCCESS} = authenticateConstant;

const initialState = {
  isAuthenticated: false,
  user: {},
  token: {}
};

const authenticateReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
        return {...state, ...action.payload};
        case LOUGOUT_SUCCESS:
            return {...state, ...initialState};
        default:
            return state;
    }
}

export default authenticateReducer;