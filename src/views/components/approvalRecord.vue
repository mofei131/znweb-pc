<template>
  <div>
    <el-row class="head-title">
      <el-col :span="12">
        <el-form-item label="审批记录"></el-form-item>
      </el-col>
    </el-row>
    <el-row class="head-text">
      <el-col :offset="1">
        <el-table
          ref="singleTable"
          :data="stateList"
          style="width: 80%; margin-bottom: 30px"
        >
          <el-table-column property="deptName" label="部门">
          </el-table-column>
          <el-table-column property="nickName" label="审批人">
          </el-table-column>
          <el-table-column property="approveTime" label="审批时间">
          </el-table-column>
          <el-table-column property="processValue" label="审批说明">
          </el-table-column>
          <el-table-column property="status" label="审批状态">
            <template slot-scope="scope">
              {{
                scope.row.status == 0
                  ? "已打回"
                  : scope.row.status == 1
                  ? "已通过"
                  : scope.row.status == 5
                  ? "已撤回"
                  : ""
              }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getProcessDataByStId } from "@/api/approve";
  export default{
    props:{
        typeId:Number,
        stId:String
    },
    data(){
      return{
        //审批集合
        stateList: [{"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                    {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                    {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"","state":"未审批"}],
      }
    },
    mounted() {
      getProcessDataByStId(this.typeId, this.stId).then((res) => {
        this.stateList = res.data;
      });
    }
  }
</script>

<style>
</style>
