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

// 请求商品列表
// searchType：搜索的类型：productName、productDesc
export const reqProducts = (pageNum,pageSize) => ajax(BASE + '/manage/product/list',{pageNum,pageSize})

// 请求搜索商品分页列表
// searchType 搜索的类型：productName、productDesc
export const reqSearchProducts = ({pageNum, pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search',
    {
        pageNum,
        pageSize,
        //加[]表示不是searchType字符串，而是实参searchType
        [searchType]:searchName
    })
// 请求获取一级、二级分类的列表
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
//请求更新状态，对产品进行上架、下架处理
//上架：1，下架：2
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST')

//请求删除图片
export const reqDeleteImg = (name) => ajax(BASE + "/manage/img/delete" , {name},'POST')

//请求增加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id?'update':'add'),product,'POST')

//请求获取所有角色列表
export const reqRoles =() => ajax(BASE + '/manage/role/list')

//请求增加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName},'POST')
//更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update',role,'POST')

//请求所有用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list','GET')

//请求删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete',{userId},'POST')

// 请求增加、更新用户
export const reqAddUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id?'update':'add'),user,'POST')


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