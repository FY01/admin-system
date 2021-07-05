import React, {Component} from 'react';
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import Header from "../../components/header";
import LeftNav from "../../components/left-nav";

import Categories from "../categories/Categories";
import Bar from "../charts/Bar";
import Line from "../charts/Line";
import Pie from "../charts/Pie"
import Home from "../home/Home";
import Product from "../product/Product";
import Role from "../role/Role";
import Users from "../users/Users";
import './admin.less'

import memoryUtils from '../../utils/memoryUtils'
const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if (!user || !user._id){
            return <Redirect to ='/login'/>
        }
        return (
            <Layout style = {{minHeight:'100%'}}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content className={'content'}>
                        <Switch>
                            <Route path = '/home' component = {Home}/>
                            <Route path = '/categories' component = {Categories}/>
                            <Route path = '/product' component = {Product}/>
                            <Route path = '/users' component = {Users}/>
                            <Route path = '/role' component = {Role}/>
                            <Route path = '/charts/bar' component = {Bar}/>
                            <Route path = '/charts/line' component = {Line}/>
                            <Route path = '/charts/pie' component = {Pie}/>
                            <Redirect to = '/home'></Redirect>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:"center",color:'#ccc'}}>
                        推荐使用谷歌浏览器，可以获得更佳的页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

