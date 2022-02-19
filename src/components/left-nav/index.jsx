// 左侧导航条
import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from 'antd';
import { connect } from "react-redux";
import PropTypes from 'prop-types'

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from "../../config/manuConfig";
import { setHeadTitle } from "../../redux/actions";

const { SubMenu } = Menu;

class LeftNav extends Component {
    static propTypes = {
        setHeadTitle: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    }

    // reduce(),和递归组合

    shouldShow = (item) => {
        /*
        1.用户是admin，应该显示组件，所有返回true
        2.组件是公开的（isPublic），应该对所有用户显示
        3.item的key值（路径）在用户的role的menus中找到，应该返回true
        4.如果当前用户有item的子item的权限
         */
        const key = item.key
        const { role, username } = this.props.user
        const menus = role.menus
        if (username === 'admin' || item.isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            // 4.如果当前用户有item的子item的权限
            return !!item.children.find(cItem => menus.indexOf(cItem.key) !== -1)
        } else {
            return false
        }
    }

    getMenuListReduce = (menuList) => {
        //先把当前被选中组件的路径拿到
        let path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            //判断每个user应该显示那些组件
            if (this.shouldShow(item)) {

                if (!item.children) {
                    // 判断是否是当前对应的item，
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        //如果是则更新当前redux的headTitle状态
                        this.props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key={item.key} onClick={() => { this.props.setHeadTitle(item.title) }}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    //如果子菜单的路径跟被选中的菜单一致，则这个父菜单需要被打开状态(不需要完全一致，因为切换到父菜单的子路由组件时，父菜单也需要被打开)
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    //拿到这个父菜单的path
                    if (cItem) {
                        this.openKey = item.key
                    }

                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuListReduce(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }
    //在render之前就要把需要渲染的菜单数据拿到
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuListReduce(menuList)
    }

    render() {
        let path = this.props.location.pathname

        // 解决切换product的子组件，左侧导航条没有被选上的bug
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        return (
            <div className={'left-nav'}>
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="" />
                    <h1>后台管理</h1>
                </Link>
                <Menu
                    // defaultSelectedKeys只在第一次render有效，但页面第一次加载render了两次，导致第一次的home导航条没有被选中
                    // defaultSelectedKeys={[path]}
                    selectedKeys={[path]}
                    // 如果二级菜单有被选中的，父菜单刷新之后需要打开
                    defaultOpenKeys={[this.openKey]}

                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}

/*
withRouter 是一个高阶组件，接收一个非路由组件，返回一个新的路由组件，
新的组件向非路由组件传递三个参数：history，location，match
 */
export default connect(
    state => ({ user: state.user }),
    { setHeadTitle }
)(withRouter(LeftNav))
