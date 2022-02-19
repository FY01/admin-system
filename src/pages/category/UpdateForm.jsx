import React, { Component } from 'react';
import { Form, Input } from "antd";
import PropTypes from 'prop-types'
/*
修改分类的组件
 */

const Item = Form.Item

class UpdateForm extends Component {
    // 对接收到的props进行一定限制
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    // 传递from对象给父组件
    UNSAFE_componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { categoryName } = this.props
        return (
            <Form>
                <Item>
                    {getFieldDecorator('categoryName', {
                        //默认值通过props由父组件传入
                        initialValue: categoryName,
                        rules: [
                            { required: true, whitespace: true, message: '分类名称不能为空!' },
                            { min: 1, message: '分类名称最少1位,最多8位!' },
                            { max: 8, message: '分类名称最少1位,最多8位!' },
                            // { pattern: /^[a-zA-Z0-9_]+$/, message: '分类名称只能是字母数字和下划线！' }
                        ]
                    })(
                        <Input placeholder={'请输入分类名称'} >
                        </Input>
                    )}
                </Item>
            </Form>
        );
    }
}
export default Form.create()(UpdateForm)
