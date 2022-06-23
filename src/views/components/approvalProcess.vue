<template>
  <div>
    <!--      审批流程·-->
    <el-row class="head-title">
      <el-col :span="12">
        <el-form-item label="审批流程"></el-form-item>
      </el-col>
    </el-row>
    <el-row class="head-text freeWar">
      <el-col style="margin-left: 60px">
        <span>发起人：{{info.initiatorUserName}}</span>
        <span style="margin-left: 60px">发起时间：{{info.initiatorTime}}</span>
      </el-col>
      <el-col :offset="1">
        <el-table
          ref="singleTable"
          :data="info.rows"
          fit
          style="width: 80%; margin-bottom: 30px"
          :header-cell-style="{'text-align':'center','border-bottom':'1px solid #fff','padding':'0','margin':'0'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column>
            <template slot-scope="scope">
              <div class="elTableColumn">{{scope.row.approvalSeq}} 审批人：</div>
              <div class="elTableColumn">{{scope.row.approvalMethod == 'or'?'或签':'会签'}}</div>
              <div class="elTableColumn">{{scope.row.approvalState == 'pass'?'已通过':''}}</div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div v-for="item in scope.row.approvalNodes">{{item.nickName+"("+item.postName+")"}}</div>
            </template>
          </el-table-column>
          <el-table-column label="审批时间">
            <template slot-scope="scope">
              <div v-for="item in scope.row.approvalNodes">{{item.approvalTime}}</div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div v-for="item in scope.row.approvalNodes">
                <div v-if="item.extra.opt == 'pass' ">通过</div>
                <div v-else>拒绝</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div v-for="item in scope.row.approvalNodes">{{item.extra.opinion}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {getApprovalProcessList,approveNode} from "@/api/project/st.js";
export default {
    data(){
        return {
            apList:[],
            info:{},
        }
    },
    props:{
        typeId:Number,
        stId:String
    },
    mounted(){
        this.info={}
        this.apList=[]
        // this.stId
        // this.typeId
        approveNode({
          businessKey:123
        }).then(res => {
            // this.info=res.data[0]
            // res.data.forEach(element => {
            //     this.apList.push(element)
            // });
            this.info = res.data
        })
    },
    methods:{
    }
}
</script>


<style lang="scss">
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
.elTableColumn{
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.freeWar{

  .is-leaf{
       background-color: white!important;
       height: 10px!important;
  }
  .el-table__row:hover > td {
      background-color: #ffffff !important;

  }

  .el-table__row--striped:hover > td {
      background-color: #fafafa !important;

  }
}
</style>
