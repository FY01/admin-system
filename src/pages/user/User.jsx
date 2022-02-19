import React, { Component } from 'react';

/*
用户管理管理路由
 */

import {
    Card,
    Button,
    Modal,
    Table,
    message
} from "antd";

import UserForm from './UserForm'
import { formatDateUtils } from '../../utils/formatDateUtils'
import LinkButton from "../../components/linkButton";
import { PAGE_SIZE } from "../../utils/constant";
import { reqUsers, reqDeleteUser, reqAddUpdateUser } from "../../api";

export default class User extends Component {
    state = {
        showStatus: false,
        users: [],
        roles: []
    }

    // 增加修改用户
    addOrUpdateUser = () => {
        this.setState({ showStatus: false })
        this.from.validateFields(async (error, value) => {
            if (!error) {
                // 1.收集数据
                let user = value
                // 如果是更新，给user添加_id属性
                if (this.user) {
                    user._id = this.user._id
                }
                const result = await reqAddUpdateUser(user)
                if (result.status === 0) {
                    message.success(`${this.user ? '修改' : '添加'}用户成功`)
                    this.getUsers()
                    this.from.resetFields()
                } else {
                    message.error(`${this.user ? '修改' : '添加'}用户失败`)
                }
            }
        })
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除成功')
                    this.getUsers()
                } else {
                    message.error('删除失败')
                }
            }
        })
    }

    //显示修改用户
    showUpdateUser = (user) => {
        this.user = user
        this.setState({ showStatus: true })
    }

    //显示创建用户
    showAddUser = () => {
        // 先把user重置为null，否则会影响创建用户
        this.user = null
        this.setState({ showStatus: true })
    }

    // 获取用户列表
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRolesName(roles)
            this.setState({ users, roles })
        }
    }

    // 收集各用户名的角色名对象
    initRolesName = (roles) => {
        const rolesName = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.rolesName = rolesName
    }
    // 初始化列
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDateUtils
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // 找到对象的角色名称
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                // 优化，减少查询次数,先把角色收集起来，键是' role_id', 值是对应的角色名
                render: (role_id) => this.rolesName[role_id]
            },


            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => { this.showUpdateUser(user) }}>修改</LinkButton>
                        <LinkButton onClick={() => { this.deleteUser(user) }}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { showStatus, users, roles } = this.state
        const user = this.user || {}
        const title = (
            <span>
                <Button type={'primary'} onClick={this.showAddUser}>
                    创建用户
                </Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    // 添加边框
                    bordered={true}
                    // 给每一行添加一个key
                    rowKey={'_id'}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                >

                </Table>
                <Modal
                    title={user.username ? '修改用户：' + user.username : '添加用户'}
                    visible={showStatus}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ showStatus: false })
                        this.form.resetFields()
                    }}
                >
                    <UserForm
                        getUserForm={form => this.from = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        );
    }
}

