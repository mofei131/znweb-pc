<template>
  <div>
    <!--      审批流程·-->
    <el-row class="head-title">
      <el-col :span="12">
        <el-form-item label="审批流程"></el-form-item>
      </el-col>
    </el-row>
    <el-row class="head-text">
      <el-col style="margin-left: 60px">
        <span>发起人：{{info.sponsor}}</span>
        <span style="margin-left: 60px">发起时间：{{info.initiateTime}}</span>
      </el-col>
      <el-col :offset="1">
        <el-table
          ref="singleTable"
          :data="apList"
          style="width: 80%; margin-bottom: 30px"
        >
        <el-table-column type="index" label="部门1">
          <template slot-scope="scope">
            <div>{{scope.$index}}</div>
          </template>
        </el-table-column>
          <el-table-column property="deptName" label="部门"> </el-table-column>
          <el-table-column property="shouldApprovePerson" label="应审批人">
          </el-table-column>
          <el-table-column property="nickName" label="审批人">
          </el-table-column>
          <el-table-column property="approveTime" label="审批时间">
          </el-table-column>
          <el-table-column property="processValue" label="审批说明">
          </el-table-column>
          <el-table-column property="status" label="审批状态">
            <template slot-scope="scope">
              {{ scope.row.status == 0 ? "已审批" : scope.row.status == 1 ? "已审批":scope.row.status == -1 ? "待审批" :scope.row.status == '' ? "未审批":scope.row.status == -1 ? "待审批" :scope.row.status == null ? "未审批":scope.row.status == -1 ? "待审批" :scope.row.status == undefined ? "未审批":""}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {getApprovalProcessList} from "@/api/project/st.js";
export default {
    data(){
        return {
            apList:[{
              deptName:'部门',
              shouldApprovePerson:'应审批人',
              nickName:'审批人',
              approveTime:'2021-00-00',
              processValue:'审批说明',
              status:1
            },{
              deptName:'部门',
              shouldApprovePerson:'应审批人',
              nickName:'审批人',
              approveTime:'2021-00-00',
              processValue:'审批说明',
              status:1
            },{
              deptName:'部门',
              shouldApprovePerson:'应审批人',
              nickName:'审批人',
              approveTime:'2021-00-00',
              processValue:'审批说明',
              status:1
            }],
            info:{},
        }
    },
    props:{
        typeId:Number,
        stId:String
    },
    mounted(){
        this.info={}
        // this.apList=[]
        // getApprovalProcessList(this.typeId,this.stId).then(res=>{
        //     this.info=res.data[0]
        //     res.data.forEach(element => {
        //         this.apList.push(element)
        //     });
        // })
    },
    methods:{
    }
}
</script>


<style>
.head-title {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
  margin-top: 30px;
  margin-left: 20px;
}
.head-text {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 53px;
}
</style>
