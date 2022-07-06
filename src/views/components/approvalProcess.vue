<template>
  <div>
    <!--      审批流程·-->
    <el-row class="head-title">
      <el-col :span="12">
        <el-form-item label="审批流程"></el-form-item>
      </el-col>
    </el-row>
    <table width="90%" cellpadding="0" cellspacing="0" class="newprotitle">
    <tr>
      <td class="table-td-title detail">发起人</td>
      <td class="table-td-content" colspan="2" style="min-width: 200px;">
        <template>{{nodeStateList.initiatorUserName }}</template>
      </td>
      <td class="table-td-title detail">发起时间</td>
      <td class="table-td-content" colspan="2" style="min-width: 200px;">
        <template>{{nodeStateList.initiatorTime }}</template>
      </td>
    </tr>
    </table>
     <table v-for="item in nodeStateList.rows" width="90%" cellpadding="0" cellspacing="0" class="newpro" >
    <tr class="signature">
      <td class="title" colspan="6" style="text-align: start;padding-left: 40px;">
      {{
       item.approvalSeq + "审批 " + (item.approvalMethod == "and"?'会签':'或签')

      }}
      </td>
    </tr>
    <tr>
      <td class="table-td-title detail">审批人</td>
      <td class="table-td-title detail">审批时间</td>
      <td class="table-td-title detail">审批状态</td>
      <td class="table-td-title detail">审批说明</td>
    </tr>
    <tr v-for="(item2, idx) in item.approvalNodes" :key="idx">
      <td class="table-td-content" style="text-align: center;" >
        {{ item2.nickName+"("+item2.postName+")" }}
      </td>
      <td class="table-td-content" style="text-align: center;">
        {{ item2.approvalTime }}
      </td>
      <td class="table-td-content" style="text-align: center;">
        {{item2.extra == null?"":(item2.extra.opt == 'pass'?'通过':'拒绝')}}
      </td>
      <td
        class="table-td-content"
        style="max-width: 150px; text-align: center;"
      >
        {{ item2.extra == null?"--":item2.extra.opinion }}
      </td>
    </tr>
    </table>
    <!-- <el-row class="head-text freeWar">
      <el-col style="margin-left: 60px;display: flex;align-items: center;justify-content: flex-start;">
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
              <div class="elTableColumn" v-for="item in scope.row.approvalNodes">{{item.nickName+"("+item.postName+")"}}</div>
            </template>
          </el-table-column>
          <el-table-column label="审批时间">
            <template slot-scope="scope">
              <div class="elTableColumn" v-for="item in scope.row.approvalNodes">{{item.approvalTime}}</div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div class="elTableColumn" v-for="item in scope.row.approvalNodes">
                {{item.extra != null?(item.extra.opt == 'pass'?'通过':'拒绝'):''}}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div class="elTableColumn" v-for="item in scope.row.approvalNodes">{{item.extra != null?item.extra.opinion:''}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import {getApprovalProcessList,approveNode} from "@/api/project/st.js";
export default {
    data(){
        return {
            apList:[],
            info:{},
            nodeStateList:{
              // initiatorUserId: "4",
              //         initiatorUserName: "张三",
              //         initiatorTime: "2022-06-22 15:37:39",
              //         rows: [
              //             {
              //                 approvalNodes: [
              //                     {
              //                         userId: 13,
              //                         userName: "13964649592",
              //                         nickName: "袁义宇",
              //                         postId: 17,
              //                         postName: "运营专员",
              //                         approvalTime: "2022-06-22 15:37:49",
              //                         extra: {
              //                             opt: "pass",
              //                             opinion: "没问题没问题"
              //                         }
              //                     },
              //                     {
              //                         userId: 13,
              //                         userName: "13964649592",
              //                         nickName: "袁义宇",
              //                         postId: 17,
              //                         postName: "运营专员",
              //                         approvalTime: "2022-06-22 15:37:49",
              //                         extra: {
              //                             opt: "pass",
              //                             opinion: "没问题"
              //                         }
              //                     },
              //                     {
              //                         userId: 13,
              //                         userName: "13964649592",
              //                         nickName: "袁义宇",
              //                         postId: 17,
              //                         postName: "运营专员",
              //                         approvalTime: "2022-06-22 15:37:49",
              //                         extra: {
              //                             opt: "pass",
              //                             opinion: "没问题"
              //                         }
              //                     }
              //                 ],
              //                 approvalSeq: 1,
              //                 approvalState: "pass",
              //                 approvalMethod: "and"
              //             },
              //             {
              //                 approvalNodes: [
              //                     {
              //                         userId: 13,
              //                         userName: "13964649592",
              //                         nickName: "袁义宇",
              //                         postId: 17,
              //                         postName: "运营专员",
              //                         approvalTime: "2022-06-22 15:37:49",
              //                         extra: {
              //                             opt: "pass",
              //                             opinion: "没问题"
              //                         }
              //                     }
              //                 ],
              //                 approvalSeq: 2,
              //                 approvalState: "pass",
              //                 approvalMethod: "and"
              //             },
              //             {
              //                 approvalNodes: [
              //                     {
              //                         userId: 13,
              //                         userName: "13964649592",
              //                         nickName: "袁义宇",
              //                         postId: 17,
              //                         postName: "运营专员",
              //                         approvalTime: "2022-06-22 15:37:49",
              //                         extra: {
              //                             opt: "pass",
              //                             opinion: "没问题"
              //                         }
              //                     }
              //                 ],
              //                 approvalSeq: 3,
              //                 approvalState: "pass",
              //                 approvalMethod: "and"
              //             }
              //         ]
            }
        }
    },
    props:{
        typeId:Number,
        stId:String
    },
    mounted(){
        this.info={}
        this.apList=[]
        approveNode({
          businessKey:this.stId,
          approvalType:this.typeId
        }).then(res => {
            this.nodeStateList = res.data
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
.newprotitle{
  border-left: 1px solid #dfe6ec;
  border-top: 1px solid #dfe6ec;
}
.newpro {
  border-left: 1px solid #dfe6ec;
}
.newpro,.newprotitle{
  margin: auto;
  td{
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
    text-align: center;
    padding: 10px 0;
  }
  .signature{
    background-color: #f8f8f9;
  }
}
</style>
