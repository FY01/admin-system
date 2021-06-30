import React, {Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom'

/*
商品管理路由
 */
import ProductHome from "./ProductHome";
import ProductDetails from "./ProductDetails";
import ProductAddUpdate from "./ProductAddUpdate";


export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path = {'/product'} component = {ProductHome} exact/>
                <Route path = {'/product/productDetails'} component = {ProductDetails}/>
                <Route path = {'/product/productAddUpdate'} component = {ProductAddUpdate}/>
                <Redirect to = {'/product'}/>
            </Switch>
        );
    }
}

