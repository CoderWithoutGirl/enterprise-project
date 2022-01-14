import { authenticateConstant } from "../../constants"
const {LOGIN_SUCCESS, LOUGOUT_SUCCESS} = authenticateConstant;

export const loginSuccess = (payload) => {
    return {type: LOGIN_SUCCESS, payload: payload}
}

export const logoutSucess = () => {
    return {type: LOUGOUT_SUCCESS}
}