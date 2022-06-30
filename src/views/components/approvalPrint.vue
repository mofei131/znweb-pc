<template>
  <div>
    <!--审批流程-->
    <table border="1" width="100%" >
       <tr>
         <td class="title" colspan="6">审批流程</td>
       </tr>
       <table border="1" width="100%" >
       <tr>
         <td class="table-td-title detail">发起人</td>
         <td class="table-td-content" colspan="2">
           <template>{{nodeStateList.initiatorUserName }}</template>
         </td>
         <td class="table-td-title detail">发起时间</td>
         <td class="table-td-content" colspan="2">
           <template>{{nodeStateList.initiatorTime }}</template>
         </td>
       </tr>
       </table>
        <table v-for="item in nodeStateList.rows" border="1" width="100%" >
       <tr>
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
       <!-- </div> -->
     </table>
     <!--审批流程-->
     <table border="1" width="100%">
       <tr>
         <td class="title" colspan="6">审批记录</td>
       </tr>
       <tr>
         <td class="table-td-title detail">审批人</td>
         <td class="table-td-title detail">审批职位</td>
         <td class="table-td-title detail">审批时间</td>
         <td class="table-td-title detail">审批状态</td>
         <td class="table-td-title detail">审批说明</td>

       </tr>
       <tr v-for="(item, idx) in approveHisList" :key="idx">
         <td class="table-td-content" style="text-align: center">
           {{ item.nickName }}
         </td>
         <td class="table-td-content" style="text-align: center">
           {{ item.postName }}
         </td>
         <td class="table-td-content" style="text-align: center">
           {{ item.approvalTime }}
         </td>
         <td class="table-td-content" style="text-align: center">
           {{item.extra==null?"":item.extra.opt == "pass"?"通过":"拒绝"}}
         </td>
         <td
           class="table-td-content"
           style="max-width: 150px; text-align: center"
         >
           {{ item.extra == null?"":item.extra.opinion }}
         </td>
       </tr>
     </table>
  </div>
</template>

<script>
  import {approveNode,approveHistory} from "@/api/project/st.js";
  export default{
    props:{
        typeId:{
          type:[String,Number]
        },
        stId:{
          type:[String,Number]
        }
    },
    data(){
      return{
        approveHisList:[
        // {
        //     "userId": 13,
        //     "userName": null,
        //     "nickName": "张三",
        //     "postId": null,
        //     "postName": "财务",
        //     "approvalTime": "2022-06-22 15:37:49",
        //     "extra": {
        //         "opt": "pass",
        //         "opinion": "没问题",
        //         "post": "财务",
        //         "nickName": "张三"
        //     }
        // },
        // {
        //     "userId": 13,
        //     "userName": null,
        //     "nickName": "张三",
        //     "postId": null,
        //     "postName": "财务",
        //     "approvalTime": "2022-06-22 15:37:49",
        //     "extra": {
        //         "opt": "pass",
        //         "opinion": "没问题",
        //         "post": "财务",
        //         "nickName": "张三"
        //     }
        // },
        // {
        //     "userId": 13,
        //     "userName": null,
        //     "nickName": "张三",
        //     "postId": null,
        //     "postName": "财务",
        //     "approvalTime": "2022-06-22 15:37:49",
        //     "extra": {
        //         "opt": "pass",
        //         "opinion": "没问题",
        //         "post": "财务",
        //         "nickName": "张三"
        //     }
        // }
    ],
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
          //                             opinion: "没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题没问题"
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
    mounted(){
      approveNode({
        businessKey:this.stId,
        approvalType:this.typeId
      }).then((res) => {
        JSON.stringify(res.data) == "{}"?this.nodeStateList = null:this.nodeStateList = res.data;
      });
      approveHistory({
        businessKey:this.stId,
        approvalType:this.typeId
      }).then((res) => {
        this.approveHisList = res.data;
      });
    }
  }
</script>

<style>
</style>
