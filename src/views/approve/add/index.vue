<template>
  <div>
 <div v-for="(item,index) in queryParams">
    <el-form :model="item" :inline="true" :rules="rules">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="流程类型" prop="processType">
            <el-select
              v-model="item.processType"
              placeholder="请选择分类"
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
      <div class="formBorder">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="发起人" prop="originatorType">
              <el-select
                v-model="item.originatorType"
                placeholder="请选择发起人"
                multiple
                :disabled="disabled"
              >
                <el-option
                  v-for="dict in originatorList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item2,index2) in item.approval">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item :label="(index2+1)+' 审批人'" class="removeIcon">
              <el-radio-group v-model="item2.type" v-for="it in typeList" @change="typeChange(index,index2,it)">
                <el-radio :label="it">{{it}}</el-radio>
              </el-radio-group>
              <el-button icon="el-icon-remove" @click="removeApproval(index,index2)"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="approvalSelect == '按职位'">
          <el-col :span="24">
            <el-cascader
              :disabled="disabled"
              v-model="item2.deptId"
              :options="deptOptions"
              :key="keyValue"
              :props="{ checkStrictly: true }"
              clearable

              style="width: 300px"
            ></el-cascader>
            <!-- @change="change" -->
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="approvalSelect == '按指定人员'">
          <el-col :span="24">
            <el-select
              :disabled="disabled"
              v-model="item2.personnel"
              placeholder="请选择指定人员"
              clearable
              multiple
              style="width: 300px"
            >
              <el-option
                v-for="it2 in userList"
                :key="it2.value"
                :label="it2.label"
                :value="it2.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="审批方式" class="removeIcon">
              <el-radio-group v-model="item2.mode" v-for="it in modeList" @change="modeChange(index,index2,it)">
                <el-radio :label="it">{{it}}</el-radio>
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
      </div>
    </el-form>
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
  } from "@/api/approve/index.js";
  export default{
    data(){
      return{
        queryParams:[
          {
            processType:'',//审批类型选中
            originator:[],//发起人选中
            approval:[{
              type:'按职位',//审批类型
              deptId:[],//职位
              personnel:'',//人员
              mode:'或签',//审批方式
            }]
          }
        ],
        processTypeList:[],//审批类型列表
        originatorList:[{
          value:1,
          label:'发起人1'
        },{
          value:2,
          label:'发起人2'
        }],
        rules: {
          processType: [{required: true,message: '请选择审批类型',trigger: "blur",}],
          originatorType:[{required: true,message: '请选择发起人',trigger: "blur",}],
          // type:[{required: true,message: '请选择发起人',trigger: "blur",}],
        },
        disabled:false,
        typeList:['按职位','按指定人员'],//审批类型下拉
        modeList:['或签','会签'],//审批方式下拉
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
        approvalSelect:'按职位',//选择的审批方式
      }
    },
    created() {
      this.getDictsList()
      this.getTreeselect();
    },
    methods:{
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
        this.queryParams[index].approval[index2].type = val
        this.approvalSelect = val
        // console.log(this.queryParams[index].approval[index2].deptId)
      },
      modeChange(index,index2,val){
        this.queryParams[index].approval[index2].mode = val
      },
      //删除列表审批
      removeApproval(index,index2){
        if(this.queryParams[index].approval.length > 1){
          this.queryParams[index].approval.splice(index2,1)
        }
      },
      //添加审批步骤
      addApproval(index){
        console.log(index)
        let list = {
          type:'按职位',//审批类型
          deptId:[],//职位
          personnel:'',//人员
          mode:'或签',//审批方式
        }
        this.queryParams[index].approval.push(list)
      }
    },
  }
</script>

<style scoped lang="scss">
  .formBorder{
    border: 1px solid #666;
    padding: 20px;
  }
  .removeIcon{
    .el-button--medium{
      border: 0;
    }
  }
</style>
