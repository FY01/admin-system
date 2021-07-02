import React, {Component} from 'react';
/*
商品详情页
 */
import {
    Card,
    List,
    Icon
} from 'antd'
import LinkButton from "../../components/linkButton";
import {BASE_IMG_URL} from "../../utils/constant";
import {reqCategory} from '../../api'

const Item = List.Item
export default class ProductDetails extends Component {

    state = {
        firstCategory:'一级分类',   //一级分类名称
        secondCategory:''   //二级分类名称
    }

    //回到ProductHome
    goBackProductHome = () => {
        this.props.history.goBack()
    }

    //获取一级、二级分类名称
    getCategory = async () => {
        const {categoryId,pCategoryId} = this.props.location.state.product
        if (pCategoryId === '0') {
            const result = await reqCategory({categoryId})
            let secondCategory = result.data.name
            this.setState({secondCategory})
        }else {

            /* 一个await是在前一个请求成功接收到请求再发的，效率低
            const result1 = await reqCategory(pCategoryId) //获取一级分类名称
            const result2 = await reqCategory(categoryId) //获取二级分类名称
            let firstCategory = result1.data.name
            let secondCategory = result2.data.name
            this.setState({firstCategory,secondCategory})
             */
            //一次性发送多请求，只有都成功了，再正常处理
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            let firstCategory = results[0].data.name
            let secondCategory = results[1].data.name
            this.setState({firstCategory,secondCategory})
        }
    }
    componentDidMount() {
        this.getCategory()
    }

    render() {
        //从home组件传过来的state中取出数据
        const {firstCategory,secondCategory} = this.state
        const {name,desc,price,detail,imgs} = this.props.location.state.product

        const title = (
            <span>
                <LinkButton>
                    <Icon type ='arrow-left' style={{marginRight:10,fontSize:20}} onClick={ this.goBackProductHome}/>
                </LinkButton>
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
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>所属分类：</span>
                        <span>{firstCategory}{secondCategory? '-->' + secondCategory: ''}</span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品图片：</span>
                        <span>
                            {imgs.map((img) => {
                                return (<img
                                    key={img}
                                    src={BASE_IMG_URL + img}
                                    alt="照片"
                                    className={'product-details-img'}
                                />)
                            })}
                        </span>
                    </Item>
                    <Item>
                        <span className={'product-details-left'}>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}>
                        </span>
                    </Item>
                </List>
            </Card>
        );
    }
}

