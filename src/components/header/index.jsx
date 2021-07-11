import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {connect} from "react-redux";

// 头部
import './index.less'
import {reqWeather} from '../../api/index'
import {formatDateUtils} from '../../utils/formatDateUtils'
import menuList from "../../config/manuConfig";
import LinkButton from "../linkButton";
import {logout} from "../../redux/actions";

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
            // 如果当前item对象的key与path一样,item的title就是需要显示的title
            if (item.key === path){
                title = item.title
            }else if (item.children){
                // 在所有子item中查找匹配的(不用完全匹配，完全匹配会导致切换组件的子组件无法显示)
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem){
                     // 取出它的title
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = (event) => {
        event.preventDefault()
        Modal.confirm({
            content:`确认退出${this.props.user.username}吗？`,
            // 这里必须写箭头函数，否则this指向不正确
            onOk: () => {
                // 退出登陆
                this.props.logout()

            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.setIntervalId)
    }

    render() {
//TODO: 百度天气预报接口有问题，未解决
        // 从内存拿到当前用户名
        const username = this.props.user.username
        // 从状态中获取天气状态
        const {currentTime,dayPictureUrl,weather} = this.state
        // const {currentTime} = this.state

        //根据当前路径拿到需要显示的title
        // const title = this.getTitle()

        //redux管理
        const title = this.props.headerTitle

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
export default connect(
    state => ({headerTitle:state.headerTitle,user:state.user}),
    {logout}
)(withRouter(Header))

