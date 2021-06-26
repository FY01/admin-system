import React, {Component} from 'react';
import './login.less'
import { Form, Icon, Input, Button, } from 'antd';

import {reqLogin} from '../../api'
import logo from './images/logo.png'


class Login extends Component {
    handleSubmit = e => {
        // 阻止事件的默认行为
        e.preventDefault();
        // 对所有表单字段进行检验
        this.props.form.validateFields(async (err, values) => {
            // 检验成功
            if (!err) {
                // 请求登陆
                const {username,password} = values
                const result = await reqLogin(username,password)
                console.log('请求成功',result.data)
            }
        });
    };
    /*
  对密码进行自定义验证
  */
    validatePWD = (rule, value, callback) => {
        if (!value) callback("用户不能为空!")
        if (value.length < 4) callback("用户名最少4位,最多12位!")
        if (value.length > 12) callback("用户名最少4位,最多12位!")
        if (!/^[a-zA-Z0-9_]+$/.test(value)) callback("用户名只能是字母数字和下划线！")
        callback()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理系统</h1>
                    </div>
                <section className="login-content">
                    <h2>登陆系统</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {// 配置对象: 属性名是特定的一些名称
                                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                                initialValue:'admin',// 初始值
                                rules: [
                                    { required: true,whitespace:true, message: '用户不能为空!' },
                                    { min: 4, message: '用户名最少4位,最多12位!' },
                                    { max: 12, message: '用户名最少4位,最多12位!' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能是字母数字和下划线！' }
                                    ]
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    { validator:this.validatePWD },
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}

const WrappedLogin = Form.create({ name: 'normal_login' })(Login);
export default WrappedLogin



