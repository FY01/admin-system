import React, {Component} from 'react';
import {
    Card,
    Select,
    Button,
    Table,
    Icon,
    Input
}from 'antd'
import LinkButton from "../../components/linkButton";
/*
商品管理路由主界面
 */
const Option = Select.Option

export default class ProductHome extends Component {
    state = {
        //商品的数组
        products:[
            {
                "status": 1,
                "imgs": [],
                "_id": "60dc850293f96402bf83b5a8",
                "name": "华为 m14",
                "desc": "超薄本",
                "price": 6999,
                "detail": "<p></p>\n",
                "pCategoryId": "60db06c562b35f04ee246905",
                "categoryId": "60dc3ac493f96402bf83b5a2",
                "__v": 0
            },
            {
                "status": 1,
                "imgs": [],
                "_id": "60dc852e93f96402bf83b5a9",
                "name": "小米 k6",
                "desc": "商务本",
                "price": 5999,
                "detail": "<p></p>\n",
                "pCategoryId": "60db06c562b35f04ee246905",
                "categoryId": "60dc3ae793f96402bf83b5a3",
                "__v": 0
            }
        ]
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price) => {
                    return '￥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
                }
            },
            {
                title: '状态',
                width:100,
                dataIndex: 'status',
                render:(status) => {
                    return (
                        <span>
                            <Button type={'primary'}>下架</Button>
                            <span>在售</span>
                        </span>

                    )
                }
            },
            {
                title: '操作',
                width: 100,
                dataIndex: '',
                render:() => {
                    return (
                        <span>
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>

                    )
                }
            }
        ];
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    render() {
        const {products} =this.state
        const title = (
            <span>
                <Select
                    value='1'
                    style={{width:150}}
                >
                    <Option value= '1'>按名称搜索</Option>
                    <Option value= '2'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width:150,marginRight:15,marginLeft:15}}
                />
                <Button type={'primary'}> 搜索</Button>
            </span>
        )
        const extra = (
            <Button type={'primary'}>
                <Icon type={'plus'}/>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                />;
            </Card>
        );
    }
}


