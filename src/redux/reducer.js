/*
 * @Descripttion: 
 * @version: 
 * @@Company: 
 * @Author: FY01
 * @Date: 2022-02-19 10:23:47
 * @LastEditors: 
 * @LastEditTime: 2022-02-19 10:32:26
 */
/*
根据旧的state和指定的action返回新的state
 */
import { combineReducers } from "redux";

import storageUtils from "../utils/storageUtils";
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERR_MSG,
    RESET_USER
} from './actionTypes'

//用来管理头部标题的reducer
const initHeaderTitle = '首页'
function headerTitle(state = initHeaderTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

//用来管理当前登陆user的reducer
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.data
        case SHOW_ERR_MSG:
            const errMsg = action.data
            return { ...state, errMsg }
        case RESET_USER:
            storageUtils.removeUser()
            return action.data
        default:
            return state
    }
}

/*
向外暴露的是的总的reducer格式为，值为掉调用调用对应的reducer产生的值
{
    headerTitle,
    user
}
 */
export default combineReducers({
    headerTitle,
    user
})