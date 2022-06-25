<template>
  <div>
    <!--审批流程-->
    <table border="1" width="100%" v-if="printData.nodeStateList != null">
       <tr>
         <td class="title" colspan="6">审批流程</td>
       </tr>
       <tr>
         <td class="table-td-title detail">发起人</td>
         <td class="table-td-content" colspan="2">
           <template>{{ printData.nodeStateList.initiatorUserName }}</template>
         </td>
         <td class="table-td-title detail">发起时间</td>
         <td class="table-td-content" colspan="2">
           <template>{{ printData.nodeStateList.initiatorTime }}</template>
         </td>
       </tr>
       <tr>
         <td class="title" colspan="6">1审批人 会签</td>
       </tr>
       <tr>
         <td class="table-td-title detail">审批人</td>
         <td class="table-td-title detail">审批时间</td>
         <td class="table-td-title detail">审批状态</td>
         <td class="table-td-title detail">审批说明</td>
       </tr>
       <tr v-for="(item, idx) in printData.nodeStateList.rows" :key="idx">
         <td class="table-td-content" style="text-align: center">
           {{ item.nickName+"("+item.postName+")" }}
         </td>
         <td class="table-td-content" style="text-align: center">
           {{ item.approvalTime }}
         </td>
         <td class="table-td-content" style="text-align: center">
           {{item.extra == null?"":(item.extra.opt == 'pass'?'通过':'拒绝')}}
         </td>
         <td
           class="table-td-content"
           style="max-width: 150px; text-align: center"
         >
           {{ item.extra == null?"--":item.extra.opinion }}
         </td>

       </tr>
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
       <tr v-for="(item, idx) in printData.approveHisList" :key="idx">
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
        printData:[]
      }
    },
    mounted(){
      approveNode({
        businessKey:this.stId,
        approvalType:this.typeId
      }).then((res) => {
        JSON.stringify(res.data) == "{}"?this.printData.nodeStateList = null:this.printData.nodeStateList = res.data;
      });
      approveHistory({
        businessKey:this.stId,
        approvalType:this.typeId
      }).then((res) => {
        this.printData.approveHisList = res.data;
      });
    }
  }
</script>

<style>
</style>
