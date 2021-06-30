import React, {Component} from 'react';
import {Form, Select, Input} from "antd";
/*
添加分类的组件
 */

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form
        const {parentId} = this.props
        return (
            <Form>
                <Item>
                    {getFieldDecorator('parentId', {// 配置对象: 属性名是特定的一些名称
                        // 声明式验证: 直接使用别人定义好的验证规则进行验证
                        initialValue:parentId,// 初始值
                    })(
                        <Select>
                            <Option value = '0'>一级分类</Option>
                            <Option value = '1'>电脑</Option>
                            <Option value = '2'>手机</Option>
                        </Select>,
                    )}
                </Item>
                <Item>
                    {getFieldDecorator('categoryName', {// 配置对象: 属性名是特定的一些名称
                        initialValue:'',
                        rules: [
                            { required: true,whitespace:true, message: '分类名称不能为空!' },
                            { min: 1, message: '分类名称最少1位,最多6位!' },
                            { max: 6, message: '分类名称最少1位,最多6位!' },
                            // { pattern: /^[a-zA-Z0-9_]+$/, message: '分类名称只能是字母数字和下划线！' }
                        ]
                    })(
                        <Input placeholder={'请输入分类名称'}>
                        </Input>
                    )}

                </Item>
            </Form>
        );
    }
}
export default Form.create()(AddForm)
