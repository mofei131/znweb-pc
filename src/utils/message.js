import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';

function BusinessMessage() {
    this.init;
    this.messages;
};
BusinessMessage.prototype = {
    get: function(id, args) {
        if (!this.init) {
            this.messages = new Array();
            this.messages['E000001'] = "请输入{0}。";


            this.messages['EC00001'] = "请输入用户名和密码。";
            this.messages['EC00002'] = "用户名或密码错误，请重新输入。";
            this.messages['EC00003'] = "更新失败，请重试。";
            this.messages['EC00004'] = "删除失败，请重试。";
            this.messages['EC00005'] = "公司名已存在请重新输入。";
            this.messages['EC00006'] = "公司名称不能为空，请重新输入公司名称。";
            this.messages['EC00007'] = "公司所在地不能为空，请重新输入公司所在地。";
            this.messages['EC00008'] = "添加失败";
            this.messages['EC00009'] = "必填项，不能为空";
            this.messages['EC00010'] = "账号不能为空";
            this.messages['EC00011'] = "密码不能为空";
            this.messages['EC00012'] = "确认密码不能为空";


            this.messages['S000001'] = "更新成功。";
            this.messages['S000002'] = "删除成功。";
            this.messages['S000004'] = "密码一致";
            this.messages['S000005'] = "已取消删除";
            this.messages['S000006'] = "已取消保存";
            this.messages['S000007'] = "已取消更新";
            this.messages['S000008'] = "转换成功。";
            this.messages['S000009'] = "{0}上传成功，请到{1}列表进行相关操作。";
            this.messages['S000010'] = "添加成功。";
            this.messages['S000011'] = "提交成功。";
            this.messages['S000012'] = "流程审批通过";
            this.messages['S000013'] = "流程审批驳回";
            this.messages['S000014'] = "流程审批终止";
            this.messages['S000015'] = "发送成功";
            this.messages['S000016'] = "已取消收藏";
            this.messages['S000017'] = "任务已完成";

            this.messages['S000003'] = "{0}成功。";

            this.messages['W000001'] = "确定要删除数据吗？";
            this.messages['W000002'] = "确定要保存数据吗？";
            this.messages['W000003'] = "该行数据不能为空，请重新操作";
            this.messages['W000004'] = "该行不能被删除，请重新操作";




            this.init = true;
        }
        var message = this.messages[id];
        if (!message && message !== "") {
            return id;
        }
        if (args) {
            if (typeof args == "object" && args.length) {
                for (var i = 0; i < args.length; i++) {
                    var pattern = new RegExp("\\{" + i + "\\}", "g");
                    message = message.replace(pattern, args[i]);
                }
            } else {
                message = message.replace(/\{0\}/g, args);
            }
        }
        return message;
    },
    message: function(id, args) {
        if (id.indexOf("E") == 0) {
            return Message({
                message: this.get(id, args),
                type: "error"
            });
        } else if (id.indexOf("W") == 0) {
            return Message({
                message: this.get(id, args),
                type: "warning"
            });
        } else if (id.indexOf("S") == 0) {
            return Message({
                message: this.get(id, args),
                type: "success"
            });
        } else {
            return Message({
                message: this.get(id, args),
                type: "info"
            });
        }
    },
    messageBox: function(id, args) {
        if (id.indexOf("E") == 0) {
            return MessageBox.alert(this.get(id, args), '错误', {
                confirmButtonText: '确定',
                confirmButtonClass: 'el-button--mini',
                type: 'error'
            })
        } else if (id.indexOf("W") == 0) {
            return MessageBox.confirm(this.get(id, args), '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'el-button--mini white-button',
                confirmButtonClass: 'el-button--mini',
                type: 'warning'
            });
        } else if (id.indexOf("S") == 0) {
            return MessageBox.alert(this.get(id, args), '错误', {
                confirmButtonText: '确定',
                confirmButtonClass: 'el-button--mini',
                type: 'success'
            })
        } else {
            return MessageBox.alert(this.get(id, args), '提示', {
                confirmButtonText: '确定',
                confirmButtonClass: 'el-button--mini',
                type: 'info'
            })
        }
    }
};

var businessMessage = new BusinessMessage();
export default businessMessage