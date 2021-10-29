<style v-if="false">
/*.el-input__suffix{*/
/*  display: none;*/
/*}*/
.el-input.is-disabled .el-input__inner{
  background-color: #ffffff;
  border: 0px;
}
.el-tag.el-tag--info{
  background-color: #ffffff;
  border: 0px;
}

</style>
<template>
  <div>
    <el-form
      :model="queryParams"
      ref="ruleForm"
      :inline="true"
      label-width="110px"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <!-- <el-form-item label="流程名称" prop="processName">
            <el-input
              v-model="queryParams.processName"
              placeholder="请输入流程名称"
              :disabled="disabled"
              style="width: 195px"
            ></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程类型" prop="processType">
            <el-select
              v-model="queryParams.processType"
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

      <div class="dept">
        <el-row :gutter="20">
          <!-- <div> -->
          <el-col :span="12">
            <el-form-item label="1级审批部门" prop="deptId">
              <el-cascader
                :disabled="disabled"
                v-model="firstLevel.deptId"
                :options="deptOptions"
                :key="keyValue"
                :props="{ checkStrictly: true }"
                clearable
                @change="change"
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <!-- </div> -->
          <!-- <div style="margin-left: 110px"> -->
          <el-col :span="12">
            <el-form-item label="1级审批人" prop="processType">
              <el-select
                :disabled="disabled"
                v-model="firstLevel.userName"
                placeholder="请选择审批人"
                clearable
                multiple
              >
                <el-option
                  v-for="item in userList1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </div> -->
      </div>
      <el-button v-show="tj" type="text" @click="addUserName" :disabled="disabled"
        >添加审批人</el-button
      >
      <div
        class="dept"
        v-for="(item, index) in approveTowList"
        :key="'key' + ',' + index"
      >
        <el-row :gutter="20">
          <!-- <div> -->
          <el-col :span="12">
            <el-form-item
              :label="item.num == 'undefined' ? item.nodeOrder : item.num + '级审批部门'"
              prop="deptId"
            >
              <el-cascader
                :disabled="disabled"
                v-model="item.deptId"
                :options="deptOptions1"
                :key="keyValue"
                :props="{ checkStrictly: true }"
                clearable
                @change="change1(index,item)"
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <!-- </div> -->
          <!-- <div style="margin-left: 120px"> -->
          <el-col :span="12">
            <el-form-item :label="item.num + '级审批人'" prop="processType">
              <el-select
                :disabled="disabled"
                v-model="item.userName"
                placeholder="请选择审批人"
                clearable
                multiple
              >
                <el-option
                  v-for="item in item.userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button v-show="tj" type="text" @click="deletes(index)" :disabled="disabled"
              >删除</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- </div> -->
      <!-- </el-row> -->
      <hr />

      <el-button v-show="tj" type="text" @click="addCc" :disabled="disabled">添加抄送人</el-button>
      <div class="dept" v-for="(item, index) in ccList" :key="index">
        <el-row :gutter="20">
          <!-- <div> -->
          <el-col :span="12">
            <el-form-item label="抄送人部门" prop="deptId">
              <el-cascader
                :disabled="disabled"
                v-model="item.deptId"
                :options="deptOptionscc"
                :key="keyValue"
                :props="{ checkStrictly: true }"
                clearable
                @change="change2(index)"
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <!-- </div> -->
          <!-- <div style="margin-left: 110px"> -->
          <el-col :span="12">
            <el-form-item label="抄送人" prop="cc">
              <el-select
                v-model="item.cc"
                placeholder="请选择审批人"
                :disabled="disabled"
                clearable
              >
                <el-option
                  v-for="item in userList3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button v-show="tj" type="text" @click="deletecc(index)"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <!-- </div> -->
      </div>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="queryParams.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="审批内容" prop="processValue">
            <el-input
              :disabled="disabled"
              type="textarea"
              autosize
              placeholder="请输入审批内容"
              v-model="queryParams.processValue"
              style="width: 600px"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <div class="button">
      <el-button type="primary" :disabled="disabled" @click="submit" v-show="tj">确定</el-button>
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
export default {
  components: { Treeselect },
  props: ["mode", "initData"],
  data() {
    return {
      tj:true,
      ccList: [
        {
          deptId: "",
          cc: "",
        },
      ],
      approveTowList: [
        {
          deptId: "",
          userName: "",
          num: 2,
        },
      ],
      num: 2,
      keyValue: 0,
      queryParams: {},
      processTypeList: [],
      deptList: [],
      deptOptions: [],
      deptOptions1: [],
      deptOptionscc: [],
      userList1: [],
      userList2: [],
      userList3: [],
      list: [],
      disabled: false,
      isShow: false,
      firstLevel: {
        userName: [],
        deptId: [],
      },
      firstLevel1: {
        userName: [],
        deptId: [],
      },
      rules: {
        processName: [
          {
            required: true,
            message: this.$messageContent.get("EC00009"),
            trigger: "blur",
          },
        ],
        processType: [
          {
            required: true,
            message: this.$messageContent.get("EC00009"),
            trigger: "change",
          },
        ],
        // processType: [
        //   {
        //     response: true,
        //     message: this.$messageContent.get("EC00009"),
        //     trigger: "change",
        //   },
        // ],
      },
    };
  },
  created() {
    this.init();
    this.getTreeselect();
    this.getDicts("process_type").then((response) => {
      this.processTypeList = response.data;
    });
  },
  watch: {
    options(newVal) {
      this.keyValue++; //只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    },
  },

  methods: {
    // 添加抄送人按钮
    addCc() {
      this.ccList.push({ deptId: "", cc: "" });
    },
    // 抄送人删除
    deletecc(index) {
      if (this.ccList.length > 1) {
        this.ccList.splice(index, 1);
      } else {
        this.$messageContent.message("W000004");
      }
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    async init() {
      let node = [];
      let cc = [];
      let approveList = [];
      let k = [];

      if (this.mode == "view") {
        this.tj = false;
        this.disabled = true;
        this.queryParams = this.initData;

        // 测试
        await selectCCAndApproveByProcessId(this.initData.id).then(async (res) => {
          node = res.data.nodes;
          cc = res.data.ccs;
          if (node.length > 1) {
            for (let i = 0; i < node.length; i++) {
              let element = node[i]
              if (element.nodeOrder == 1) {

                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // debugger;
                  // console.log(this.firstLevel.userName);
                  // this.firstLevel.userName = element.userName;
                });

              } else {

                await selectDeptInfoByDeptId(element.deptId).then(async (res) => {
                  let dept = await res.data.ancestors.split(",");
                  let deptIds = [];
                  let userName = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);

                  await selectUserItemByDeptId(element.deptId).then(async (response) => {
                    let userList = await response.data;

                    await selectUserNameByDeptIdAndOrder(
                      this.initData.id,
                      element.nodeOrder,
                      element.deptId
                    ).then(async (it) => {
                      let itData = await it.data
                      for (let j = 0; j < itData.length; j++) {
                        const its = itData[j]
                        const index = it.data.indexOf(its);
                        let flag = userName.indexOf(its);
                        if (flag == -1) {
                          let fl = k.indexOf(element.nodeOrder);
                          if (fl == -1) {
                            userName.push(its);
                            if (index == it.data.length - 1) {
                              // 审批人与审批部门回显
                              this.approveTowList.push({
                                deptId: deptIds,
                                userName: userName,
                                nodeOrder: element.nodeOrder,
                                num: element.nodeOrder,
                                userList: userList,
                              });
                              k.push(element.nodeOrder);
                            }
                          }
                        }
                      }
                    })
                  })
                })

              }
            }
          }
          else {
            node.forEach((element) => {
              if (element.nodeOrder == 1) {
                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    // console.log(it);
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // this.firstLevel.userName = element.userName;
                });
              }
            });
          }
        })
        this.approveTowList.splice(0, 1);
        selectCCAndApproveByProcessId(this.initData.id).then((ress) => {
          cc = ress.data.ccs;
          cc.forEach((item) => {
            // 获取抄送人
            if (item.deptId != null && item.deptId != '') {
              selectUserItemByDeptId(item.deptId).then((response) => {
                this.userList3 = response.data;
              });
              // 根据部门ID获取部门信息
              selectDeptInfoByDeptId(item.deptId).then((res) => {
                let dept = res.data.ancestors.split(",");
                let deptIds = [];
                for (let i = 1; i < dept.length; i++) {
                  deptIds.push(parseInt(dept[i]));
                }
                deptIds.push(item.deptId);
                this.ccList.push({deptId: deptIds, cc: item.cc});
              });
            }
          });
          this.ccList.splice(0, 1);
        });
        return

        // 根据流程ID获取审批人回显
        selectCCAndApproveByProcessId(this.initData.id).then((res) => {
          node = res.data.nodes;
          cc = res.data.ccs;
          if (node.length > 1) {
            // debugger;
            node.forEach((element, indexs) => {
              // debugger;
              if (element.nodeOrder == 1) {
                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // debugger;
                  // console.log(this.firstLevel.userName);
                  // this.firstLevel.userName = element.userName;
                });
              } else {
                // 获取二级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList2 = response.data;
                });
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  let userName = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);

                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    // console.log(it);

                    it.data.forEach((its, index) => {
                      let flag = userName.indexOf(its);
                      if (flag == -1) {
                        // console.log(k);
                        let fl = k.indexOf(element.nodeOrder);
                        if (fl == -1) {
                          userName.push(its);
                          if (index == it.data.length - 1) {
                            // 审批人与审批部门回显
                            this.approveTowList.push({
                              deptId: deptIds,
                              userName: userName,
                              nodeOrder: element.nodeOrder,
                              num: element.nodeOrder,
                            });
                            // userName = [];
                            k.push(element.nodeOrder);
                          }
                        }
                      }
                    });
                    // this.approveTowList.push({
                    //   deptId: deptIds,
                    //   userName: userName,
                    //   nodeOrder: element.nodeOrder,
                    // });
                  });
                  // const resq = new Map();
                  // let arr1 = this.unique(this.approveTowList);

                  // console.log(this.approveTowList);

                  // return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
                  // 审批人与审批部门回显
                  // this.approveTowList.push({
                  //   deptId: deptIds,
                  //   userName: element.userName,
                  //   nodeOrder: element.nodeOrder,
                  // });
                });
                this.approveTowList.splice(0, 2);
              }
            });
          } else {
            node.forEach((element) => {
              if (element.nodeOrder == 1) {
                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // this.firstLevel.userName = element.userName;
                });
              }
            });
          }
        });
        selectCCAndApproveByProcessId(this.initData.id).then((ress) => {
          cc = ress.data.ccs;
          cc.forEach((item) => {
            if (item.deptId != null && item.deptId != '') {
              // 获取抄送人
              selectUserItemByDeptId(item.deptId).then((response) => {
                this.userList3 = response.data;
              });
              // 根据部门ID获取部门信息
              selectDeptInfoByDeptId(item.deptId).then((res) => {
                let dept = res.data.ancestors.split(",");
                let deptIds = [];
                for (let i = 1; i < dept.length; i++) {
                  deptIds.push(parseInt(dept[i]));
                }
                deptIds.push(item.deptId);
                this.ccList.push({deptId: deptIds, cc: item.cc});
              });
            }
          });
          this.ccList.splice(0, 1);
        });
      }
      if (this.mode == "reInitiate") {
        this.queryParams = this.initData;

        // 测试
        await selectCCAndApproveByProcessId(this.initData.id).then(async (res) => {
          node = res.data.nodes;
          cc = res.data.ccs;
          if (node.length > 1) {
            for (let i = 0; i < node.length; i++) {
              let element = node[i]
              if (element.nodeOrder == 1) {

                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // debugger;
                  // console.log(this.firstLevel.userName);
                  // this.firstLevel.userName = element.userName;
                });

              } else {

                await selectDeptInfoByDeptId(element.deptId).then(async (res) => {
                  let dept = await res.data.ancestors.split(",");
                  let deptIds = [];
                  let userName = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);

                  await selectUserItemByDeptId(element.deptId).then(async (response) => {
                    let userList = await response.data;

                    await selectUserNameByDeptIdAndOrder(
                      this.initData.id,
                      element.nodeOrder,
                      element.deptId
                    ).then(async (it) => {
                      let itData = await it.data
                      for (let j = 0; j < itData.length; j++) {
                        const its = itData[j]
                        const index = it.data.indexOf(its);
                        let flag = userName.indexOf(its);
                        if (flag == -1) {
                          let fl = k.indexOf(element.nodeOrder);
                          if (fl == -1) {
                            userName.push(its);
                            if (index == it.data.length - 1) {
                              // 审批人与审批部门回显
                              this.approveTowList.push({
                                deptId: deptIds,
                                userName: userName,
                                nodeOrder: element.nodeOrder,
                                num: element.nodeOrder,
                                userList: userList,
                              });
                              k.push(element.nodeOrder);
                            }
                          }
                        }
                      }
                    })
                  })
                })

              }
            }
          }
          else {
            node.forEach((element) => {
              if (element.nodeOrder == 1) {
                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    // console.log(it);
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // this.firstLevel.userName = element.userName;
                });
              }
            });
          }
        })
        this.approveTowList.splice(0, 1);
        selectCCAndApproveByProcessId(this.initData.id).then((ress) => {
          cc = ress.data.ccs;
          cc.forEach((item) => {
            // 获取抄送人
            if (item.deptId != null && item.deptId != '') {
              selectUserItemByDeptId(item.deptId).then((response) => {
                this.userList3 = response.data;
              });
              // 根据部门ID获取部门信息
              selectDeptInfoByDeptId(item.deptId).then((res) => {
                let dept = res.data.ancestors.split(",");
                let deptIds = [];
                for (let i = 1; i < dept.length; i++) {
                  deptIds.push(parseInt(dept[i]));
                }
                deptIds.push(item.deptId);
                this.ccList.push({deptId: deptIds, cc: item.cc});
              });
            }
          });
          this.ccList.splice(0, 1);
        });
        return


        // 根据流程ID获取审批人回显
        await selectCCAndApproveByProcessId(this.initData.id).then((res) => {

          node = res.data.nodes;
          cc = res.data.ccs;
          if (node.length > 1) {
            // debugger;
            node.forEach((element, indexs) => {
              // debugger;
              if (element.nodeOrder == 1) {
                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // debugger;
                  // console.log(this.firstLevel.userName);
                  // this.firstLevel.userName = element.userName;
                });
              } else {
                // 获取二级审批人
                // selectUserItemByDeptId(element.deptId).then((response) => {
                //   this.userList2 = response.data;
                // });
                selectDeptInfoByDeptId(element.deptId).then( (res) => {

                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  let userName = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);

                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {


                    for (const its of it.data) {
                      const index = it.data.indexOf(its);

                      let flag = userName.indexOf(its);

                      if (flag == -1) {
                        let fl = k.indexOf(element.nodeOrder);
                        if (fl == -1) {
                          userName.push(its);
                          if (index == it.data.length - 1) {

                            // 审批人与审批部门回显
                             selectUserItemByDeptId(element.deptId).then((response) => {
                              let userList = response.data;

                              this.approveTowList.push({
                                deptId: deptIds,
                                userName: userName,
                                nodeOrder: element.nodeOrder,
                                num: element.nodeOrder,
                                userList: userList,
                              });
                            });
                            k.push(element.nodeOrder);
                          }
                        }
                      }
                    }

                  });
                });
                this.approveTowList.splice(0, 2);
              }
            });
          } else {
            node.forEach((element) => {
              if (element.nodeOrder == 1) {
                // 获取一级审批人
                selectUserItemByDeptId(element.deptId).then((response) => {
                  this.userList1 = response.data;
                });
                // 根据部门ID获取部门信息
                selectDeptInfoByDeptId(element.deptId).then((res) => {
                  let dept = res.data.ancestors.split(",");
                  let deptIds = [];
                  for (let i = 1; i < dept.length; i++) {
                    deptIds.push(parseInt(dept[i]));
                  }
                  deptIds.push(element.deptId);
                  // 审批人与审批部门回显
                  this.firstLevel.deptId = deptIds;
                  selectUserNameByDeptIdAndOrder(
                    this.initData.id,
                    element.nodeOrder,
                    element.deptId
                  ).then((it) => {
                    // console.log(it);
                    it.data.forEach((its) => {
                      let flag1 = this.firstLevel.userName.findIndex(
                        (item) => item === its
                      );
                      if (flag1 == -1) {
                        this.firstLevel.userName.push(its);
                      }
                    });
                  });
                  // this.firstLevel.userName = element.userName;
                });
              }
            });
          }
        });

        selectCCAndApproveByProcessId(this.initData.id).then((ress) => {
          cc = ress.data.ccs;
          cc.forEach((item) => {
            // 获取抄送人
            if (item.deptId != null && item.deptId != '') {
              selectUserItemByDeptId(item.deptId).then((response) => {
                this.userList3 = response.data;
              });
              // 根据部门ID获取部门信息
              selectDeptInfoByDeptId(item.deptId).then((res) => {
                let dept = res.data.ancestors.split(",");
                let deptIds = [];
                for (let i = 1; i < dept.length; i++) {
                  deptIds.push(parseInt(dept[i]));
                }
                deptIds.push(item.deptId);
                this.ccList.push({deptId: deptIds, cc: item.cc});
              });
            }
          });
          this.ccList.splice(0, 1);
        });
      }
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselects().then((response) => {
        this.deptOptions = response.data;
        this.deptOptions1 = response.data;
        this.deptOptionscc = response.data;
      });
    },
    //添加审批人按钮
    addUserName() {
      let num = this.num + this.approveTowList.length;
      // console.log(num);
      this.approveTowList.push({ deptId: "", userName: "", num: num });
      // console.log(this.approveTowList);
    },
    change() {
      this.userList1 = [];
      this.firstLevel.userName = "";
      // 获取一级审批人
      if (this.firstLevel.deptId.length > 0) {
        selectUserItemByDeptId(
          this.firstLevel.deptId[this.firstLevel.deptId.length - 1]
        ).then((response) => {
          this.userList1 = response.data;
        });
      }
    },
    change1(index,item) {
      this.userList2 = [];
      this.approveTowList[index].userName = "";
      // 获取二级审批人
      if (this.approveTowList[index].deptId.length > 0) {
        selectUserItemByDeptId(
          this.approveTowList[index].deptId[this.approveTowList[index].deptId.length - 1]
        ).then((response) => {
          // this.userList2 = response.data;
          this.approveTowList[index].userList = response.data;
          this.keyValue++
        });
      }
    },
    change2(index) {
      this.userList3 = [];
      this.ccList[index].cc = "";
      // 获取抄送人
      if (this.ccList[index].deptId.length > 0) {
        selectUserItemByDeptId(
          this.ccList[index].deptId[this.ccList[index].deptId.length - 1]
        ).then((response) => {
          this.userList3 = response.data;
        });
      }
    },
    deletes(index) {
      if (this.approveTowList.length > 1) {
        this.approveTowList.splice(index, 1);
      } else {
        this.$messageContent.message("W000004");
      }
    },
    // 创建流程按钮
    submit() {
      let nodes = [];
      //判断选择部门
      if(this.firstLevel.deptId==null || this.firstLevel.deptId==''){
        this.$message.error("请选择1级审批人部门")
        return
      }
      //userName转换数组
      if(this.firstLevel.userName==''){
        this.firstLevel.userName=[]
      }
      nodes.push({
        deptId: this.firstLevel.deptId[this.firstLevel.deptId.length - 1],
        userName: this.firstLevel.userName,
        nodeOrder: 1,
      });
      let level = 1;
      this.approveTowList.forEach((item) => {
        if(item.userName==''){
          item.userName=[]
        }
        level += 1;
        nodes.push({
          deptId: item.deptId[item.deptId.length - 1],
          userName: item.userName,
          nodeOrder: level,
        });
      });
      let ccList = [];
      this.ccList.forEach((item) => {
        ccList.push({
          cc: item.cc,
          deptId: item.deptId[item.deptId.length - 1],
        });
      });
      this.queryParams.ccList = ccList;
      this.queryParams.nodes = nodes;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.mode == "create") {
            this.$messageContent.messageBox("W000002").then(() => {
              createProcess(this.queryParams).then(() => {
                this.$messageContent.message("S000003", ["流程创建"]);
                this.$emit("popOk");
              });
            });
          }
          if (this.mode == "reInitiate") {
            this.$messageContent.messageBox("W000002").then(() => {
              reInitiate(this.queryParams).then(() => {
                this.$messageContent.message("S000003", ["修改"]);
                this.$emit("popOk");
              });
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
}
.dept {
  // display: flex;
  // justify-content: space-between;
  // width: 600px;
}
</style>

