
/*
格式化日期工具模块
 */
export function formatDateUtils(time){
    if(!time) return ''
    const date = new Date(time)
    // return '2021-6-28 23:43:07'
    if (date.getSeconds() >= 10)
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    else
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`


}
