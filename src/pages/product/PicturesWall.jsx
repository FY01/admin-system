import React from "react";
import { Upload, Icon, Modal, message } from 'antd';
import { PropTypes } from 'prop-types'
/*
用于上传图片的组件
 */
import { reqDeleteImg } from "../../api";
import { BASE_IMG_URL } from "../../utils/constant";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor(props) {
        super(props);

        //取得已经有的图片列表，进行加工初始化
        let fileList = []
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }

        this.state = {
            previewVisible: false,  //标识是否显示大图预览的Modal
            previewImage: '',//大图的url
            fileList
        };
    }

    //传递给父组件调用，以收集已上传文件的文件名数组
    getimgs = () => {
        return this.state.fileList.map(file => {
            return file.name
        })
    }

    //隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        //指定file对应的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /*
    file：当前操作上传的图片文件（上传、删除）
    fileList：所有已上传文件对象的数组
    file并不是fileList数组的最后一个元素，他们是内容相等的两个对象
     */
    handleChange = async ({ file, fileList }) => {
        // console.log(file,file.status,fileList.length)

        //修改上传图片的name和url以符合服务器要求，然后保存到图片数组中
        if (file.status === 'done') {
            const result = file.response     //response里有{status:0,data:{name:'xxx.jpg',url:'xxx'}}
            if (result.status === 0) {
                const { name, url } = result.data
                const fileInList = fileList[fileList.length - 1]
                fileInList.name = name
                fileInList.url = url
            }

        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload" //上传图片的接口地址
                    accept='image/*'  //只接收的文件格式，其他格式的文件不会显示
                    name='image' //请求的参数名
                    listType="picture-card"  // 图片的表现形式
                    fileList={fileList}  //所有已上传文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}     {/*限制可以上传图片的数量*/}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
/*todo
    有一个bug，删除图片后依然获取原来的imgs
 */