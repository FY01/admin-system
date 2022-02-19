/*
 * @Descripttion: 
 * @version: 
 * @@Company: 
 * @Author: FY01
 * @Date: 2022-02-19 10:23:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-19 11:37:17
 */
/*
redux 核心管理对象 store
 */
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))