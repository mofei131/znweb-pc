// 导出页面为图片
import html2Canvas from 'html2canvas'
export default {
    install(Vue, options) {
        Vue.prototype.getImage = function(id) {
            return new Promise((resolve, reject) => {
                html2Canvas(document.querySelector(`#${id}`), {
                    allowTaint: true
                }).then(function(canvas) {
                    let contentWidth = canvas.width
                    let contentHeight = canvas.height
                    let pageHeight = contentWidth / 592.28 * 841.89
                    let leftHeight = contentHeight
                    let position = 0
                    let imgWidth = 595.28
                    let imgHeight = 592.28 / contentWidth * contentHeight
                    let pageData = canvas.toDataURL('image/jpeg', 1.0)
                    resolve(pageData)
                })
            })
        }
    }
}