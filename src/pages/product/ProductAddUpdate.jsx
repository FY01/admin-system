import React, {Component} from 'react';
/*
商品增加和修改页
 */
import {
    Card,
    Input,
    Form,
    Cascader,
    Upload,
    Icon,
    Button, message
} from "antd";
import LinkButton from "../../components/linkButton";
import {reqCategories} from "../../api";

const Item = Form.Item
const { TextArea } = Input;


class ProductAddUpdate extends Component {
    state = {
        options:[]
    };

    //回到ProductHome
    goBackProductHome = () => {
        this.props.history.goBack()
    }

    //自定义验证价格方法
    validatePrice = (rule,value,callback) => {
        if (value * 1 > 0){
            callback()  //成功的回调
        }else {
            callback('且必须大于0') //失败的回调
        }
    }



    // 用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0];
        // 加载图片状态
        targetOption.loading = true;

        // 根据选中的分类, 请求获取二级分类列表
        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false

        if (subCategories && subCategories.length !== 0){
            const childOptions = subCategories.map((c) => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        }else { //当前选中的没有二级分类
            targetOption.isLeaf = true
        }
        // 更新状态options
        this.setState({
            options:[...this.state.options]
        })
    };

    //获取一级二级分类列表
    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            //拿到一级分类列表
            const categories = result.data
            if (parentId === '0'){
                this.initOptions(categories)
            }else {
                return categories
            }
        }
    }
    /*
    初始化Options
     */
    initOptions = (categories) => {
        // 根据categories生成options
        const options = categories.map( c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        this.setState({options})
    }

    //提交
    submit = () => {
        this.props.form.validateFields((error,values) => {
            if (!error){
                message.success('提交成功')
                console.log(values)
            }
        })
    }

    UNSAFE_componentWillMount() {
        // 去除带过来的product
        const product = this.props.location.state
        //保存是否是update的标识,如果product即表示是从修改来的
        this.isUpdate = !!product

        this.product = product || {}

    }

    componentDidMount() {
        this.getCategories('0')
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {isUpdate,product} = this
        const title = (
            <span>
                <LinkButton>
                    <Icon type={'arrow-left'} style={{marginRight:10,fontSize:20}} onClick={ this.goBackProductHome}>
                </Icon>
                </LinkButton>
                <span>{isUpdate?'修改商品': '添加商品'}</span>
            </span>
        )
        // Form Item的布局，一共分为24格
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label={'商品名称'}>
                        {
                            getFieldDecorator('name',{
                                initialValue:product.name,
                                rules:[
                                    {required:true,whitespace:true,message:'商品名称必须输入'},
                                    { min: 2, message: '商品名称最少1位,最多8位!' },
                                    { max: 8, message: '商品名称最少1位,最多8位!' }
                                ]
                            })(<Input placeholder={'请输入商品名称'}/>)
                        }
                    </Item>
                    <Item label={'商品描述'}>
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {required:true,whitespace:true,message:'商品描述必须输入'},
                                    { min: 6, message: '商品描述最少6位,最多50位!' },
                                    { max: 50, message: '商品描述最少6位,最多50位!' }
                                ]
                            })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 3, maxRows: 5 }} />)
                        }
                    </Item>
                    <Item label={'商品价格'}>
                        {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true,whitespace:true,message:'价格必须输入'},
                                    {validator:this.validatePrice},// 自定义验证规则
                                ]
                            })(<Input placeholder={'请输入商品价格，类型为数值'} type={'number'} addonAfter="元" ></Input>)
                        }
                    </Item>
                    <Item label={'商品分类'}>
                        {
                            getFieldDecorator('categoryIds',{
                                initialValue:[],
                                rules:[
                                    {required:true},
                                ]
                            })(<Cascader
                                options={this.state.options} //需要显示的列表数据数组
                                loadData={this.loadData}    //当选择某个列表项，加载下一级列表的监听回调
                            />)
                        }
                    </Item>
                    <Item label={'商品图片'}>
                        <div>商品图片</div>
                    </Item>
                    <Item label={'商品详情'}>
                        <div>商品详情</div>
                    </Item>
                    <Item >
                        <Button type={'primary'} onClick={this.submit}>
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}
export default Form.create()(ProductAddUpdate)

