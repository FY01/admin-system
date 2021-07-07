import React, {Component} from 'react';

/*
角色管理路由
 */
import {
    Card,
    Button,
    Table, Modal, message
} from "antd";

import {PAGE_SIZE} from "../../utils/constant";
import {reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from "./AddForm";
import AuthForm from "./AuthForm";
import memoryUtils from "../../utils/memoryUtils";
import {formatDateUtils} from "../../utils/formatDateUtils"

export default class Role extends Component {


    constructor(props) {
        super(props);
        this.state = {
            roles:[], //所有角色
            role:{}, //当前选择行的角色对象
            showAddStatus:false,//显示创建角色的状态
            showAuthStatus:false //显示设置角色权限的状态
        }
        this.authName = React.createRef()
    }

    //获取所有用户列表，前台分页展示
    getRoles = async () => {
       const result = await reqRoles()
        if (result.status === 0){
            const roles = result.data
            this.setState({roles})
        }
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
                dataIndex: 'create_time',
                render:formatDateUtils
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formatDateUtils
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
            onClick: event => {// 点击行,
                this.setState({role})
            },
        };
    }
    //添加角色
    addRole = () => {
        //通过表单验证
        this.form.validateFields( async (error,value) => {
            // 验证用户名是否已存在（前台）
            if (!this.state.roles.find((role) => role.name === value.roleName )){
                //拿到输入的值
                const {roleName} = value
                if (!error){
                    // 发请求增加角色
                    const result = await reqAddRole(roleName)
                    if (result.status === 0) {
                        message.success('添加角色成功')
                        const newRole = result.data
                        // 新角色添加到角色列表中显示
                        // this.setState({roles:[...this.state.roles,newRole]})
                        //函数写法
                        this.setState((state) => ({
                            // 新角色添加到角色列表中显示
                            roles:[...state.roles,newRole],
                            // 隐藏Modal
                            showAddStatus:false
                        }))
                    }else {
                        message.error('添加角色失败')
                    }
                }
                this.form.resetFields()
            }else {
                message.error(`${value.name}已存在！请另外起一个角色名`)
            }

        })
    }

    //设置、更新角色权限
    updateRole = async () => {
        // 隐藏Modal
        this.setState({
            showAuthStatus:false
        })
        const {role} = this.state
        const menus = this.authName.current.getMenu()
        // console.log( '接收到的',menus)
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        // debugger
        const result = await reqUpdateRole(role)
        if (result.status === 0){
            message.success('更新角色成功')
            this.setState({roles:[...this.state.roles]})
        }else {
            message.error('更新失败')
        }
    }

    // 为第一次render做数据准备
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles,role,showAddStatus,showAuthStatus} = this.state
        const title = (
            <span>
                <Button type={'primary'} style = {{marginRight:20}}  onClick = {() => {this.setState({showAddStatus: true})}}>创建角色</Button>
                <Button type={'primary'} disabled = {!role._id} onClick = {() => {this.setState({showAuthStatus: true})}}>设置角色权限</Button>
            </span>
        )

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
                    rowSelection = {{
                        // 隐藏侧边全选按钮
                        // hideDefaultSelections: true,
                        //checkbox：多选，radio：单选
                        type:'radio',
                        //点击行就选择
                        selectedRowKeys:[role._id],
                        onSelect: (role) => { // 选择某个radio时回调
                            this.setState({
                                role
                            })
                        }
                    }}
                    //点击行的操作
                    onRow={this.onRow}

                />
                <Modal
                    title="添加角色"
                    visible={showAddStatus}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({showAddStatus: false})
                    }}
                >
                    <AddForm
                        setForm = {(form) => this.form = form}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={showAuthStatus}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({showAuthStatus: false})
                    }}
                >
                    <AuthForm
                        role = {role}
                        ref = {this.authName}
                    />
                </Modal>
            </Card>
        );
    }
}

