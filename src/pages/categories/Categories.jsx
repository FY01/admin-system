import React, {Component} from 'react';
/*
品类管理路由
 */
import {
    Card,
    Table,
    Button,
    Icon,
    message
} from 'antd'
import LinkButton from "../../components/linkButton";
import {reqCategories} from "../../api";

export default class Categories extends Component {

    state = {
        categories:[],  //一级分类列表
        subCategories:[], //二级分类列表
        parentId:'0', // 父级菜单的id
        parentName:'',
        isLoading:false  //是否正在获取一级列表中
    }

    // 初始化table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name'
            },
            {
                title: '操作',
                width:300, // 控制列的大小，默认单位px
                dataIndex: '',
                key: 'x',
                // 这里的render函数可以传递一个参数代表当前列
                render: (category) => (
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        {/*点击显示二级列表，
                        向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据*/}
                        {
                            this.state.parentId ==='0'? <LinkButton onClick = {() => {this.showSubCategories(category)}}>查看子分类</LinkButton>:null
                        }

                    </span>
                )
            },
        ];
    }
    //显示二级列表,注意setState（）是异步操作，并不会马上更新状态，要把操作方法放在setState的回调函数里
    showSubCategories = (category) => {
        this.setState({
            parentId:category._id,
            parentName:category.name
        },() => {
        //    回调函数在状态更新且render后执行
            this.getCategories()

        })
        // console.log(this.state.parentId)  这里的状态还没有更新
    }

    //回到一级菜单
    showSupCategory = () => {
        this.setState({
            parentId:'0',
            parentName:'',
            subCategories:[]
        })
    }

    //获取所有一级、二级分类列表
    getCategories = async () => {
        // 在请求前，isLoading未完成
        this.setState({isLoading:true})

        const {parentId} = this.state
        const result = await reqCategories(parentId)

        // 在请求后，isLoading完成
        this.setState({isLoading:false})

        if (result.status === 0){
            //获取到分类列表
            const categories = result.data
            //如果parentID为0，更新一级列表
            if (parentId === '0') {
                this.setState({categories})
            }else {
                // 否则更新二级列表
                this.setState({subCategories:categories})
            }
        }else {
            message.error('获取一级列表失败')
        }
    }

    // 为第一次render做数据准备
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    // 执行异步请求：发异步ajax请求获取分类列表
    componentDidMount() {
        // 获取一级分类列表
        this.getCategories()
    }

    render() {
        const {categories,isLoading,parentId,parentName,subCategories} = this.state
        // card的左侧
        const title = parentId === '0'?'一级分类列表':(
            <span>
                <LinkButton onClick = {this.showSupCategory}>一级分类列表</LinkButton>
                <Icon type = {'arrow-right'} style={{marginRight:'5px'}}/>
                <span >{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button type={'primary'} >
                <Icon type={'plus'}/>
               添加
            </Button>)


        return (
            <Card title={title} extra={extra}>
                <Table
                    // 添加边框
                    bordered={true}
                    // 给每一行添加一个key
                    rowKey={'_id'}
                    //是否在一级列表没加载完之前显示loading图片
                    loading={isLoading}
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    //配置分页参数，和是否显示快速跳转页面
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                />
            </Card>
        );
    }
}

