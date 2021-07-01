import React, {Component} from 'react';
/*
商品详情页
 */
import {
    Card,
    List,
    Icon
} from 'antd'

const Item = List.Item
export default class ProductDetails extends Component {
    render() {
        const title = (
            <span>
                <Icon type ='arrow-left' style={{color:'#1DA57A',marginRight:10}}/>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card
                title={title}
                className={'product-details'}
            >
                <List>
                    <Item>
                        <span className={'product-details-left'}>商品名称：</span>
                        <span>华为</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品描述：</span>
                        <span>华为</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品价格：</span>
                        <span>华为</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>所属分类：</span>
                        <span>电脑 -》华为</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品图片：</span>
                        <span>
                            <img src="" alt="" className={'product-details-img'}/>
                            <img src="" alt="" className={'product-details-img'}/>
                        </span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:'<h1 style="color: red">商品详情页的配置</h1>'}}>

                        </span>
                    </Item>
                </List>
            </Card>
        );
    }
}

