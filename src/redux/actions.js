/*
包含多个action creator的函数模块
同步action：返回对象
异步action：返回函数，dispatch() => {}
 */
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERR_MSG,
    RESET_USER
} from './actionTypes'

import {reqLogin} from "../api";
import storageUtils from "../utils/storageUtils";


//设置头部标题的action
export const setHeadTitle = (headTitle) => ({type:SET_HEAD_TITLE,data:headTitle})

//保存user的同步action
export const receiveUser = (user) => ({type:RECEIVE_USER,data:user})

//显示登陆错误信息的同步action
export const showErrMsg = (msg) => ({type:SHOW_ERR_MSG,data:msg})

//登陆的异步action
export const login = (username,password) => {
    return async dispatch => {
        const result = await reqLogin(username,password)
        if (result.status === 0) {  //分发登陆成功的同步action
            const user = result.data
            dispatch(receiveUser(user))
            //并且保存到local中
            storageUtils.saveUser(user)
        }else { //分发登陆失败的同步action
            const msg = result.msg
            dispatch(showErrMsg(msg))
        }
    }
}

//退出登陆的同步action
export const logout = () => ({type:RESET_USER,data:{}})