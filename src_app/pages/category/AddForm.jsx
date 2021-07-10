import React, {Component} from 'react';
import {Form, Select, Input} from "antd";
import PropTypes from 'prop-types'
/*
添加分类的组件
 */

const Item = Form.Item
const Option = Select.Option


class AddForm extends Component {
    static propTypes = {
        parentId:PropTypes.string.isRequired,
        categories:PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired
    }
    // 传递from对象给父组件
    UNSAFE_componentWillMount() {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {parentId,categories} = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categories.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {getFieldDecorator('categoryName', {// 配置对象: 属性名是特定的一些名称
                        initialValue:'',
                        rules: [
                            { required: true,whitespace:true, message: '分类名称不能为空!' },
                            { min: 2, message: '分类名称最少1位,最多8位!' },
                            { max: 8, message: '分类名称最少1位,最多8位!' },
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
