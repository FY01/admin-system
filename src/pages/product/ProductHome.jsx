import React, {Component} from 'react';
import {
    Card,
    Select,
    Button,
    Table,
    Icon,
    Input
}from 'antd'
import LinkButton from "../../components/linkButton";
import {reqProducts,reqSearchProducts} from "../../api";
import {PAGE_SIZE} from '../../utils/constant'
/*
商品管理路由主界面
 */
const Option = Select.Option

export default class ProductHome extends Component {
    state = {
        isLoading:false,
        total: 0,  //商品的总数量
        products:[], //商品的数组
        searchName:'',//搜索的名字
        searchType:'productName'    //搜索的类型：productName、productDesc
    }

    // 初始化列的标签
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                width:100,
                dataIndex: 'price',
                render:(price) => {
                    return '￥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
                }
            },
            {
                title: '状态',
                width:100,
                dataIndex: 'status',
                render:(status) => {
                    return (
                        <span>
                            <Button type={'primary'}>下架</Button>
                            <span>在售</span>
                        </span>

                    )
                }
            },
            {
                title: '操作',
                width: 100,
                dataIndex: '',
                render:() => {
                    return (
                        <span>
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>

                    )
                }
            }
        ];
    }

    // 获取商品数据列表
    getProducts = async (pageNum,pageSize=PAGE_SIZE) => {
        this.setState({isLoading:true})
        const {searchName,searchType} = this.state

        let result
        if (searchName !== ''){
            // 如果searchName 不为空，发搜索商品搜索请求
            result = await reqSearchProducts({
                pageNum, pageSize,searchName,searchType
            })
        }else {
            // 如果searchName为空，发一般商品列表请求
            result = await reqProducts(pageNum,pageSize)
        }

        this.setState({isLoading:false})
        //取出分页数据，显示分页列表
        if (result.status === 0){
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns(1)
    }
    componentDidMount() {
        //组件完成挂载，即获取商品列表，默认页码1，每页3个数据
        this.getProducts(1)
    }

    render() {
        const {products,total,isLoading,searchName,searchType} =this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width:150}}
                    //获取搜索类型
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value= 'productName'>按名称搜索</Option>
                    <Option value= 'productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width:150,marginRight:15,marginLeft:15}}
                    value={searchName}
                    //获取搜索类型
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type={'primary'} onClick={() => {this.getProducts(1)}}>
                    搜索
                </Button>
            </span>
        )
        const extra = (
            <Button type={'primary'}>
                <Icon type={'plus'}/>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={isLoading}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper:true,
                        total,
                        //当页码发生改变时调用回调函数，接收两个参数（改变后的页码page，pageSize）
                        // onChange: (pageNum) => { this.getProducts(pageNum)}
                        onChange: this.getProducts  //简写形式，当实参和形参一致时
                    }}
                />;
            </Card>
        );
    }
}


