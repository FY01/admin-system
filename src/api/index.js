/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数
 */


import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

const BASE = ''
// 请求登陆
export const reqLogin = (username,password) => ajax(BASE + '/login',{username,password},'POST')

// 获取一级/二级分类的列表
export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')



// 请求增加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add',user,'POST')

//请求天气预报，json请求接口请求函数
export const reqWeather = (city) => {
    //必须返回一个promise
    return new Promise(((resolve, reject) => {
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${city}&ou tput=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
            {},
            (err,data)=>{
            if (!err && data.status === 'success'){
                // 取出需要的数据
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            }else{
                message.error('请求天气失败')
            }
            })
    }))
}