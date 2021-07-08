import React, {Component} from 'react';
/*
商品增加和修改页
 */
import {
    Card,
    Input,
    Form,
    Cascader,
    // Upload,
    Icon,
    Button, message,
} from "antd";
import LinkButton from "../../components/linkButton";
import {reqCategories,reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";

const Item = Form.Item
const { TextArea } = Input;


class ProductAddUpdate extends Component {
    state = {
        options:[]
    };

    //1.创建用来保存ref标识的标签对象的容器
    constructor(props) {
        super(props);

        this.pictureWall = React.createRef()
        this.richTextEditor = React.createRef()
    }

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
    initOptions = async (categories) => {
        // 根据categories生成options
        const options = categories.map( c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        // 获取二级状态列表
        const {isUpdate,product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0'){
            // 获取对应的二级下拉列表
            const subCategories = await this.getCategories(pCategoryId)
            // 生成新的二级下拉列表的options
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联对应的一级option上
            targetOption.children = childOptions
        }

        //更新options的状态
        this.setState({options})
    }

    //提交
    submit = () => {
        this.props.form.validateFields( async (error,values) => {
            if (!error){
            //1:收据数据，并生成product对象
                const {name,desc,price,categoryIds} = values
                //3.通过ref容器调用子组件的方法
                const imgs = this.pictureWall.current.getimgs()   //获取照片名字数组
                const detail = this.richTextEditor.current.getDetail()  //获取富文本编辑返回的HTML字符串
                let pCategoryId,categoryId
                if (categoryIds.length === 1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
                if (this.isUpdate){
                    product._id = this.product._id
                }
            //2：发送请求增加或更新商品
                const result = await reqAddOrUpdateProduct(product)
            //3：根据请求结果操作
                if (result.status === 0){
                    message.success(`${this.isUpdate?'更新':'增加'}商品成功`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate?'更新':'增加'}商品失败`)
                }
            }
        })
    }

    UNSAFE_componentWillMount() {
        // 取ProductHome带过来的product
        const product = this.props.location.state
        //保存是否是update的标识,如果product即表示是从修改来的
        this.isUpdate = !!product

        // 保存带过来的product，如果是增加过来的则为{}
        this.product = product || {}

    }

    componentDidMount() {
        this.getCategories('0')
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {isUpdate,product} = this
        const categoryIds = []
        const {categoryId,pCategoryId,imgs,detail} = product
        // console.log(product)
        if (pCategoryId === '0'){
            categoryIds.push(categoryId)
        }else {
            // 先显示父父分类，再显示子分类
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
        }
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
                                    { min: 3, message: '商品描述最少6位,最多50位!' },
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
                                    {required:true,message:'价格必须输入'},
                                    {validator:this.validatePrice},// 自定义验证规则
                                ]
                            })(<Input placeholder={'请输入商品价格，类型为数值'} type='number' addonAfter="元" />)
                        }
                    </Item>
                    <Item label={'商品分类'}>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: '必须指定商品分类'},
                                ]
                            })(
                                <Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options}  //需要显示的列表数据数组
                                    loadData={this.loadData} //当选择某个列表项, 加载下一级列表的监听回调
                                />
                            )
                        }
                    </Item>
                    <Item label={'商品图片'}>
                        {/*2.交给组价一个ref容器，会自动将组件的实例塞到容器里*/}
                        {/*把product的imgs 交给pictureWall组件*/}
                        <PicturesWall ref = {this.pictureWall} imgs = {imgs} />
                    </Item>
                    {/* 单独设置单个Item的样式
                        labelCol: {
                            xs: { span: 24 },
                            sm: { span: 2 },
                        },
                        wrapperCol: {
                            xs: { span: 24 },
                            sm: { span: 8 },
                        },
                     */}
                    <Item
                        label={'商品详情'}
                        labelCol = {{xs: { span: 24 }, sm: { span: 2 }}}
                        wrapperCol = {{xs: { span: 24 }, sm: { span: 20 }}}
                    >
                        <RichTextEditor ref = {this.richTextEditor} detail = {detail}>
                        </RichTextEditor>
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

/*
子组件调用父组件的方法：将父组件的方法以函数属性传递给子组件，子组件就可以调用
父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
 */