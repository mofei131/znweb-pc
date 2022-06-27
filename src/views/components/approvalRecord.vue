<template>
  <div>
    <el-row class="head-title">
      <el-col :span="12">
        <el-form-item label="审批记录"></el-form-item>
      </el-col>
    </el-row>
    <el-row class="head-text" style="width: 100%;">
      <el-col :offset="1">
        <el-table
          ref="singleTable"
          :data="stateList"
          style="width: 90%; margin-bottom: 30px"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column property="nickName" label="审批人">
          </el-table-column>
          <el-table-column property="postName" label="职位">
          </el-table-column>
          <el-table-column property="approvalTime" label="审批时间">
          </el-table-column>
          <el-table-column property="extra.opinion" label="审批说明">
          </el-table-column>
          <el-table-column property="status" label="审批状态">
            <template slot-scope="scope">
              {{scope.row.extra.opt == 'pass'?"已通过":"已拒绝"}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {approveHistory} from "@/api/project/st.js";
  export default{
    props:{
        typeId:Number,
        stId:String
    },
    data(){
      return{
        //审批集合
        stateList: [],
      }
    },
    mounted() {
      approveHistory({
        businessKey:this.stId,
        approvalType:this.typeId
      }).then(res => {
        this.stateList = res.data
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
