import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

// 头部
import './index.less'
import {reqWeather} from '../../api/index'
import {formatDateUtils} from '../../utils/formatDateUtils'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/manuConfig";
import LinkButton from "../linkButton";

class Header extends Component {
    state = {
        //当前时间
        currentTime : formatDateUtils(Date.now()),
        // 天气图片的url
        dayPictureUrl:'',
        // 天气文字
        weather:'',
    }
    // 组件完成挂载，开始更新时间，发送ajax请求获取天气状态
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }
    getTime = () => {
        this.setIntervalId = setInterval(() => {
            const currentTime = formatDateUtils(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather = async () => {
        const {dayPictureUrl,weather} = await reqWeather('广州')
        this.setState({dayPictureUrl,weather})
    }
    //根据当前路径拿到组件的title
    getTitle = () => {
        const path = this.props.location.pathname
        let title = ''
        menuList.forEach(item => {
            if (item.key === path){
                title = item.title
            }else if (item.children){
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = (event) => {
        event.preventDefault()
        Modal.confirm({
            content:`确认退出${memoryUtils.user.username}吗？`,
            // 这里必须写箭头函数，否则this指向不正确
            onOk: () => {
                // 删除内存中保存的user
                memoryUtils.user = {}
                // 从local中删除user
                storageUtils.removeUser()
                // 跳转到登陆界面
                this.props.history.replace('/login')
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.setIntervalId)
    }

    render() {
//TODO: 百度天气预报接口有问题，未解决
        // 从内存拿到当前用户名
        const username = memoryUtils.user.username
        // 从状态中获取天气状态
        const {currentTime,dayPictureUrl,weather} = this.state
        // const {currentTime} = this.state
        //根据当前路径拿到需要显示的title
        const title = this.getTitle()
        return (
            <div className={'header'}>
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>
                        退出
                    </LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(Header)

