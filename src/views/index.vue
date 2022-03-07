<template>
  <div style="background-color: #f0f3f8">
    <notice-bar :tongzhi="tongzhi"></notice-bar>
    <div style="padding: 17px">
      <div style="display: flex; margin-bottom: 17px">
        <img
          style="height: 15px; width: 8px"
          src="../../public/img/bar.png"
          alt=""
        />
        <div style="line-height: 15px; margin-left: 5px">我的数据</div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="3"
            ><div
              @click="goToFqi"
              style="
                border-radius: 8px;
                width: 100%;
                height: 99px;
                background-color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div style="width: 125px; height: 72px; display: flex">
                <div>
                  <div
                    style="font-size: 30px; font-weight: 600; color: #333333"
                  >
                    {{ initiateTotal }}
                  </div>
                  <div style="margin-top: 10px; font-size: 14px">我发起的</div>
                </div>
                <img
                  style="width: 56px; height: 56px; margin-left: 10px"
                  src="../../public/img/faqi.png"
                  alt=""
                />
              </div></div
          ></el-col>
          <el-col :span="3"
            ><div
            @click="goTowodaiban"
              style="
                border-radius: 8px;
                width: 100%;
                height: 99px;
                background-color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div style="width: 125px; height: 72px; display: flex">
                <div>
                  <div
                    style="font-size: 30px; font-weight: 600; color: #333333"
                  >
                    {{ upcomingTotal }}
                  </div>
                  <div style="margin-top: 10px; font-size: 14px">我的待办</div>
                </div>
                <img
                  style="width: 56px; height: 56px; margin-left: 10px"
                  src="../../public/img/daiban.png"
                  alt=""
                />
              </div></div
          ></el-col>
          <el-col :span="3"
            ><div
            @click="goTobudaiban"
              style="
                border-radius: 8px;
                width: 100%;
                height: 99px;
                background-color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div style="width: 125px; height: 72px; display: flex">
                <div>
                  <div
                    style="font-size: 30px; font-weight: 600; color: #333333"
                  >
                    {{ bmdb }}
                  </div>
                  <div style="margin-top: 10px; font-size: 14px">部门待办</div>
                </div>
                <img
                  style="width: 56px; height: 56px; margin-left: 10px"
                  src="../../public/img/bumen.png"
                  alt=""
                />
              </div></div
          ></el-col>
          <el-col :span="3"
            ><div
            @click="goTochaosong"
              style="
                border-radius: 8px;
                width: 100%;
                height: 99px;
                background-color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div style="width: 125px; height: 72px; display: flex">
                <div>
                  <div
                    style="font-size: 30px; font-weight: 600; color: #333333"
                  >
                    {{ ccTotal }}
                  </div>
                  <div style="margin-top: 10px; font-size: 14px">抄送我的</div>
                </div>
                <img
                  style="width: 56px; height: 56px; margin-left: 10px"
                  src="../../public/img/chaosong.png"
                  alt=""
                />
              </div></div
          ></el-col>
          <el-col :span="4">
            <div style="position: relative">
              <img
                src="../../public/img/zi.png"
                style="width: 100%; height: 99px"
                alt=""
              />
              <div
                style="
                  position: absolute;
                  top: 0;
                  width: 100%;
                  height: 99px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <div
                    style="font-size: 30px; font-weight: 400; color: #fbfdfd"
                  >
                    {{ sc }}
                  </div>
                  <div
                    style="
                      margin-top: 10px;
                      font-size: 14px;
                      font-weight: 400;
                      color: #fbfdfd;
                    "
                  >
                    应收款(万)
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4"
            ><div style="position: relative">
              <img
                src="../../public/img/huang.png"
                style="width: 100%; height: 99px"
                alt=""
              />
              <div
                style="
                  position: absolute;
                  top: 0;
                  width: 100%;
                  height: 99px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <div
                    style="font-size: 30px; font-weight: 400; color: #fbfdfd"
                  >
                    {{ sf }}
                  </div>
                  <div
                    style="
                      margin-top: 10px;
                      font-size: 14px;
                      font-weight: 400;
                      color: #fbfdfd;
                    "
                  >
                    应付款(万)
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4"
            ><div style="position: relative">
              <img
                src="../../public/img/lan.png"
                style="width: 100%; height: 99px"
                alt=""
              />
              <div
                style="
                  position: absolute;
                  top: 0;
                  width: 100%;
                  height: 99px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <div
                    style="font-size: 30px; font-weight: 400; color: #fbfdfd"
                  >
                    {{ yf }}
                  </div>
                  <div
                    style="
                      margin-top: 10px;
                      font-size: 14px;
                      font-weight: 400;
                      color: #fbfdfd;
                    "
                  >
                    已付款总额(万)
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="10">
        <el-col :span="4">
          <div style="display: flex; margin-bottom: 17px; margin-top: 17px">
            <img
              style="height: 15px; width: 8px"
              src="../../public/img/bar.png"
              alt=""
            />
            <div style="line-height: 15px; margin-left: 5px">常用入口</div>
          </div>
          <div
            style="
              height: 400px;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
              display: flex;
              flex-wrap: wrap;
            "
          >
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toSt"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/add.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加项目</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toContract"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/hetong.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加合同</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toApayment"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/yufukuan.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加预付款</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toFpayment"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/zuizhongfukuan.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">最终付款</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toSk"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/shoukuan.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加收款</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toGrn"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/ruku.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加入库</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toGry"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/chuku.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加出库</div>
            </div>
            <div
              style="
                width: 50%;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              @click="toDp"
            >
              <img
                style="width: 34px; height: 32px"
                src="../../public/img/qijianfeiyong.png"
                alt=""
              />
              <div style="margin-top: 15px; font-size: 13px">添加期间费用</div>
            </div>
          </div>
        </el-col>
        <el-col :span="10"
          ><div style="display: flex; margin-bottom: 17px; margin-top: 17px">
            <img
              style="height: 15px; width: 8px"
              src="../../public/img/bar.png"
              alt=""
            />
            <div style="line-height: 15px; margin-left: 5px">营业利润</div>
          </div>
          <div
            style="
              height: 400px;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
            "
          >
            <div>
              <el-date-picker
                v-model="value2"
                style="width:100px"
                type="year"
                placeholder="选择年"
                size="mini"
                @change="changeMouth"
              >
              </el-date-picker>
            </div>
            <div id="chart"></div>
          </div>
        </el-col>
        <el-col :span="10"
          ><div style="display: flex; margin-bottom: 17px; margin-top: 17px">
            <img
              style="height: 15px; width: 8px"
              src="../../public/img/bar.png"
              alt=""
            />
            <div style="line-height: 15px; margin-left: 5px">应收应付计划</div>
          </div>
          <div
            style="
              height: 400px;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
              position:relative
            "
          >
            <div style="display: flex;position:absolute;right:20px">
              <div style="margin-right: 15px; margin-top: 4px;font-size:14px">统计时间</div>
              <el-date-picker
                v-model="dateRange2"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              ></el-date-picker>
              <div
                style="
                  width: 60px;
                  height: 26px;
                  background: #003088;
                  border-radius: 4px;
                  text-align: center;
                  line-height: 26px;
                  font-size:12px;
                  color: #ffffff;
                  margin-left: 12px;
                "
                @click="handleQuery2"
              >
                搜索
              </div>
            </div>
            <el-table
              style="margin-top:45px"
              :header-cell-style="{ background: '#F5F7FB' }"
              v-loading="loading2"
              size="mini"
              :data="cplanList"
              fit
            >
              <el-table-column prop="stName" label="所属项目">
              </el-table-column>
              <el-table-column prop="fkPrice" label="付款金额">
              </el-table-column>
              <el-table-column prop="fkTime" label="付款日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.fkTime, "{y}-{m}-{d}") }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="skPrice" label="收款金额">
              </el-table-column>
              <el-table-column prop="fkTime" label="收款日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.skTime, "{y}-{m}-{d}") }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination5
              v-show="total4 > 0"
              :total="total4"
              :page.sync="queryParams4.pageNum"
              :limit.sync="queryParams4.pageSize"
              @pagination="getList4"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="11"
          ><div style="display: flex; margin-bottom: 17px; margin-top: 17px">
            <img
              style="height: 15px; width: 8px"
              src="../../public/img/bar.png"
              alt=""
            />
            <div style="line-height: 15px; margin-left: 5px">在手项目</div>
          </div>
          <div
            style="
              height:415px;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
            "
          >
            <el-table
              v-loading="loading3"
              :header-cell-style="{ background: '#F5F7FB' }"
              :data="stList"
              size="mini"
              fit
            >
              <el-table-column prop="name" label="项目名称" width="220">
              </el-table-column>
              <el-table-column prop="amount" label="项目金额">
              </el-table-column>
              <el-table-column prop="expectProfits" label="预计收入">
              </el-table-column>
              <el-table-column
                label="创建日期"
                align="center"
                prop="createTime"
              >
                <template slot-scope="scope">
                  <span>{{
                    parseTime(scope.row.createTime, "{y}-{m}-{d}")
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination5
              v-show="total3 > 0"
              :total="total3"
              :page.sync="queryParams3.pageNum"
              :limit.sync="queryParams3.pageSize"
              @pagination="getList3"
            />
          </div>
        </el-col>
        <el-col :span="13"
          ><div style="display: flex; margin-bottom: 17px; margin-top: 17px">
            <img
              style="height: 15px; width: 8px"
              src="../../public/img/bar.png"
              alt=""
            />
            <div style="line-height: 15px; margin-left: 5px">
              项目资金占用情况
            </div>
          </div>
          <div
            style="
              height: 415px;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px ;
              position:relative
            "
          >
            <div style="display: flex;position:absolute;right:20px">
              <div style="margin-right: 15px; margin-top: 4px;font-size:14px">统计时间</div>
              <el-date-picker
                v-model="dateRange"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              ></el-date-picker>
              <div
                style="
                  width: 60px;
                  height: 26px;
                  background: #003088;
                  border-radius: 4px;
                  text-align: center;
                  line-height: 26px;
                  font-size:12px;
                  color: #ffffff;
                  margin-left: 12px;
                "
                @click="handleQuery"
              >
                搜索
              </div>
            </div>
            <el-table
              style="margin-top:45px"
              :header-cell-style="{ background: '#F5F7FB' }"
              v-loading="loading"
              :data="ptakeupList"
              size="mini"
              fit
            >
              <el-table-column
                label="项目名称"
                align="center"
                width="220"
                prop="stName"
              />
              <el-table-column
                label="立项时间"
                align="center"
                prop="createTime"
                width="100"
              >
                <template slot-scope="scope">
                  <span>{{
                    parseTime(scope.row.createTime, "{y}-{m}-{d}")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="代办人" align="center" prop="userName" />
              <el-table-column
                label="期初占用(万元)"
                align="center"
                prop="starPrice"
              >
                <template slot-scope="scope">
                  {{
                    Number(scope.row.starPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="期末占用(万元)"
                align="center"
                prop="endPrice"
              >
                <template slot-scope="scope">
                  {{
                    Number(scope.row.endPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="平均占用(万元)"
                align="center"
                prop="pjPrice"
              >
                <template slot-scope="scope">
                  {{
                    Number(scope.row.pjPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="收入金额(万元)"
                align="center"
                prop="profitsPrice"
              >
                <template slot-scope="scope">
                  {{
                    Number(scope.row.profitsPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column label="资金周转率" align="center" prop="ct" />
            </el-table>
            <pagination5
              v-show="total2 > 0"
              :total="total2"
              :page.sync="queryParams2.pageNum"
              :limit.sync="queryParams2.pageSize"
              @pagination="getList2"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style>
html,body{
  min-width:1530px;
  overflow-x:auto
}
#chart {
  width: 100%;
  height: 345px;
}
</style>
<script>
import faqi from "@/assets/logo/faqi.png";
import shenpi from "@/assets/logo/shenpi_.png";
import chaosong from "@/assets/logo/chaosong.png";
import yishenpi from "@/assets/logo/yishenpi.png";
import xiangmu from "@/assets/logo/xiangmu-4.png";
import tianjiahetong from "@/assets/logo/tianjiahetong-2.png";
import yufukuan from "@/assets/logo/yufukuan.png";
import zhichu from "@/assets/logo/zhichu.png";
import shoukuan from "@/assets/logo/shoukuan-4.png";
import ruku from "@/assets/logo/ruku-2.png";
import chuku from "@/assets/logo/chuku.png";
import qijianfeiyong from "@/assets/logo/shoukuan-3.png";
import echarts from "echarts";
import { listKp } from "@/api/project/kp";
import { listAtakeup } from "@/api/project/atakeup";
import { listPtakeup } from "@/api/project/ptakeup";
import { listSt } from "@/api/project/st";
import { listCplan } from "@/api/project/cplan";
import {
  getMyUpcoming,
  myAlreadyDoneList,
  myCcList,
  myInitiate,
  listByMonth,
  getMyUpcomingDept,
} from "@/api/approve";
import { listScAll } from "@/api/project/sc";
import { listSfAll } from "@/api/project/sf";
import noticeBar from "@/components/NoticeBar/index";
export default {
  name: "index",
  mounted() {
    this.getlistByMonth();
    getMyUpcomingDept(this.queryParams).then((res) => {
      this.bmdb = res.data.total;
      if(res.data.records.length>0){
        this.tongzhi = res.data.records[0].projectName
      }else{
        this.tongzhi="暂无通知"
      }
    });
  },
  components: {
    noticeBar,
  },
  data() {
    return {
      mouthData: [],
      value1: "",
      value2: "2022",
      value3: ["2022-01-01"],
      tongzhi:'',
      faqi: faqi,
      shenpi: shenpi,
      chaosong: chaosong,
      yishenpi: yishenpi,
      xiangmu: xiangmu,
      tianjiahetong: tianjiahetong,
      yufukuan: yufukuan,
      zhichu: zhichu,
      shoukuan: shoukuan,
      ruku: ruku,
      chuku: chuku,
      qijianfeiyong: qijianfeiyong,
      reverse: true,
      activities: [
        {
          content: "合同审批",
          timestamp: "xxx项目购入合同已经提交      2021.5.12",
        },
        {
          content: "合同审批",
          timestamp: "xxx项目购入合同已经提交      2021.5.12",
        },
        {
          content: "合同审批",
          timestamp: "xxx项目购入合同已经提交      2021.5.12",
        },
      ],
      tableData: [
        {
          type: "应收",
          name: "煤炭项目",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "应收",
          name: "煤炭项目",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "应收",
          name: "煤炭项目",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "应收",
          name: "煤炭项目",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "应收",
          name: "煤炭项目",
          price: "39,0000",
          time: "2021-05-21",
        },
      ],
      tableData2: [
        {
          type: "煤炭项目",
          name: "39,0000",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "煤炭项目",
          name: "39,0000",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "煤炭项目",
          name: "39,0000",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "煤炭项目",
          name: "39,0000",
          price: "39,0000",
          time: "2021-05-21",
        },
        {
          type: "煤炭项目",
          name: "39,0000",
          price: "39,0000",
          time: "2021-05-21",
        },
      ],
      // 遮罩层
      loading: true,
      loading2: true,
      loading3: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total1: 0,
      // 总条数
      total2: 0,
      // 总条数
      total3: 0,
      // 总条数
      total4: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 5,
      },
      // 查询参数
      queryParams1: {
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5],
      },
      // 查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5],
      },
      // 查询参数
      queryParams3: {
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5],
        xmState: "1",
      },
      // 查询参数
      queryParams4: {
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5],
      },
      queryParams5: {
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5],
      },
      // 日期范围
      dateRange: [],
      dateRange2: [],
      // 开票
      kpList: [],
      // 资金占用
      atakeupList: [],
      // 项目资金占用
      ptakeupList: [],
      // 项目
      stList: [],
      //应收应付
      cplanList: [],
      //我发起的
      initiateTotal: 0,
      //待我审批
      upcomingTotal: 0,
      //抄送我的
      ccTotal: 0,
      //我已审批
      alreadyDoneTotal: 0,
      //应收
      sc: 0,
      //应付
      sf: 0,
      //已付
      yf: 0,
      bmdb: 0,
    };
  },
  created() {
    this.getList4();
    this.getList3();
    this.getList2();
    this.getList1();
    this.getList5();
    this.getList6();
    this.getList7();
    this.getList8();
    this.getList9();
    this.getList10();
  },
  methods: {
    changeMouth(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        this.value3 = y + '-' + m + '-' + d
        this.getlistByMonth(this.value3);
    },
    getlistByMonth() {
      let m = [];
      m.push(this.value3);
      listByMonth(this.addDateRange(this.queryParams5, m)).then((res) => {
        this.mouthData = res.data;
        this.myEcharts();
      });
    },
    toSt() {
      this.$router.push({ name: "stAdd", params: { isAdd: "true" } });
    },
    toContract() {
      this.$router.push({ name: "contractAdd", params: { isAdd: "true" } });
      // this.$router.push({name: 'contractEdit',params:{isEdit:"true",contractId:"23"}})
    },
    toApayment() {
      this.$router.push({ name: "apaymentAdd", params: { isAdd: "true" } });
    },
    goToFqi(){
      this.$router.push('/approve/initiate/index')
    },
    goTowodaiban(){
      this.$router.push('/approve/upcoming/index')
    },
    goTobudaiban(){
      this.$router.push('/approve/initiate/index')
    },
    goTochaosong(){
      this.$router.push('/approve/cc/index')
    },
    toFpayment() {
      this.$router.push({ name: "fpaymentAdd", params: { isAdd: "true" } });
    },
    toSk() {
      this.$router.push({ name: "skAdd", params: { isAdd: "true" } });
    },
    toGrn() {
      this.$router.push({ name: "grnAdd", params: { isAdd: "true" } });
    },
    toGry() {
      this.$router.push({ name: "gryAdd", params: { isAdd: "true" } });
    },
    toDp() {
      this.$router.push({ name: "dpAdd", params: { isAdd: "true" } });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleQuery2() {
      this.queryParams4.pageNum = 1;
      this.getListQuery2();
    },
    getListQuery2() {
      this.loading2 = true;
      listCplan(this.addDateRange(this.queryParams4, this.dateRange2)).then(
        (response) => {
          this.cplanList = response.rows;
          this.total4 = response.total;
          this.loading2 = false;
        }
      );
    },
    /** 查询开票列表 */
    getList() {
      this.loading = true;
      listKp(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.kpList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    getList1() {
      this.loading = true;
      listAtakeup(this.addDateRange(this.queryParams1, this.dateRange)).then(
        (response) => {
          this.atakeupList = response.rows;
          this.total1 = response.total;
          this.loading = false;
        }
      );
    },

    getList2() {
      this.loading = true;
      listPtakeup(this.addDateRange(this.queryParams2, this.dateRange)).then(
        (response) => {
          this.ptakeupList = response.rows;
          this.total2 = response.total;
          this.loading = false;
        }
      );
    },

    getList3() {
      this.loading3 = true;
      listSt(this.addDateRange(this.queryParams3, this.dateRange)).then(
        (response) => {
          this.stList = response.rows;
          this.total3 = response.total;
          this.loading3 = false;
        }
      );
    },

    getList4() {
      this.loading2 = true;
      listCplan(this.queryParams4).then((response) => {
        this.cplanList = response.rows;
        this.total4 = response.total;
        this.loading2 = false;
      });
    },

    getList5() {
      myInitiate(this.queryParams).then((res) => {
        this.initiateTotal = res.data.total;
      });
    },

    getList6() {
      getMyUpcoming(this.queryParams).then((res) => {
        this.upcomingTotal = res.data.total;
      });
    },

    getList7() {
      myCcList(this.queryParams).then((res) => {
        this.ccTotal = res.total;
      });
    },

    getList8() {
      myAlreadyDoneList(this.queryParams).then((res) => {
        this.alreadyDoneTotal = res.data.total;
      });
    },
    getList9() {
      listScAll(this.queryParams).then((response) => {
        this.sc = response.data.scPrice;
        this.yf = response.data.payPrice;
      });
    },
    getList10() {
      listSfAll(this.queryParams).then((response) => {
        this.sf = response.data.sfPrice;
      });
    },
    myEcharts() {
      const chartDom = document.getElementById("chart");
      const chart = echarts.init(chartDom);
      chart.setOption({
        //x轴
        xAxis: {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
        },
        //y轴
        yAxis: {
          type: "value",
        },
        grid: {
          containLabel: true,
          top:"30px",
          left:"10px",
          right:"10px",
          bottom:"30px"
        },
        tooltip: {
          //鼠标放到统计图某一项上显示相应数据内容,不设置triggerOn时默认为鼠标移过就显示，设置为click为点击时才显示
          trigger: "axis",
          triggerOn: "click",
          //自定义鼠标放到统计图的某一项上展示的内容，formatter的值可以是字符串也可以是函数
          // formatter:'{b} 的成绩是 {c}'
          formatter: function (arg) {
            return arg[0].value;
          },
        },
        series: {
          type: "bar", //bar是柱形图，line是折线图
          data: this.mouthData,
          barWidth: "20",
          itemStyle: {
            normal: {
              barBorderRadius: [20, 20, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#00C0FA",
                },
                {
                  offset: 1,
                  color: "#015EEA ",
                },
              ]),
            },
          },
        },
      });
    },
  },
};
</script>


