<template>
  <div class="app-container">
    <div class="top">
      <el-form :model="queryParams" ref="ruleForm" :inline="true" label-width="80px">
        <el-form-item label="流程名称">
          <el-input v-model="queryParams.processName" placeholder="请输入流程名称"></el-input>
        </el-form-item>
        <el-form-item label="流程类型">
          <el-select v-model="queryParams.approvalType" placeholder="请选择分类">
            <el-option v-for="dict in processTypeList" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发起人">
          <el-input v-model="queryParams.initiatorUserName" placeholder="请输入发起人"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="initiateData">
        <el-table-column label="流程名称" align="center" prop="processName" />
        <el-table-column label="流程类型" align="center" prop="processTypeLabel">
          <!-- <template slot-scope="scope">
            {{
              scope.row.approvalType == "1"
                ? "新增业务"
                : scope.row.approvalType == "2"
                ? "项目业务"
                : scope.row.approvalType == "3"
                ? "合同管理"
                : scope.row.approvalType == "4"
                ? "预付款管理"
                : scope.row.approvalType == "5"
                ? "最终付款管理"
                : scope.row.approvalType == "6"
                ? "预估收款"
                : scope.row.approvalType == "7"
                ? "保证金管理"
                : scope.row.approvalType == "8"
                ? "资金计划"
                : scope.row.approvalType == "9"
                ? "物流付款"
                : scope.row.approvalType == "10"
                ? "初次质量单"
                : scope.row.approvalType == "11"
                ? "电厂质量单"
                : scope.row.approvalType == "12"
                ? "供应商管理"
                : scope.row.approvalType == "13"
                ? "用煤单位"
                : scope.row.approvalType == "14"
                ? "收票记录"
                : scope.row.approvalType == "15"
                ? "开票申请"
                : scope.row.approvalType == "16"
                ? "期间费用"
                : scope.row.approvalType == "17"
                ? "实际收款"
                : scope.row.approvalType == "18"
                ? "投标申请"
                : scope.row.approvalType == "19"
                ? "退款管理"
                : scope.row.approvalType == "20"
                ? "项目立项"
                : ""
            }}
          </template> -->
        </el-table-column>
        <el-table-column label="发起时间" align="center" prop="initiatorTime" />
        <!--        <el-table-column label="审批人" align="center" prop="nickName" />-->
        <el-table-column label="状态" align="center" prop="state">
          <template slot-scope="scope">
            <el-tag :type="
              scope.row.state == '1'
                ? 'info'
                : scope.row.state == '2'
                ? 'warning'
                : scope.row.state == '3'
                ? 'success'
                : scope.row.state == '4'
                ? 'danger'
                : scope.row.state == '5'
                ? 'warning'
                : ''
            ">
              {{
              scope.row.state == "1"
              ? "未审批"
              : scope.row.state == "2"
              ? "审批中"
              : scope.row.state == "3"
              ? "已通过"
              : scope.row.state == "4"
              ? "已打回"
              : scope.row.state == "5"
              ? "已撤回"
              : ""
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
            <el-button size="mini" type="text" @click="handleSelect(scope.row)" circle>
              查看
            </el-button>
            <el-button size="mini" v-if="
              (scope.row.state == '1' || scope.row.state == '4' || scope.row.state == '5') &&
              scope.row.approvalType != '2'
            " type="text" @click="handleUpdate(scope.row)" circle>
              修改
            </el-button>
            <el-button size="mini" v-if="scope.row.state != '3' && scope.row.state != '4' && scope.row.state != '5' &&
              (scope.row.approvalType == '4' || scope.row.approvalType == '5')
            " type="text" @click="withdraw(scope.row)" circle>撤回</el-button>
            <el-button size="mini" v-if="scope.row.state == '1' || scope.row.state == '4' || scope.row.state == '5'
            " type="text" @click="handleDelete(scope.row)" circle>
              删除
            </el-button>
            <el-button size="mini" v-if="(scope.row.state == '4' || scope.row.state == '5') &&
              scope.row.approvalType != '2'
            " type="text" @click="reInitiate(scope.row)" circle>重新发起</el-button>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit"
        @pagination="getList" />
    </div>
  </div>
</template>

<script>
import {
  removeProcess,
  taskInitiator,
  restartProcess,
  withdrawProcess,
} from "@/api/approve/index.js";
import { delSt, delProject, delStupdate, getStupdate } from "@/api/project/st";
import { delContract } from "@/api/project/contract";
import {
  delApayment,
  checkSelnyStatusA,
  reBindSelnyA,
  releaseSelnyA,
} from "@/api/project/apayment";
import {
  delFpayment,
  checkSelnyStatusF,
  reBindSelnyF,
  releaseSelnyF,
} from "@/api/project/fpayment";
import { delSk } from "@/api/project/sk";
import { delMargin } from "@/api/project/margin";
import { delCplan } from "@/api/project/cplan";
import { delLpayment } from "@/api/project/lpayment";
import { delGrn } from "@/api/project/grn";
import { delGry } from "@/api/project/gry";
import { delSupplier } from "@/api/project/supplier";
import { delTerminal } from "@/api/project/terminal";
import { delSticket } from "@/api/project/sticket";
import { delKp } from "@/api/project/kp";
import { delDp } from "@/api/project/dp";
import { delRealsk } from "@/api/project/realsk";
import { delBidApply } from "@/api/project/bidApply";
import { delRefund } from "@/api/project/refund";
export default {
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 10,
      },
      total: 0,
      processTypeList: [],
      initiateData: [],
    };
  },
  created() {
    this.getDicts("process_type").then((response) => {
      this.processTypeList = response.data;
      this.getList();
    });
  },
  methods: {
    getList() {
      let that = this
      taskInitiator(this.queryParams).then((res) => {
        this.total = res.total;
        // this.initiateData = res.rows;
        let list = res.rows
        list.forEach(function(item,index){
          item.processTypeLabel = that.processTypeList[that.processTypeList.findIndex((it) => it.dictValue == item.approvalType)].dictLabel
        })
        this.initiateData = list
      });
    },
    async reInitiate(row) {
      let typeId = row.approvalType;
      let stId = row.businessKey;
      let isOk = true;
      if (typeId == "4") {
        // 验证出入库单状态是否可用
        await checkSelnyStatusA(stId).then((response) => {
          isOk = response.data.isOk;
        });
      } else if (typeId == "5") {
        // 验证出入库单状态是否可用
        await checkSelnyStatusF(stId).then((response) => {
          isOk = response.data.isOk;
        });
      }
      if (!isOk) {
        this.$message.error("数质量信息不可用，请确认");
      } else {
        if (typeId == "4") {
          await reBindSelnyA(stId);
        } else if (typeId == "5") {
          await reBindSelnyF(stId);
        }
        restartProcess({approvalType:typeId,businessKey:stId}).then(() => {
          this.$messageContent.message("S000003", ["重新发起"]);
          this.getList();
        });
      }
    },
    handleSelect(row) {
      // console.log(row)
      let typeId = row.approvalType;
      let stId = row.businessKey;
      if (typeId == "20") {
        this.$router.push("/st/lookAddP/" + stId);
      }
      else if (typeId == "1") {
        this.$router.push("/st/lookAddB/" + stId);
      } else if (typeId == "2") {
        getStupdate(stId).then((response) => {
          this.$router.push({
            name: "lookUpdate",
            query: { stId: response.data.stId + "", stupdateId: stId },
          });
        });
      } else if (typeId == "3") {
        this.$router.push("/contract/look/" + stId);
      } else if (typeId == "4") {
        this.$router.push("/apayment/look/" + stId);
      } else if (typeId == "5") {
        this.$router.push("/fpayment/look/" + stId);
      } else if (typeId == "6") {
        this.$router.push("/sk/look/" + stId);
      } else if (typeId == "7") {
        this.$router.push("/margin/look/" + stId);
      } else if (typeId == "8") {
        this.$router.push("/cplan/look/" + stId);
      } else if (typeId == "9") {
        this.$router.push("/lpayment/look/" + stId);
      } else if (typeId == "10") {
        this.$router.push("/grn/look/" + stId);
      } else if (typeId == "11") {
        this.$router.push("/gry/look/" + stId);
      } else if (typeId == "12") {
        this.$router.push("/supplier/look/" + stId);
      } else if (typeId == "13") {
        this.$router.push("/terminal/look/" + stId);
      } else if (typeId == "14") {
        this.$router.push("/sticket/look/" + stId);
      } else if (typeId == "15") {
        this.$router.push("/kp/look/" + stId);
      } else if (typeId == "16") {
        this.$router.push("/dp/look/" + stId);
      } else if (typeId == "17") {
        this.$router.push("/realsk/look/" + stId);
      } else if (typeId == "18") {
        this.$router.push("/bidApply/look/" + stId);
      } else if (typeId == "19") {
        this.$router.push("/refund/look/" + stId);
      }
    },
    handleUpdate(row) {
      let typeId = row.approvalType;
      let stId = row.businessKey;
      if (typeId == "1") {
        //业务
        this.$router.push({
          name: "Stadd",
          params: { isEdit: "true", stId: stId,st:1 },
        });
      } else if (typeId == "2") {
        //业务操作
        this.$router.push({
          name: "Stadd",
          params: { isEdit: "true", stId: stId,st:2 },
        });
      }else if (typeId == "20") {
        //项目
        this.$router.push({
          name: "Stadd",
          params: { isEdit: "true", projectId: stId },
        });
      }
      else if (typeId == "3") {
        this.$router.push({
          name: "contractEdit",
          params: { isEdit: "true", contractId: stId },
        });
      } else if (typeId == "4") {
        this.$router.push({
          name: "apaymentEdit",
          params: { isEdit: "true", apaymentId: stId },
        });
      } else if (typeId == "5") {
        this.$router.push({
          name: "fpaymentEdit",
          params: { isEdit: "true", fpaymentId: stId },
        });
      } else if (typeId == "6") {
        this.$router.push({
          name: "skEdit",
          params: { isEdit: "true", skId: stId },
        });
      } else if (typeId == "7") {
        this.$router.push({
          name: "marginEdit",
          params: { isEdit: "true", marginId: stId },
        });
      } else if (typeId == "8") {
        this.$message.error("请重新创建资金计划");
      } else if (typeId == "9") {
        this.$router.push({
          name: "lpaymentEdit",
          params: { isEdit: "true", lpaymentId: stId },
        });
      } else if (typeId == "10") {
        this.$router.push({
          name: "grnEdit",
          params: { isEdit: "true", grnId: stId },
        });
      } else if (typeId == "11") {
        this.$router.push({
          name: "gryEdit",
          params: { isEdit: "true", gryId: stId },
        });
      } else if (typeId == "12") {
        this.$router.push({
          name: "supplierEdit",
          params: { isEdit: "true", supplierId: stId },
        });
      } else if (typeId == "13") {
        this.$router.push({
          name: "terminalEdit",
          params: { isEdit: "true", terminalId: stId },
        });
      } else if (typeId == "14") {
        this.$router.push({
          name: "sticketEdit",
          params: { isEdit: "true", sticketId: stId },
        });
      } else if (typeId == "15") {
        this.$router.push({
          name: "kpEdit",
          params: { isEdit: "true", kpId: stId },
        });
      } else if (typeId == "16") {
        this.$router.push({
          name: "dpEdit",
          params: { isEdit: "true", dpId: stId },
        });
      } else if (typeId == "17") {
        this.$router.push({
          name: "realskEdit",
          params: { isEdit: "true", realskId: stId },
        });
      } else if (typeId == "18") {
        this.$router.push({
          name: "bidApplyEdit",
          params: { isEdit: "true", bidId: stId },
        });
      } else if (typeId == "19") {
        this.$router.push({
          name: "refundEdit",
          params: { isEdit: "true", refundId: stId },
        });
      }
    },
    handleDelete(row) {
      let typeId = row.approvalType;
      let stId = row.businessKey;
      if (typeId == "20") {
        this.$confirm("是否确认删除项目信息?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delProject(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => { });
      } else if (typeId == "1") {
        this.$confirm("是否确认删除业务信息?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delSt(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType :typeId}).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "2") {
        this.$confirm("是否确认删除项目操作信息?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delStupdate(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "3") {
        this.$confirm("是否确认删除项目合同?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delContract(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "4") {
        this.$confirm("是否确认删除预付款?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delApayment(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "5") {
        this.$confirm("是否确认删除最终付款?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delFpayment(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId });
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(() => {});
      } else if (typeId == "6") {
        this.$confirm("是否确认删除收款?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delSk(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "7") {
        this.$confirm("是否确认删除保证金?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delMargin(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "8") {
        this.$confirm("是否确认删除资金计划?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delCplan(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "9") {
        this.$confirm("是否确认删除物流付款?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delLpayment(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "10") {
        this.$confirm("是否确认删除随车数质量?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delGrn(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "11") {
        this.$confirm("是否确认删除到厂数质量?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delGry(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "12") {
        this.$confirm("是否确认删除供应商?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delSupplier(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "13") {
        this.$confirm("是否确认删除终端用户?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delTerminal(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "14") {
        this.$confirm("是否确认删除收票管理?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delSticket(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "15") {
        this.$confirm("是否确认删除开票?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delKp(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "16") {
        this.$confirm("是否确认删除期间费用?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delDp(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "17") {
        this.$confirm("是否确认删除实际收款?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delRealsk(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "18") {
        this.$confirm("是否确认删除投标申请?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delBidApply(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      } else if (typeId == "19") {
        this.$confirm("是否确认删除退款管理?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delRefund(stId);
          })
          .then(() => {
            removeProcess({ businessKey: stId, approvalType: typeId }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            })
          })
          .catch(() => {});
      }
    },
    withdraw(row) {
      let _this = this;
      let typeId = row.approvalType;
      let stId = row.businessKey;
      this.$confirm("确认撤回提单吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        withdrawProcess({approvalType:typeId,businessKey:stId}).then(() => {
          if (typeId == "4") {
            releaseSelnyA(stId);
          } else if (typeId == "5") {
            releaseSelnyF(stId);
          }
          _this.getList();
          _this.msgSuccess("撤回成功");
        });
      });
    },
  },
};
</script>

<style></style>
