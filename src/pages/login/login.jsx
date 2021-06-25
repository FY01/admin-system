import React, {Component} from 'react';
import './login.less'
import { Form, Icon, Input, Button, } from 'antd';
import logo from './images/logo.png'


class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('发送ajax请求', values);
            }
        });
    };
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
                            {getFieldDecorator('username', {
                                initialValue:'admin',
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



