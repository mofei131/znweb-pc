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
  props: {
      typeId: {
        type: [String, Number]
      },
      stId: {
        type: [String, Number]
      },
      approveHisList: {
        type: Array,
        default: []
      },
      nodeStateList: {
        type: Array,
        default: []
      }
  },
    data(){
      return{}
    },
    mounted(){
      if (this.nodeStateList.length == 0) {
        approveNode({
          businessKey: this.stId,
          approvalType: this.typeId
        }).then((res) => {
          JSON.stringify(res.data) == "{}" ? this.nodeStateList = null : this.nodeStateList = res.data;
        });
      }
      if (this.approveHisList.length == 0) {
        approveHistory({
          businessKey: this.stId,
          approvalType: this.typeId
        }).then((res) => {
          this.approveHisList = res.data;
        });
      }
    }
  }
</script>

<style>
</style>
