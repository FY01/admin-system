import React, {Component} from 'react';
import {Form, Input} from "antd";
/*
添加分类的组件
 */


const Item = Form.Item


class AddForm extends Component {
    static propTypes = {
    }

    // 传递from对象给父组件
    UNSAFE_componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
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
                <Item label={'角色名称'}>
                    {getFieldDecorator('roleName', {// 配置对象: 属性名是特定的一些名称
                        initialValue:'',
                        rules: [
                            { required: true,whitespace:true, message: '角色名称不能为空!' },
                            { min: 2, message: '角色名称最少1位,最多8位!' },
                            { max: 8, message: '角色名称最少1位,最多8位!' },
                        ]
                    })(
                        <Input placeholder={'请输入角色名称'}>
                        </Input>
                    )}
                </Item>
            </Form>
        );
    }
}
export default Form.create()(AddForm)
