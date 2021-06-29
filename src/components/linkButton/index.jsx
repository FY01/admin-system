import React from 'react';
import './index.less'
// 链接按钮组件，用于替代不需要超链接功能的a标签
export default function LinkButton(props){
    return(
        <button {...props} className={'link-button'}>
        </button>
    )
}

