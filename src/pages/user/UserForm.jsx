import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select
} from "antd";
/*
添加\修改用户的组件
 */

const Option = Select.Option
const Item = Form.Item


class UserForm extends PureComponent {
    static propTypes = {
        roles: PropTypes.array.isRequired,
        getUserForm: PropTypes.func.isRequired,
        user: PropTypes.object
    }

    // 自定义手机号验证规则
    validatePhoneNumber = (rule, value, callback) => {
        if (!value) callback("手机号不能为空!")
        if (value.length !== 11) callback("手机号为1开头的11位数字")
        if (!/^[1][0-9]{10}$/.test(value)) callback("手机号为1开头的11位数字")
        callback()
    }
    // 自定义密码验证规则
    validatePWD = (rule, value, callback) => {
        if (!value) callback("密码不能为空!")
        if (value.length < 4) callback("密码是最少4位,最多12位的字母数字和下划线")
        if (value.length > 12) callback("密码是最少4位,最多12位的字母数字和下划线")
        if (!/^[a-zA-Z0-9_]+$/.test(value)) callback("密码只能是字母数字和下划线！")
        callback()
    }
    // 自定义邮箱验证规则
    validateEmail = (rule, value, callback) => {
        if (!value) callback("邮箱不能为空!")
        if (!/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(value)) callback("请输入正确的邮箱格式，例如：xxx@xxx.xxx")
        callback()
    }

    // 传递from对象给父组件
    UNSAFE_componentWillMount() {
        this.props.getUserForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { roles, user } = this.props
        // console.log(roles,user)
        // Form Item的布局，一共分为24格
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
            <Form {...formItemLayout}>
                <Item label={'用户名'}>
                    {getFieldDecorator('username', {// 
                        initialValue: user.username,
                        rules: [
                            { required: true, whitespace: true, message: '用户不能为空!' },
                            { min: 4, message: '用户名最少4位,最多12位!' },
                            { max: 12, message: '用户名最少4位,最多12位!' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能是字母数字和下划线！' }
                        ]
                    })(
                        <Input placeholder={'请输入用户名'}>
                        </Input>
                    )}
                </Item>
                {
                    //修改用户时不用更改密码
                    user._id ? null :
                        <Item label={'密码'}>
                            {getFieldDecorator('password', {//
                                initialValue: user.password,
                                rules: [
                                    { required: true, whitespace: true, message: '密码不能为空!' },
                                    { validator: this.validatePWD },
                                ]
                            })(
                                <Input placeholder={'请输入密码'} type={'password'}>
                                </Input>
                            )}
                        </Item>
                }
                <Item label={'手机号'}>
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                        rules: [
                            { required: true, whitespace: true, message: '手机号为11位数字' },
                            { validator: this.validatePhoneNumber },// 自定义验证规则
                        ]
                    })(
                        <Input placeholder={'请输入手机号'} type={'number'} >
                        </Input>
                    )}
                </Item>
                <Item label={'邮箱'}>
                    {getFieldDecorator('email', {//
                        initialValue: user.email,
                        rules: [
                            { required: true, whitespace: true, message: '邮箱不能为空!' },
                            { validator: this.validateEmail },// 自定义验证规则
                        ]
                    })(
                        <Input placeholder={'请输入邮箱'}>
                        </Input>
                    )}
                </Item>
                <Item label={'角色'}>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                        rules: [
                            { required: true, whitespace: true, message: '请选择角色' },
                        ]
                    })(
                        <Select >
                            {
                                roles.map(role => (<Option value={role._id} key={role._id}>{role.name}</Option>))
                            }
                        </Select>
                    )}
                </Item>
            </Form>
        );
    }
}
export default Form.create()(UserForm)

