import React, {Component} from 'react';
import Proptypes from 'prop-types'
/*
设置角色权限
 */
import {
    Form,
    Input,
    Tree
} from "antd";
import menuList from "../../config/manuConfig";

const Item = Form.Item
const { TreeNode } = Tree;

export default class AuthForm extends Component {
    static propTypes = {
        role:Proptypes.object
    }

    constructor (props) {
        super(props)

        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //为父组件获取menu
    getMenu = () => this.state.checkedKeys

    //动态生成树状图
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            // 必须return
            return pre
        },[])
    }
    //选择的回调
    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    /*
    根据新传入的role来更新checkedKeys的状态
    当组价接收到新的属性时自动调用
     */
    UNSAFE_componentWillMount() {
        // 得到tree列表
        this.treeNodes = this.getTreeNodes(menuList)
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const menus = nextProps.role.menu
        this.setState({checkedKeys:menus})
    }

    render() {
        // Form Item的布局，一共分为24格
        const {role} = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <div>
                <Item label={'角色名称'} {...formItemLayout}>
                    <Input value={role.name} disabled={true}/>
                </Item>
            <Tree
                checkable
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
            >
                <TreeNode title="平台权限" key="all">
                    {this.treeNodes}
                </TreeNode>
            </Tree>
            </div>
        );
    }
}

