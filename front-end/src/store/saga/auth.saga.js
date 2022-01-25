import {takeLatest, put, call} from 'redux-saga/effects';
import { toast } from "react-toastify";

import { login, refreshToken } from '../../apiServices';
import {loginSuccess,getNewTokenSuccess } from "../actions/authenticateAction";
import { authenticateConstant } from '../../constants';

const {LOGIN, GET_NEW_TOKEN} = authenticateConstant;

function* postLoginForm (action) {
    const {payload} = action;
    try {
         const { status, data } = yield call(login, payload);
         if (status === 200) {
           yield put(loginSuccess(data));
           return;
         } else {
           return toast.error("Unauthorize");    
         }
    } catch (error) {
        console.log(error)
    }
}

function* getNewToken(action) {
    const { data} = yield call(refreshToken, action.payload);
    yield put(getNewTokenSuccess(data))
}

export default function* authenticateSaga() {
    yield takeLatest(LOGIN, postLoginForm);
    yield takeLatest(GET_NEW_TOKEN, getNewToken);
}