<template>
  <div>
    <el-form :inline="true" :rules="rules">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="审批类型" prop="processType">
          <el-select
            v-model="processType"
            placeholder="请选择分类"
            @change="processChange"
            :disabled="disabled"
          >
            <el-option
              v-for="dict in processTypeList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    </el-form>
 <div v-for="(item,index) in planList" class="queryForm">
    <el-form :model="item" :inline="true" :rules="rules">
      <div class="formBorder">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="发起人" prop="originatorType">
              <el-select
                v-model="item.initiator"
                filterable
                placeholder="请选择发起人"
                @change="originatorChange($event,index)"
                multiple
                :disabled="disabled"
                value-key="nickName"
              >
                <el-option
                  v-for="(dict,index) in originatorListDate"
                  :key="index"
                  :label="dict.nickName"
                  :value="dict"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item2,index2) in item.nodeList">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item :label="(index2+1)+' 审批人'" class="removeIcon">
              <el-radio-group v-model="item2.scope" v-for="it in typeList" @change="typeChange(index,index2,it.value)">
                <el-radio :label="it.value">{{it.label}}</el-radio>
              </el-radio-group>
              <el-button icon="el-icon-remove" @click="removeApproval(index,index2)"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="item2.scope == 'post'">
          <el-col :span="24">
            <el-cascader
              :disabled="disabled"
              v-model="item2.approverRange"
              :options="deptOptions"
              :key="keyValue"
              :props="{ checkStrictly: true }"
              clearable

              style="width: 300px"
            ></el-cascader>
            <!-- @change="change" -->
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="item2.scope == 'user'">
          <el-col :span="24">
            <el-select
              :disabled="disabled"
              filterable
              v-model="item2.approverRange"
              placeholder="请选择指定人员"
              clearable
              multiple
              style="width: 300px"
              value-key="nickName"
            >
              <el-option
                v-for="(it2,index) in originatorListDate"
                :key="index"
                :label="it2.nickName"
                :value="it2.userId"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="typeClass">
          <el-col :span="24">
            <el-form-item label="审批方式" class="removeIcon">
              <el-radio-group v-model="item2.approvalMethod" v-for="it in modeList" @change="modeChange(index,index2,it.value)">
                <el-radio :label="it.value">{{it.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-button type="primary" @click="addApproval(index)">添加审批</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-checkbox v-model="item.ifCc">审批完成的同时，系统将自动抄送给相关人员</el-checkbox>
          </el-col>
        </el-row>
        <el-form-item v-if="item.ifCc">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="抄送人" class="removeIcon">
                <el-radio-group v-model="item.scope" v-for="it in typeList" @change="copyChange(index,it.value)">
                  <el-radio :label="it.value">{{it.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="item.scope == 'post'">
            <el-col :span="24">
              <el-form-item prop="ccRange">
                <el-cascader
                  :disabled="disabled"
                  v-model="item.ccRange"
                  :options="deptOptions"
                  :key="keyValue"
                  :props="{ checkStrictly: true }"
                  clearable

                  style="width: 300px"
                ></el-cascader>
              </el-form-item>
              <!-- @change="change" -->
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="item.scope == 'user'">
            <el-col :span="24">
              <el-select
                :disabled="disabled"
                v-model="item.ccRange"
                filterable
                placeholder="请选择指定人员"
                clearable
                multiple
                style="width: 300px"
              >
                <el-option
                  v-for="(it2,index) in originatorListDate"
                  :key="index"
                  :label="it2.nickName"
                  :value="it2.userId"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="状态" prop="status">
              <el-radio-group v-model="item.status" v-for="it in stateList" @change="stateChange(index,it.value)">
                <el-radio :label="it.value">{{it.label}}</el-radio>
              </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button icon="el-icon-remove" class="removeForm" @click="removeForm(index)"></el-button>
      </div>
    </el-form>
  </div>
  <el-button type="primary" @click="addProcess">添加审批流程</el-button>
  <div class="putButton">
    <el-button type="info" @click="cancel" >取消</el-button>
    <el-button type="primary" @click="putProcess()">确定</el-button>
  </div>
  </div>
</template>

<script>
  import { treeselects } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {
    selectUserItemByDeptId,
    createProcess,
    reInitiate,
    selectCCAndApproveByProcessId,
    selectDeptInfoByDeptId,
    selectUserNameByDeptIdAndOrder,
    processDefSave,
    listForCombobox,
    getProcessDefInfo
  } from "@/api/approve/index.js";
  export default{
    props: ["mode", "initData"],
    data(){
      return{
        planList:[
          {
            initiatorList:[],//发起人选中
            initiator:[],
            nodeList:[{
              scope:'post',//审批类型
              approverRange:[],//职位
              approvalMethod:'or',//审批方式
              seq:1
            }],
            ifCc: false,//是否添加抄送
            scope:'post',//抄送方式
            ccRange:[],//按职位抄送部门id列表
            status:'1',//状态
            seq:1
          }
        ],
        processType:'',//审批类型选中
        processTypeList:[],//审批类型列表
        initiatorList:[],//发起人选中
        originatorListDate:[],//人员列表
        rules: {
          processType: [{required: true,message: '请选择审批类型',trigger: "blur",}],
          originatorType:[{required: true,message: '请选择发起人',trigger: "blur",}],
          // type:[{required: true,message: '请选择发起人',trigger: "blur",}],
          status:[{required: true,message: '状态必选',trigger: "blur",}],
        },
        disabled:false,
        typeList:[{
          value:'post',
          label:'按职位'
        },{
          value:'user',
          label:'按指定人员'
        }],//审批类型下拉
        modeList:[{
          value:'or',
          label:'或签'
        },{
          value:'and',
          label:'会签'
        }],//审批方式下拉
        stateList:[{
          value:'1',
          label:'启用'
        },{
          value:'0',
          label:'禁用'
        }],//状态列表
        deptOptions: [],//一级部门
        deptOptions1: [],//二级部门,
        deptOptionscc: [],//三级部门
        keyValue: 0,
        userList:[{
          value:1,
          label:'莫非'
        },{
          value:2,
          label:'莫非2'
        }],
      }
    },
    created() {
      this.getUserList()
      this.getDictsList()
      this.getTreeselect();
    },
    methods:{
      //获取审批流程内容
      init(){
       //编辑内容
       if(this.mode == 'reInitiate'){
         this.processChange()
         getProcessDefInfo(this.initData.id).then((res) => {
           if(res.code == 200){
             this.processType = res.data.approvalType
             this.planList = res.data.planList
             this.planList.forEach((item,index) =>{
              this.planList[index].initiator = []
               item.initiatorList.forEach((item2,index2) =>{
                 this.planList[index].initiator.push(
                  this.originatorListDate[this.originatorListDate.findIndex((it) => it.userId == item2.initiatorUserId)]
                 )
                 // console.log(this.planList[index].initiator)
               })
             })
           }else{
             that.$message.error(res.msg)
           }
         })
       }else if(this.mode == "create"){
         this.processChange()
       }
      },
      //获取所有人员列表
      getUserList(){
        listForCombobox().then((res) => {
          this.originatorListDate = res
          this.init();
        });
      },
      //获取流程类型
      getDictsList(){
        this.getDicts("process_type").then((response) => {
          this.processTypeList = response.data;
        });
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselects().then((response) => {
          this.deptOptions = response.data;
          this.deptOptions1 = response.data;
          this.deptOptionscc = response.data;
        });
      },
      //获取审批类型
      typeChange(index,index2,val){
        this.planList[index].nodeList[index2].scope = val
        this.planList[index].nodeList[index2].approverRange = []
        // this.approvalSelect = val
        // console.log(this.planList[index].nodeList[index2].approverRange)
      },
      modeChange(index,index2,val){
        this.planList[index].nodeList[index2].approvalMethod = val
      },
      //选择抄送方式
      copyChange(index,it){
        this.planList[index].scope = it
        this.planList[index].ccRange = []
        // this.copySelect = it
      },
      //状态选择
      stateChange(index,it){
        this.planList[index].status = it
      },
      //删除列表审批
      removeApproval(index,index2){
        if(this.planList[index].nodeList.length > 1){
          this.planList[index].nodeList.splice(index2,1)
        }
      },
      //删除添加的审批流程
      removeForm(index){
        if(this.planList.length > 1){
          this.planList.splice(index,1)
        }
      },
      //添加审批步骤
      addApproval(index){
        console.log(index)
        let list = {
          scope:'post',//审批类型
          approverRange:[],//职位
          approvalMethod:'or',//审批方式
          seq:this.planList[index].nodeList.length+1
        }
        // this.approvalSelect = 'post',//选择的审批方式
        this.planList[index].nodeList.push(list)
      },
      //添加审批流程
      addProcess(){
        let process = {
          processType:'',//审批类型选中
          initiatorList:[],//发起人选中
          nodeList:[{
            scope:'post',//审批类型
            approverRange:[],//职位
            approvalMethod:'or',//审批方式
          }],
          ifCc: false,//是否添加抄送
          scope:'post',//抄送方式
          ccRange:[],//按职位抄送部门id列表
          status:'1',//状态
          seq:this.planList.length+1
        }
        // this.copySelect = 'post',//选择抄送方式
        this.planList.push(process)
      },
      //提交流程
      putProcess(){
        let that = this
        if(this.processType == ''){
          that.$message.error("请选择审批类型")
          return
        }
        this.planList.forEach(function(item,index){
          if(item.initiatorList .length < 1){
            that.$message.error("请选择"+(index+1)+"流程中发起人")
            return
          }
          if(item.ifCc && item.ccRange.length < 1){
             that.$message.error("请选择"+(index+1)+"流程中抄送部门或人员")
            return
          }
          item.nodeList.forEach(function(item2,index2){
            if(item2.approverRange < 1){
              that.$message.error("请选择"+(index2+1)+"审批中部门或人员")
              return
            }
          })
        })
        processDefSave({
          id:this.mode == 'reInitiate'?this.initData.id:null,
          approvalType:this.processType,
          planList:this.planList
        }).then((res) => {
          if(res.code == 200){
            that.$message.success(res.msg)
            this.$emit("popOk");
          }
        });
      },
      //关闭弹框
      cancel(){
        this.$emit("popOk");
      },
      //获取发起人选中是对象
      originatorChange(item,index){
        this.$forceUpdate()
        let list = []
        item.forEach(function(item2,index2){
          list.push({
            initiatorUserId:item2.userId,
            initiatorUserName:item2.nickName
          })
        })
        this.planList[index].initiatorList = list

      },
      //切换审批类型后初始化
      processChange(){
        this.planList = [{
          processType:'',//审批类型选中
          initiatorList:[],//发起人选中
          nodeList:[{
            scope:'post',//审批类型
            approverRange:[],//职位
            approvalMethod:'or',//审批方式
          }],
          ifCc: false,//是否添加抄送
          scope:'post',//抄送方式
          ccRange:[],//按职位抄送部门id列表
          status:'1',//状态
          seq:1
        }]
      }
    },
  }
</script>

<style scoped lang="scss">
  .formBorder{
    border: 1px solid #666;
    padding: 20px;
    position: relative;
  }
  .removeIcon{
    .el-button--medium{
      border: 0;
    }
  }
  .putButton{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .removeForm{
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .queryForm{
    margin-bottom: 20px;
    .el-radio-group{
      margin-right: 20px;
    }
    .el-button{
      margin-bottom: 20px;
    }
    .el-form-item{
      margin-bottom: 0px;
    }
    .typeClass{
      margin-bottom: 20px;
    }
  }
</style>
