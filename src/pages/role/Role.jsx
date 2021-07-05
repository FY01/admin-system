import React, {Component} from 'react';

/*
角色管理路由
 */
import {
    Card,
    Button,
    Table
} from "antd";
import LinkButton from "../../components/linkButton";
import {PAGE_SIZE} from "../../utils/constant";

export default class Role extends Component {
    state = {
        roles:[
            {
                "menus": [
                    "/products",
                    "/category",
                    "/product"
                ],
                "_id": "60e31b6f4f738803b286e328",
                "name": "测试",
                "create_time": 1625496431748,
                "__v": 0,
                "auth_name": "admin",
                "auth_time": 1625496458381
            },
            {
                "menus": [
                    "/charts",
                    "/charts/bar",
                    "/charts/line",
                    "/charts/pie"
                ],
                "_id": "60e31bb54f738803b286e329",
                "name": "运营",
                "create_time": 1625496501277,
                "__v": 0,
                "auth_name": "admin",
                "auth_time": 1625496510199
            }
        ]
    }


    // 初始化table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time'
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ];
    }
    // 设置行属性的回调
    onRow = (role) => {
        return {
            onClick: event => {// 点击行
                console.log(role)
            },
        };
    }

    // 为第一次render做数据准备
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    render() {
        const {roles} = this.state
        const title = (
            <span>
                <Button type={'primary'} style = {{marginRight:20}}>创建角色</Button>
                <Button type={'primary'} disabled>设置角色权限</Button>
            </span>
        )
        const rowSelection = {
            hideDefaultSelections: true,
            type:'radio'
        };
        return (
            <Card title = {title}>
                <Table
                    // 添加边框
                    bordered={true}
                    // 给每一行添加一个key
                    rowKey={'_id'}
                    dataSource={roles}
                    columns={this.columns}
                    //配置分页参数，和是否显示快速跳转页面
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    //侧边选择项
                    rowSelection={rowSelection}
                    //设置行属性
                    onRow={this.onRow}
                />
            </Card>
        );
    }
}

