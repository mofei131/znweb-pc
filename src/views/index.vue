<style>

.head-title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
}
.head-text{
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  background: #FFFFFF;
}
.tb-head{
  background: linear-gradient(140deg, #01A2FF, #0071FF);
  border-radius: 10px;
}
</style>
<template>
  <div style="background-color: #f8f8f8;">
    <el-row style=" background: #FFFFFF;">
    <el-row class="head-title" style="padding-left: 20px;margin-top: 20px;">
      <el-col :span="24" >
        <span style="color: #317FF7;">|</span><span>我的数据</span>
      </el-col>
    </el-row>
    <el-row class="head-text" style="padding-left: 40px;margin-top: 20px;">
      <el-col :span="3" >
        <el-col :span="12" style="color: #317FF7 !important;font-size: 58px;text-align: right;">
          <img :src="faqi"/>
        </el-col>
        <el-col :span="12">
            <el-row>
              <el-col :span="24" style="text-align: center;font-size: 24px;color: #317FF7;">
                <span>25</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: center;font-size: 14px;">
                <span>我发起的</span>
              </el-col>
            </el-row>
        </el-col>
      </el-col>

      <el-col :span="3" style="border-left: 1px solid #EEEEEE;">
        <el-col :span="12" style="color: #30C6B8 !important;font-size: 58px;text-align: right;">
          <img :src="shenpi" />
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24" style="text-align: center;font-size: 24px;">
              <span>25</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align: center;font-size: 14px;">
              <span>待我审批</span>
            </el-col>
          </el-row>
        </el-col>
      </el-col>

      <el-col :span="3" style="border-left: 1px solid #EEEEEE;">
        <el-col :span="12" style="color: #747CEC !important;font-size: 58px;text-align: right;">
          <img :src="chaosong" />
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24" style="text-align: center;font-size: 24px;">
              <span>25</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align: center;font-size: 14px;">
              <span>抄送我的</span>
            </el-col>
          </el-row>
        </el-col>
      </el-col>

      <el-col :span="3" style="border-left: 1px solid #EEEEEE;">
        <el-col :span="12" style="color: #F9CB73 !important;font-size: 58px;text-align: right;">
          <img :src="yishenpi" />
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24" style="text-align: center;font-size: 24px;">
              <span>25</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align: center;font-size: 14px;">
              <span>我已审批</span>
            </el-col>
          </el-row>
        </el-col>
      </el-col>

      <el-col :span="4" style="border-left: 1px solid #EEEEEE;">
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 24px;color: #317FF7;">
            <span>5,883,223</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 14px;">
            <span>应收款(万)</span>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="4" style="border-left: 1px solid #EEEEEE;">
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 24px;color: #5BBA50;">
            <span>5,883,223</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 14px;">
            <span>应付款(万)</span>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="4" style="border-left: 1px solid #EEEEEE;">
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 24px;color: #FB7A2C;">
            <span>5,883,223</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 14px;">
            <span>已付款总额(万)</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    </el-row>
    <el-row class="head-title" style="margin-top: 1%;height: 450px;" >
      <el-col :span="8" style="background: #FFFFFF;padding-left: 20px;height: 100%;">
        <span style="color: #317FF7;">|</span><span>常用入口</span>
        <el-row style="padding-left: 40px;margin-top: 20px;">
          <el-col :span="6" >
            <img :src="xiangmu" @click="toSt"/><br/>
            <span style="font-size: 14px;">添加项目</span>
          </el-col>
          <el-col :span="6" >
            <img :src="tianjiahetong" @click="toContract"/><br/>
            <span style="font-size: 14px;">添加合同</span>
          </el-col>
          <el-col :span="6" >
            <img :src="yufukuan" @click="toApayment"/><br/>
            <span style="font-size: 14px;">添加预付款</span>
          </el-col>
          <el-col :span="6" >
            <img :src="zhichu" @click="toFpayment"/><br/>
            <span style="font-size: 14px;">最终付款</span>
          </el-col>
        </el-row>
        <el-row style="padding-left: 40px;margin-top: 20px;">
          <el-col :span="6" >
            <img :src="shoukuan" @click="toSk"/><br/>
            <span style="font-size: 14px;">添加收款</span>
          </el-col>
          <el-col :span="6" >
            <img :src="ruku" @click="toGrn"/><br/>
            <span style="font-size: 14px;">添加入库</span>
          </el-col>
          <el-col :span="6" >
            <img :src="chuku" @click="toGry"/><br/>
            <span style="font-size: 14px;">添加出库</span>
          </el-col>
          <el-col :span="6" >
            <img :src="qijianfeiyong" @click="toDp"/><br/>
            <span style="font-size: 14px;">添加期间费用</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" style="background: #FFFFFF;margin-left: 1%;padding-left: 20px;height: 100%;">
        <span style="color: #317FF7;">|</span><span>在手项目</span>
        <el-row>
          <el-col :span="24" style="height: 440px;">
            <el-table
              :data="stList"
              fit
              size="mini"
            >
              <el-table-column
                prop="name"
                label="项目名称"
                width="80">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="项目金额"
              >
              </el-table-column>
              <el-table-column
                prop="expectProfits"
                label="预计收入"
              >
              </el-table-column>
              <el-table-column label="创建日期" align="center" prop="createTime" >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              small
              layout="prev, pager, next"
              v-show="total3>0"
              :total="total3"
              :page.sync="queryParams3.pageNum"
              :limit.sync="queryParams3.pageSize"
              :page-sizes="queryParams3.pageSizes"
              @pagination="getList3"
              style="margin-right: 40%"
            />
          </el-col>
        </el-row>

      </el-col>
      <el-col :span="7" style="background: #FFFFFF;margin-left: 1%;padding-left: 20px;width: 31.3333333333%;height: 100%;">
        <span style="color: #317FF7;">|</span><span>应收应付计划</span>
        <el-row>
          <el-col :span="24" style="height: 240px;">
            <el-table
              :data="cplanList"
              fit
              size="mini"
              style="height: 90%"
            >
              <el-table-column
                prop="stName"
                label="所属项目"
                >
              </el-table-column>
              <el-table-column
                prop="fkPrice"
                label="付款金额"
                >
              </el-table-column>
              <el-table-column
                prop="fkTime"
                label="付款日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.fkTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="skPrice"
                label="收款金额"
              >
              </el-table-column>
              <el-table-column
                prop="fkTime"
                label="收款日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.skTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              small
              layout="prev, pager, next"
              v-show="total4>0"
              :total="total4"
              :page.sync="queryParams4.pageNum"
              :limit.sync="queryParams4.pageSize"
              :page-sizes="queryParams4.pageSizes"
              @pagination="getList4"
              style="margin-right: 40%"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="head-title" style="margin-top: 1%;height: 650px;">
      <el-col :span="11" style="background: #FFFFFF;padding-left: 20px;height: 100%;width: 49%;">
        <span style="color: #317FF7;">|</span><span>个人资金占用情况</span>
        <el-row>

          <el-col :span="24" style="height: 640px;">
            <el-form :model="queryParams1" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="统计时间">
                <el-date-picker
                  v-model="dateRange"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="atakeupList" fit  size="mini">
                <el-table-column label="部门名称" align="center" prop="deptName" />
                <el-table-column label="代办人" align="center" prop="userName" />
                <el-table-column label="期初占用(万元)" align="center" prop="starPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.starPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="期末占用(万元)" align="center" prop="endPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.endPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="平均占用(万元)" align="center" prop="pjPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.pjPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="收入金额(万元)" align="center" prop="profitsPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.profitsPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="资金周转率" align="center" prop="ct" />
            </el-table>
            <pagination
              small
              layout="prev, pager, next"
              v-show="total1>0"
              :total="total1"
              :page.sync="queryParams1.pageNum"
              :limit.sync="queryParams1.pageSize"
              :page-sizes="queryParams1.pageSizes"
              @pagination="getList1"
              style="margin-right: 40%;"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="11" style="background: #FFFFFF;margin-left: 1%;padding-left: 20px;width: 50%;height: 100%;">
        <span style="color: #317FF7;">|</span><span>项目资金占用情况</span>
        <el-row>
          <el-col :span="24" style="height: 640px;">
            <el-form :model="queryParams2" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="统计时间">
                <el-date-picker
                  v-model="dateRange"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              </el-form-item>
            </el-form>
              <el-table v-loading="loading" :data="ptakeupList"  fit size="mini">
                <el-table-column label="项目名称" align="center" prop="stName" />
                <el-table-column label="立项时间" align="center" prop="createTime" width="180">
                  <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="代办人" align="center" prop="userName" />
                <el-table-column label="期初占用(万元)" align="center" prop="starPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.starPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="期末占用(万元)" align="center" prop="endPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.endPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="平均占用(万元)" align="center" prop="pjPrice" >
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.pjPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <!--      <el-table-column label="资金占用情况(万元)" align="center" prop="takeupPrice" >-->
                <!--        <template slot-scope="scope">-->
                <!--          {{-->
                <!--            Number(scope.row.takeupPrice)-->
                <!--              .toFixed(2)-->
                <!--              .toString()-->
                <!--              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")-->
                <!--          }}-->
                <!--        </template>-->
                <!--      </el-table-column>-->
                <el-table-column label="收入金额(万元)" align="center" prop="profitsPrice" >
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
            <pagination
              small
              layout="prev, pager, next"
              v-show="total2>0"
              :total="total2"
              :page.sync="queryParams2.pageNum"
              :limit.sync="queryParams2.pageSize"
              :page-sizes="queryParams2.pageSizes"
              @pagination="getList2"
              style="margin-right: 40%;"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import faqi from '@/assets/logo/faqi.png'
import shenpi from '@/assets/logo/shenpi_.png'
import chaosong from '@/assets/logo/chaosong.png'
import yishenpi from '@/assets/logo/yishenpi.png'
import xiangmu from '@/assets/logo/xiangmu-4.png'
import tianjiahetong from '@/assets/logo/tianjiahetong-2.png'
import yufukuan from '@/assets/logo/yufukuan.png'
import zhichu from '@/assets/logo/zhichu.png'
import shoukuan from '@/assets/logo/shoukuan-4.png'
import ruku from '@/assets/logo/ruku-2.png'
import chuku from '@/assets/logo/chuku.png'
import qijianfeiyong from '@/assets/logo/shoukuan-3.png'
import echarts from 'echarts'
import {listKp} from "@/api/project/kp";
import { listAtakeup } from '@/api/project/atakeup'
import { listPtakeup } from '@/api/project/ptakeup'
import { listSt } from '@/api/project/st'
import { listCplan } from '@/api/project/cplan'
export default {
  name: "index",
  mounted() {
    // this.myEcharts();
    // this.myEcharts2();
  },

  data() {
    return {
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
      activities: [{
        content: '合同审批',
        timestamp: 'xxx项目购入合同已经提交      2021.5.12'
      }, {
        content: '合同审批',
        timestamp: 'xxx项目购入合同已经提交      2021.5.12'
      }, {
        content: '合同审批',
        timestamp: 'xxx项目购入合同已经提交      2021.5.12'
      }]
      ,
      tableData: [{
        type: '应收',
        name: '煤炭项目',
        price: '39,0000',
        time: '2021-05-21'
      }, {
        type: '应收',
        name: '煤炭项目',
        price: '39,0000',
        time: '2021-05-21'
      },{
        type: '应收',
        name: '煤炭项目',
        price: '39,0000',
        time: '2021-05-21'
      },{
        type: '应收',
        name: '煤炭项目',
        price: '39,0000',
        time: '2021-05-21'
      },{
        type: '应收',
        name: '煤炭项目',
        price: '39,0000',
        time: '2021-05-21'
      }],
      tableData2: [{
        type: '煤炭项目',
        name: '39,0000',
        price: '39,0000',
        time: '2021-05-21'
      }, {
        type: '煤炭项目',
        name: '39,0000',
        price: '39,0000',
        time: '2021-05-21'
      },{
        type: '煤炭项目',
        name: '39,0000',
        price: '39,0000',
        time: '2021-05-21'
      },{
        type: '煤炭项目',
        name: '39,0000',
        price: '39,0000',
        time: '2021-05-21'
      },{
        type: '煤炭项目',
        name: '39,0000',
        price: '39,0000',
        time: '2021-05-21'
      }],
      // 遮罩层
      loading: true,
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
        xmState:'1',
      },
      // 查询参数
      queryParams4: {
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5],
      },
      // 日期范围
      dateRange: [],
      // 开票
      kpList: [],
      // 资金占用
      atakeupList:[],
      // 项目资金占用
      ptakeupList:[],
      // 项目
      stList:[],
      //应收应付
      cplanList: [],
    };
  },
  created() {
    this.getList4();
    this.getList3();
    this.getList2();
    this.getList1();
  },
  methods: {

    toSt(){
      this.$router.push({name: 'stAdd',params:{isAdd:"true"}})
    },
    toContract(){
      this.$router.push({name: 'contractAdd',params:{isAdd:"true"}})
      // this.$router.push({name: 'contractEdit',params:{isEdit:"true",contractId:"23"}})
    },
    toApayment(){
      this.$router.push({name: 'apaymentAdd',params:{isAdd:"true"}})
    },
    toFpayment(){
      this.$router.push({name: 'fpaymentAdd',params:{isAdd:"true"}})
    },
    toSk(){
      this.$router.push({name: 'skAdd',params:{isAdd:"true"}})
    },
    toGrn(){
      this.$router.push({name: 'grnAdd',params:{isAdd:"true"}})
    },
    toGry(){
      this.$router.push({name: 'gryAdd',params:{isAdd:"true"}})
    },
    toDp(){
      this.$router.push({name: 'dpAdd',params:{isAdd:"true"}})
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询开票列表 */
    getList() {
      this.loading = true;
      listKp(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.kpList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },

    getList1() {
      this.loading = true;
      listAtakeup(this.addDateRange(this.queryParams1, this.dateRange)).then(response => {
        this.atakeupList = response.rows;
        this.total1 = response.total;
        this.loading = false;
      });
    },

    getList2() {
      this.loading = true;
      listPtakeup(this.addDateRange(this.queryParams2, this.dateRange)).then(response => {
        this.ptakeupList = response.rows;
        this.total2 = response.total;
        this.loading = false;
      });
    },

    getList3() {
      this.loading = true;
      listSt(this.addDateRange(this.queryParams3, this.dateRange)).then(response => {
        this.stList = response.rows;
        this.total3 = response.total;
        this.loading = false;
      });
    },

    getList4() {
      this.loading = true;
      listCplan(this.queryParams4).then(response => {
        this.cplanList = response.rows;
        this.total4 = response.total;
        this.loading = false;
      });
    },
    // myEcharts() {
    //   // 基于准备好的dom，初始化echarts实例
    //   var myChart = this.$echarts.init(document.getElementById('main'));
    //
    //   // 指定图表的配置项和数据
    //   var option = {
    //     color: ['#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35', '#F86C35'],
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {            // 坐标轴指示器，坐标轴触发有效
    //         type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //       }
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    //       axisLabel:{
    //         interval: 0
    //       },
    //       axisTick: {
    //         alignWithLabel: true
    //       }
    //     },
    //     yAxis: [
    //       {
    //         type: 'value'
    //       }
    //     ],
    //     series: [{
    //       name: 'x1',
    //       type: 'bar',
    //       barWidth: '13',
    //       data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390]
    //     }]
    //   };
    //
    //   // 使用刚指定的配置项和数据显示图表。
    //   myChart.setOption(option);
    // },
    // myEcharts2() {
    //   // 基于准备好的dom，初始化echarts实例
    //   var myChart = this.$echarts.init(document.getElementById('main2'));
    //   var option = {
    //     //提示框组件
    //     tooltip:{
    //       trigger: 'axis',
    //       axisPointer: {            // 坐标轴指示器，坐标轴触发有效
    //         type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //       }
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     xAxis:{
    //       //类型：类目轴
    //       type:'category',
    //       axisTick:{
    //         alignWithLabel:true
    //       },
    //       axisLabel:{
    //         interval: 0
    //       },
    //       data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    //     },
    //     yAxis:{
    //       type:'value',
    //     },
    //     //系列列表
    //     series:[
    //       {
    //         name:'test',
    //         //类型：折线图
    //         type:'line',
    //         smooth:true,
    //
    //         areaStyle:{
    //           normal:{
    //             lineStyle:{
    //               color:'#37BA7B'
    //             },
    //             //右，下，左，上
    //             color:new echarts.graphic.LinearGradient(0,0,0,1,[
    //               {
    //                 offset:0,
    //                 color:'#FFFFFF'
    //               },
    //               {
    //                 offset:1,
    //                 color:'#37BA7B'
    //               }
    //             ],false)
    //           }
    //         },
    //         itemStyle : {
    //           color:{
    //             type: 'linear',
    //             x: 0,
    //             y: 0,
    //             x2: 0,
    //             y2: 1,
    //             colorStops: [{
    //               offset: 0, color: '#FFFFFF' // 0% 处的颜色
    //             }, {
    //               offset: 1, color: '#37BA7B' // 100% 处的颜色
    //             }],
    //             global: false // 缺省为 false
    //           }
    //         },
    //         lineStyle:{
    //           color: {
    //             type: 'linear',
    //             x: 0,
    //             y: 0,
    //             x2: 1,
    //             y2: 1,
    //             colorStops: [
    //               {
    //                 offset: 0, color: '#FFFFFF' // 0% 处的颜色
    //               },
    //               {
    //                 offset: 1, color: '#37BA7B' // 100% 处的颜色
    //               }],
    //             global: false // 缺省为 false
    //           }
    //         },
    //         data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390]
    //       }
    //     ]
    //
    //   };
    //   // 使用刚指定的配置项和数据显示图表。
    //   myChart.setOption(option);
    //
    // }

  },

};
</script>


