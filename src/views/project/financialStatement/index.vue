<template>
  <div class="report">
    <div class="report_top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="请选择代办人">
          <el-select
            size="mini"
            v-model="formInline.agentId"
            placeholder="代办人"
            @change="chengeUser"
          >
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择项目">
          <el-select
            size="mini"
            v-model="formInline.stId"
            placeholder="活动区域"
          >
            <el-option
              v-for="(item, index) in stList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="report_bottom">
      <el-row :gutter="10">
        <el-col :span="14">
          <div
            style="
              background: #ffffff;
              box-shadow: 0px 0px 6px 0px rgba(146, 153, 161, 0.28);
              padding: 20px;
            "
          >
            <div style="display: flex; justify-content: space-between">
              <div style="font-size: 16px">项目简报</div>
              <div>
                <el-select
                  size="mini"
                  v-model="sift1"
                  placeholder="月份"
                  @change="getProjectBriefing"
                >
                  <el-option label="本月" value="本月"></el-option>
                  <el-option label="上月" value="上月"></el-option>
                  <el-option label="本季度" value="本季度"></el-option>
                  <el-option label="上季度" value="上季度"></el-option>
                  <el-option label="本年" value="本年"></el-option>
                  <el-option label="去年" value="去年"></el-option>
                  <el-option label="自定义" value="自定义"></el-option>
                </el-select>
                <el-date-picker
                  v-if="sift1 == '自定义'"
                  style="margin-left: 10px"
                  size="mini"
                  v-model="time1"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getProjectBriefing"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="briefing">
              <div class="briefing_items">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/kaipiaozonge.png"
                      style="width: 13px; height: 13px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">开票总额(元)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data1.kpAmount) }}
                </div>
              </div>
              <div class="briefing_items">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/kaipiaozongshuliang.png"
                      style="width: 11px; height: 11px; margin-left: 3.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">开票总数量(吨)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.weightFilter(data1.kpNum) }}
                </div>
              </div>
              <div class="briefing_items">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/shoupiaozonge.png"
                      style="width: 13px; height: 13px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">收票总额(元)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data1.spAmount) }}
                </div>
              </div>
              <div class="briefing_items">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/shoupiaozongshuliang.png"
                      style="width: 13px; height: 13px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">收票总数量(吨)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.weightFilter(data1.spNum) }}
                </div>
              </div>
              <div class="briefing_items">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/yingyelirun.png"
                      style="width: 13px; height: 13px; margin-left: 3px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">营业利润</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data1.businessProfits) }}
                </div>
              </div>
              <div class="briefing_items">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/jinglirun.png"
                      style="width: 12px; height: 12px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">净利润</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data1.profitsPrice) }}
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div
            style="
              background: #ffffff;
              box-shadow: 0px 0px 6px 0px rgba(146, 153, 161, 0.28);
              padding: 20px;
            "
          >
            <div style="display: flex; justify-content: space-between">
              <div style="font-size: 16px">资金占用</div>
              <div>
                <el-date-picker
                  style="margin-left: 10px"
                  size="mini"
                  v-model="time2"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getFundOccupation"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="briefing">
              <div class="briefing_items2">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/kaipiaozonge.png"
                      style="width: 13px; height: 13px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">期初资金占用(元)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data2.qcOcc) }}
                </div>
              </div>
              <div class="briefing_items2">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/kaipiaozongshuliang.png"
                      style="width: 11px; height: 11px; margin-left: 3.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">期末资金占用(元)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data2.qmOcc) }}
                </div>
              </div>
              <div class="briefing_items2">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/shoupiaozonge.png"
                      style="width: 13px; height: 13px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">收入合计金额(元)</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ $options.filters.moneyFilter(data2.totalIncome) }}
                </div>
              </div>
              <div class="briefing_items2">
                <div class="briefing_items_top">
                  <div class="bottom_left">
                    <img
                      src="@/../public/img/shoupiaozongshuliang.png"
                      style="width: 13px; height: 13px; margin-left: 2.5px"
                      alt=""
                    />
                  </div>
                  <div class="bottom_right">资金周转率</div>
                </div>
                <div class="briefing_items_bottom">
                  {{ data2.turnoverRate }}
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="12">
          <div class="bottom">
            <div style="display: flex; justify-content: space-between">
              <div style="font-size: 16px">计划收款情况</div>
              <div>
                <el-select
                  size="mini"
                  v-model="sift3"
                  placeholder="月份"
                  @change="getPlanSk"
                >
                  <el-option label="本月" value="本月"></el-option>
                  <el-option label="上月" value="上月"></el-option>
                  <el-option label="本季度" value="本季度"></el-option>
                  <el-option label="上季度" value="上季度"></el-option>
                  <el-option label="本年" value="本年"></el-option>
                  <el-option label="去年" value="去年"></el-option>
                  <el-option label="自定义" value="自定义"></el-option>
                </el-select>
                <el-date-picker
                  @change="getPlanSk"
                  v-if="sift3 == '自定义'"
                  style="margin-left: 10px"
                  size="mini"
                  v-model="time3"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div
              style="display: flex; justify-content: center; margin-top: 40px"
            >
              <div style="width: 591px; height: 61px">
                <div style="display: flex">
                  <div :class="rate > 20 ? 'jindu1b' : 'jindu1'">
                    <div
                      v-if="rate > 0 && rate <= 20"
                      :style="
                        'background-color:#FF576E;height:100%;width:' +
                        (rate / 20) * 100 +
                        '%'
                      "
                    ></div>
                  </div>
                  <div :class="rate > 40 ? 'jindu2b' : 'jindu2'">
                    <div
                      v-if="rate > 20 && rate <= 40"
                      :style="
                        'background-color:#FF576E;height:100%;width:' +
                        ((rate - 20) / 20) * 100 +
                        '%'
                      "
                    ></div>
                  </div>
                  <div :class="rate > 60 ? 'jindu3b' : 'jindu3'">
                    <div
                      v-if="rate > 40 && rate <= 60"
                      :style="
                        'background-color:#FF576E;height:100%;width:' +
                        ((rate - 40) / 20) * 100 +
                        '%'
                      "
                    ></div>
                  </div>
                  <div :class="rate > 80 ? 'jindu4b' : 'jindu4'">
                    <div
                      v-if="rate > 60 && rate <= 80"
                      :style="
                        'background-color:#FF576E;height:100%;width:' +
                        ((rate - 60) / 20) * 100 +
                        '%'
                      "
                    ></div>
                  </div>
                  <div :class="rate > 100 ? 'jindu5b' : 'jindu5'">
                    <div
                      v-if="rate > 80 && rate <= 100"
                      :style="
                        'background-color:#FF576E;height:100%;width:' +
                        ((rate - 80) / 20) * 100 +
                        '%'
                      "
                    ></div>
                  </div>
                </div>
                <div
                  style="
                    margin-top: 15px;
                    height: 1px;
                    width: 582px;
                    background-color: #e8e9ed;
                  "
                ></div>
                <div
                  style="
                    margin-top: 15px;
                    display: flex;
                    position: relative;
                    font-size: 13px;
                  "
                >
                  <div style="margin-top: 20px">0(收款进度)</div>
                  <div :style="'margin-left:' + (rate - 13) + '%'">
                    {{ rate + "%" }}
                  </div>
                  <div style="margin-top: 20px; position: absolute; right: 0">
                    100%
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 92px; margin-top: 40px; display: flex">
              <div style="display: flex; justify-content: center; width: 33%">
                <div style="height: 53px">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: bold;
                      color: #a4b3c4;
                      line-height: 22px;
                    "
                  >
                    计划金额(元)
                  </div>
                  <div
                    style="
                      display: flex;
                      font-size: 22px;
                      font-weight: 400;
                      color: #2d2e3a;
                      line-height: 22px;
                      margin-top: 5px;
                    "
                  >
                    <div
                      style="
                        width: 29px;
                        height: 29px;
                        background: #d6e3f8;
                        border-radius: 50%;
                      "
                    >
                      <img
                        src="@/../public/img/jihuajine.png"
                        style="
                          width: 18px;
                          height: 18px;
                          margin-left: 5px;
                          margin-top: 5px;
                        "
                        alt=""
                      />
                    </div>
                    <div style="margin-top: 3px; margin-left: 3px">
                      {{ $options.filters.moneyFilter(data3.planAmount) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="width: 1px; height: 50px; background-color: #eef0f4"
              ></div>
              <div style="display: flex; justify-content: center; width: 33%">
                <div style="height: 53px">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: bold;
                      color: #a4b3c4;
                      line-height: 22px;
                    "
                  >
                    收款金额(元)
                  </div>
                  <div
                    style="
                      display: flex;
                      font-size: 22px;
                      font-weight: 400;
                      color: #2d2e3a;
                      line-height: 22px;
                      margin-top: 5px;
                    "
                  >
                    <div
                      style="
                        width: 29px;
                        height: 29px;
                        background: #f8d6d6;
                        border-radius: 50%;
                      "
                    >
                      <img
                        src="@/../public/img/shoukuanjine.png"
                        style="
                          width: 18px;
                          height: 18px;
                          margin-left: 5px;
                          margin-top: 5px;
                        "
                        alt=""
                      />
                    </div>
                    <div style="margin-top: 3px; margin-left: 3px">
                      {{ $options.filters.moneyFilter(data3.actualAmount) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="width: 1px; height: 50px; background-color: #eef0f4"
              ></div>
              <div style="display: flex; justify-content: center; width: 33%">
                <div style="height: 53px">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: bold;
                      color: #a4b3c4;
                      line-height: 22px;
                    "
                  >
                    计划余额(元)
                  </div>
                  <div
                    style="
                      display: flex;
                      font-size: 22px;
                      font-weight: 400;
                      color: #2d2e3a;
                      line-height: 22px;
                      margin-top: 5px;
                    "
                  >
                    <div
                      style="
                        width: 29px;
                        height: 29px;
                        background: #d6f8dd;
                        border-radius: 50%;
                      "
                    >
                      <img
                        src="@/../public/img/jihauyue.png"
                        style="
                          width: 22px;
                          height: 20px;
                          margin-left: 4px;
                          margin-top: 3px;
                        "
                        alt=""
                      />
                    </div>
                    <div style="margin-top: 3px; margin-left: 3px">
                      {{ $options.filters.moneyFilter(data3.planBalanceAmount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bottom">
            <div style="display: flex; justify-content: space-between">
              <div style="font-size: 16px">计划付款情况</div>
              <div>
                <el-select
                  size="mini"
                  v-model="sift4"
                  placeholder="月份"
                  @change="getplanFk"
                >
                  <el-option label="本月" value="本月"></el-option>
                  <el-option label="上月" value="上月"></el-option>
                  <el-option label="本季度" value="本季度"></el-option>
                  <el-option label="上季度" value="上季度"></el-option>
                  <el-option label="本年" value="本年"></el-option>
                  <el-option label="去年" value="去年"></el-option>
                  <el-option label="自定义" value="自定义"></el-option>
                </el-select>
                <el-date-picker
                  v-if="sift4 == '自定义'"
                  style="margin-left: 10px"
                  size="mini"
                  v-model="time4"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  @change="getplanFk"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div
              style="display: flex; justify-content: center; margin-top: 40px"
            >
              <div style="width: 591px; height: 61px">
                <div style="width: 591px; height: 61px">
                  <div style="display: flex">
                    <div :class="rate1 > 20 ? 'jindu1c' : 'jindu1'">
                      <div
                        v-if="rate1 > 0 && rate1 <= 20"
                        :style="
                          'background-color:#FFCF27;height:100%;width:' +
                          (rate1 / 20) * 100 +
                          '%'
                        "
                      ></div>
                    </div>
                    <div :class="rate1 > 40 ? 'jindu2c' : 'jindu2'">
                      <div
                        v-if="rate1 > 20 && rate1 <= 40"
                        :style="
                          'background-color:#FFCF27;height:100%;width:' +
                          ((rate1 - 20) / 20) * 100 +
                          '%'
                        "
                      ></div>
                    </div>
                    <div :class="rate1 > 60 ? 'jindu3c' : 'jindu3'">
                      <div
                        v-if="rate1 > 40 && rate1 <= 60"
                        :style="
                          'background-color:#FFCF27;height:100%;width:' +
                          ((rate1 - 40) / 20) * 100 +
                          '%'
                        "
                      ></div>
                    </div>
                    <div :class="rate1 > 80 ? 'jindu4c' : 'jindu4'">
                      <div
                        v-if="rate1 > 60 && rate1 <= 80"
                        :style="
                          'background-color:#FFCF27;height:100%;width:' +
                          ((rate1 - 60) / 20) * 100 +
                          '%'
                        "
                      ></div>
                    </div>
                    <div :class="rate1 > 100 ? 'jindu5c' : 'jindu5'">
                      <div
                        v-if="rate1 > 80 && rate1 <= 100"
                        :style="
                          'background-color:#FFCF27;height:100%;width:' +
                          ((rate1 - 80) / 20) * 100 +
                          '%'
                        "
                      ></div>
                    </div>
                  </div>
                  <div
                    style="
                      margin-top: 15px;
                      height: 1px;
                      width: 582px;
                      background-color: #e8e9ed;
                    "
                  ></div>
                  <div
                    style="
                      margin-top: 15px;
                      display: flex;
                      position: relative;
                      font-size: 13px;
                    "
                  >
                    <div style="margin-top: 20px">0(付款进度)</div>
                    <div :style="'margin-left:' + (rate1 - 13) + '%'">
                      {{ rate1 + "%" }}
                    </div>
                    <div style="margin-top: 20px; position: absolute; right: 0">
                      100%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 92px; margin-top: 40px; display: flex">
              <div style="display: flex; justify-content: center; width: 33%">
                <div style="height: 53px">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: bold;
                      color: #a4b3c4;
                      line-height: 22px;
                    "
                  >
                    计划金额(元)
                  </div>
                  <div
                    style="
                      display: flex;
                      font-size: 22px;
                      font-weight: 400;
                      color: #2d2e3a;
                      line-height: 22px;
                      margin-top: 5px;
                    "
                  >
                    <div
                      style="
                        width: 29px;
                        height: 29px;
                        background: #d6e3f8;
                        border-radius: 50%;
                      "
                    >
                      <img
                        src="@/../public/img/jihuajine.png"
                        style="
                          width: 18px;
                          height: 18px;
                          margin-left: 5px;
                          margin-top: 5px;
                        "
                        alt=""
                      />
                    </div>
                    <div style="margin-top: 3px; margin-left: 3px">
                      {{ $options.filters.moneyFilter(data4.planAmount) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="width: 1px; height: 50px; background-color: #eef0f4"
              ></div>
              <div style="display: flex; justify-content: center; width: 33%">
                <div style="height: 53px">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: bold;
                      color: #a4b3c4;
                      line-height: 22px;
                    "
                  >
                    付款金额(元)
                  </div>
                  <div
                    style="
                      display: flex;
                      font-size: 22px;
                      font-weight: 400;
                      color: #2d2e3a;
                      line-height: 22px;
                      margin-top: 5px;
                    "
                  >
                    <div
                      style="
                        width: 29px;
                        height: 29px;
                        background: #f8d6d6;
                        border-radius: 50%;
                      "
                    >
                      <img
                        src="@/../public/img/shoukuanjine.png"
                        style="
                          width: 18px;
                          height: 18px;
                          margin-left: 5px;
                          margin-top: 5px;
                        "
                        alt=""
                      />
                    </div>
                    <div style="margin-top: 3px; margin-left: 3px">
                      {{ $options.filters.moneyFilter(data4.actualAmount) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="width: 1px; height: 50px; background-color: #eef0f4"
              ></div>
              <div style="display: flex; justify-content: center; width: 33%">
                <div style="height: 53px">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: bold;
                      color: #a4b3c4;
                      line-height: 22px;
                    "
                  >
                    计划余额(元)
                  </div>
                  <div
                    style="
                      display: flex;
                      font-size: 22px;
                      font-weight: 400;
                      color: #2d2e3a;
                      line-height: 22px;
                      margin-top: 5px;
                    "
                  >
                    <div
                      style="
                        width: 29px;
                        height: 29px;
                        background: #d6f8dd;
                        border-radius: 50%;
                      "
                    >
                      <img
                        src="@/../public/img/jihauyue.png"
                        style="
                          width: 22px;
                          height: 20px;
                          margin-left: 4px;
                          margin-top: 3px;
                        "
                        alt=""
                      />
                    </div>
                    <div style="margin-top: 3px; margin-left: 3px">
                      {{ $options.filters.moneyFilter(data4.planBalanceAmount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="12">
          <div class="bottom">
            <div style="display: flex; justify-content: space-between">
              <div style="font-size: 16px">付款情况</div>
              <div>
                <el-select
                  size="mini"
                  v-model="sift5"
                  placeholder="月份"
                  @change="getStatisticFk"
                >
                  <el-option label="本月" value="本月"></el-option>
                  <el-option label="上月" value="上月"></el-option>
                  <el-option label="本季度" value="本季度"></el-option>
                  <el-option label="上季度" value="上季度"></el-option>
                  <el-option label="本年" value="本年"></el-option>
                  <el-option label="去年" value="去年"></el-option>
                  <el-option label="自定义" value="自定义"></el-option>
                </el-select>
                <el-date-picker
                  v-if="sift5 == '自定义'"
                  style="margin-left: 10px"
                  size="mini"
                  v-model="time5"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  @change="getStatisticFk"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div
              style="
                width: 100%;
                height: 220px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-left: 50px;
                overflow: hidden;
              "
            >
              <div style="width: 325px; height: 80px">
                <div
                  style="
                    height: 39px;
                    border-bottom: 1px solid #eef0f4;
                    display: flex;
                    justify-content: space-between;
                  "
                >
                  <div style="display: flex">
                    <div
                      style="
                        width: 8px;
                        height: 27px;
                        background-color: #5d7eeb;
                      "
                    ></div>
                    <div
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 25px;
                        margin-left: 10px;
                      "
                    >
                      应付款
                    </div>
                  </div>

                  <div
                    style="
                      font-size: 22px;
                      font-weight: 400;
                      color: #333333;
                      line-height: 26px;
                    "
                  >
                    {{ $options.filters.moneyFilter(data5.shouldFk) }}
                    <span
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 22px;
                      "
                      >元</span
                    >
                  </div>
                </div>
                <div
                  style="
                    height: 50px;
                    border-bottom: 1px solid #eef0f4;
                    display: flex;
                    justify-content: space-between;
                    padding-top: 13px;
                  "
                >
                  <div style="display: flex">
                    <div
                      style="
                        width: 8px;
                        height: 27px;
                        background-color: #fdab3d;
                      "
                    ></div>
                    <div
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 25px;
                        margin-left: 10px;
                      "
                    >
                      付款
                    </div>
                  </div>

                  <div
                    style="
                      font-size: 22px;
                      font-weight: 400;
                      color: #333333;
                      line-height: 26px;
                    "
                  >
                    {{ $options.filters.moneyFilter(data5.actualFk) }}
                    <span
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 22px;
                      "
                      >元</span
                    >
                  </div>
                </div>
              </div>
              <div id="chart1"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bottom">
            <div style="display: flex; justify-content: space-between">
              <div style="font-size: 16px">收款情况</div>
              <div>
                <el-select
                  size="mini"
                  v-model="sift6"
                  placeholder="月份"
                  @change="getStatisticSk"
                >
                  <el-option label="本月" value="本月"></el-option>
                  <el-option label="上月" value="上月"></el-option>
                  <el-option label="本季度" value="本季度"></el-option>
                  <el-option label="上季度" value="上季度"></el-option>
                  <el-option label="本年" value="本年"></el-option>
                  <el-option label="去年" value="去年"></el-option>
                  <el-option label="自定义" value="自定义"></el-option>
                </el-select>
                <el-date-picker
                  v-if="sift6 == '自定义'"
                  style="margin-left: 10px"
                  size="mini"
                  v-model="time6"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  @change="getStatisticSk"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div
              style="
                width: 100%;
                height: 220px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-left: 50px;
                overflow: hidden;
              "
            >
              <div style="width: 325px; height: 80px">
                <div
                  style="
                    height: 39px;
                    border-bottom: 1px solid #eef0f4;
                    display: flex;
                    justify-content: space-between;
                  "
                >
                  <div style="display: flex">
                    <div
                      style="
                        width: 8px;
                        height: 27px;
                        background-color: #4cccd4;
                      "
                    ></div>
                    <div
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 25px;
                        margin-left: 10px;
                      "
                    >
                      应收款
                    </div>
                  </div>

                  <div
                    style="
                      font-size: 22px;
                      font-weight: 400;
                      color: #333333;
                      line-height: 26px;
                    "
                  >
                    {{ $options.filters.moneyFilter(data6.shouldSk) }}
                    <span
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 22px;
                      "
                      >元</span
                    >
                  </div>
                </div>
                <div
                  style="
                    height: 50px;
                    border-bottom: 1px solid #eef0f4;
                    display: flex;
                    justify-content: space-between;
                    padding-top: 13px;
                  "
                >
                  <div style="display: flex">
                    <div
                      style="
                        width: 8px;
                        height: 27px;
                        background-color: #fd733d;
                      "
                    ></div>
                    <div
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 25px;
                        margin-left: 10px;
                      "
                    >
                      收款
                    </div>
                  </div>

                  <div
                    style="
                      font-size: 22px;
                      font-weight: 400;
                      color: #333333;
                      line-height: 26px;
                    "
                  >
                    {{ $options.filters.moneyFilter(data6.actualSk) }}
                    <span
                      style="
                        font-size: 13px;
                        font-weight: bold;
                        color: #b0bcca;
                        line-height: 22px;
                      "
                      >元</span
                    >
                  </div>
                </div>
              </div>
              <div id="chart2"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import echarts from "echarts";
import {
  getProjectBriefing,
  getFundOccupation,
  getPlanSk,
  getplanFk,
  getStatisticFk,
  getStatisticSk,
  getUserListAll,
  getStListAll,
} from "@/api/project/financialStatement.js";
export default {
  data() {
    return {
      formInline: {
        stId: "",
        agentId: "",
      },
      sift1: "本月",
      time1: [],
      data1: {},
      sift2: "本月",
      time2: [],
      data2: {},
      sift3: "本月",
      time3: [],
      data3: {},
      sift4: "本月",
      time4: [],
      data4: {},
      sift5: "本月",
      time5: [],
      data5: {},
      sift6: "本月",
      time6: [],
      data6: {},
      rate: "",
      rate1: "",
      userList: [],
      stList: [],
      progressRate1: "",
      progressRate2: "",
    };
  },
  mounted() {
    getUserListAll().then((res) => {
      res.rows.forEach((e) => {
        this.userList.push({ label: e.nickName, value: e.userId });
      });
    });
    this.getProjectBriefing();
    this.getFundOccupation();
    this.getPlanSk();
    this.getplanFk();
    this.getStatisticFk();
    this.getStatisticSk();
    this.myEcharts();
    this.myEcharts2();
  },
  methods: {
    chengeUser() {
      this.stList = [];
      getStListAll({ userId: this.formInline.agentId }).then((res) => {
        res.rows.forEach((e) => {
          this.stList.push({ label: e.name, value: e.stId });
        });
      });
    },
    onSubmit() {
      this.getProjectBriefing();
      this.getFundOccupation();
      this.getPlanSk();
      this.getplanFk();
      this.getStatisticFk();
      this.getStatisticSk();
    },
    myEcharts() {
      var myChart = this.$echarts.init(document.getElementById("chart1"));
      var app = {};

      var option;

      var ROOT_PATH =
        "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples";

      var _panelImageURL = ROOT_PATH + "/data/asset/img/custom-gauge-panel.png";
      var _animationDuration = 1000;
      var _animationDurationUpdate = 1000;
      var _animationEasingUpdate = "quarticInOut";
      var _valOnRadianMax = this.data5.shouldFk | 100;
      var _outerRadius = 200;
      var _innerRadius = 170;
      var _pointerInnerRadius = 40;
      var _insidePanelRadius = 140;
      var _currentDataIndex = 0;
      function renderItem(params, api) {
        var valOnRadian = api.value(1);
        var coords = api.coord([api.value(0), valOnRadian]);
        var polarEndRadian = coords[3];
        var imageStyle = {
          image: _panelImageURL,
          x: params.coordSys.cx - _outerRadius,
          y: params.coordSys.cy - _outerRadius,
          width: _outerRadius * 2,
          height: _outerRadius * 2,
        };
        return {
          type: "group",
          children: [
            {
              type: "image",
              style: imageStyle,
              clipPath: {
                type: "sector",
                shape: {
                  cx: params.coordSys.cx,
                  cy: params.coordSys.cy,
                  r: _outerRadius,
                  r0: _innerRadius,
                  startAngle: 0,
                  endAngle: -polarEndRadian,
                  transition: "endAngle",
                  enterFrom: { endAngle: 0 },
                },
              },
            },
            {
              type: "image",
              style: imageStyle,
              clipPath: {
                type: "polygon",
                shape: {
                  points: makePionterPoints(params, polarEndRadian),
                },
                extra: {
                  polarEndRadian: polarEndRadian,
                  transition: "polarEndRadian",
                  enterFrom: { polarEndRadian: 0 },
                },
                during: function (apiDuring) {
                  apiDuring.setShape(
                    "points",
                    makePionterPoints(
                      params,
                      apiDuring.getExtra("polarEndRadian")
                    )
                  );
                },
              },
            },
            {
              type: "circle",
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _insidePanelRadius,
              },
              style: {
                fill: "#fff",
                shadowBlur: 25,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(76,107,167,0.4)",
              },
            },
            {
              type: "text",
              extra: {
                valOnRadian: valOnRadian,
                transition: "valOnRadian",
                enterFrom: { valOnRadian: 0 },
              },
              style: {
                text: makeText(valOnRadian),
                fontSize: 50,
                fontWeight: 700,
                x: params.coordSys.cx,
                y: params.coordSys.cy,
                fill: "rgb(0,50,190)",
                align: "center",
                verticalAlign: "middle",
                enterFrom: { opacity: 0 },
              },
              during: function (apiDuring) {
                apiDuring.setStyle(
                  "text",
                  makeText(apiDuring.getExtra("valOnRadian"))
                );
              },
            },
          ],
        };
      }
      function convertToPolarPoint(renderItemParams, radius, radian) {
        return [
          Math.cos(radian) * radius + renderItemParams.coordSys.cx,
          -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
        ];
      }
      function makePionterPoints(renderItemParams, polarEndRadian) {
        return [
          convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
          convertToPolarPoint(
            renderItemParams,
            _outerRadius,
            polarEndRadian + Math.PI * 0.03
          ),
          convertToPolarPoint(
            renderItemParams,
            _pointerInnerRadius,
            polarEndRadian
          ),
        ];
      }
      function makeText(valOnRadian) {
        // Validate additive animation calc.
        if (valOnRadian < -10) {
          alert("illegal during val: " + valOnRadian);
        }
        return _valOnRadianMax == 0
          ? 0
          : ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + "%";
      }
      option = {
        animationEasing: _animationEasingUpdate,
        animationDuration: _animationDuration,
        animationDurationUpdate: _animationDurationUpdate,
        animationEasingUpdate: _animationEasingUpdate,
        dataset: {
          source: [[0, this.data5.progressRate | 0]],
        },
        tooltip: {},
        angleAxis: {
          type: "value",
          startAngle: 0,
          show: false,
          min: 0,
          max: _valOnRadianMax,
        },
        radiusAxis: {
          type: "value",
          show: false,
        },
        polar: {},
        series: [
          {
            type: "custom",
            coordinateSystem: "polar",
            renderItem: renderItem,
          },
        ],
      };
      myChart.setOption(option);
    },
    myEcharts2() {
      var myChart = this.$echarts.init(document.getElementById("chart2"));
      var app = {};

      var option;

      var ROOT_PATH =
        "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples";

      var _panelImageURL = ROOT_PATH + "/data/asset/img/custom-gauge-panel.png";
      var _animationDuration = 1000;
      var _animationDurationUpdate = 1000;
      var _animationEasingUpdate = "quarticInOut";
      var _valOnRadianMax = this.data6.shouldSk | 100;
      var _outerRadius = 200;
      var _innerRadius = 170;
      var _pointerInnerRadius = 40;
      var _insidePanelRadius = 140;
      var _currentDataIndex = 0;
      function renderItem(params, api) {
        var valOnRadian = api.value(1);
        var coords = api.coord([api.value(0), valOnRadian]);
        var polarEndRadian = coords[3];
        var imageStyle = {
          image: _panelImageURL,
          x: params.coordSys.cx - _outerRadius,
          y: params.coordSys.cy - _outerRadius,
          width: _outerRadius * 2,
          height: _outerRadius * 2,
        };
        return {
          type: "group",
          children: [
            {
              type: "image",
              style: imageStyle,
              clipPath: {
                type: "sector",
                shape: {
                  cx: params.coordSys.cx,
                  cy: params.coordSys.cy,
                  r: _outerRadius,
                  r0: _innerRadius,
                  startAngle: 0,
                  endAngle: -polarEndRadian,
                  transition: "endAngle",
                  enterFrom: { endAngle: 0 },
                },
              },
            },
            {
              type: "image",
              style: imageStyle,
              clipPath: {
                type: "polygon",
                shape: {
                  points: makePionterPoints(params, polarEndRadian),
                },
                extra: {
                  polarEndRadian: polarEndRadian,
                  transition: "polarEndRadian",
                  enterFrom: { polarEndRadian: 0 },
                },
                during: function (apiDuring) {
                  apiDuring.setShape(
                    "points",
                    makePionterPoints(
                      params,
                      apiDuring.getExtra("polarEndRadian")
                    )
                  );
                },
              },
            },
            {
              type: "circle",
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _insidePanelRadius,
              },
              style: {
                fill: "#fff",
                shadowBlur: 25,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(76,107,167,0.4)",
              },
            },
            {
              type: "text",
              extra: {
                valOnRadian: valOnRadian,
                transition: "valOnRadian",
                enterFrom: { valOnRadian: 0 },
              },
              style: {
                text: makeText(valOnRadian),
                fontSize: 50,
                fontWeight: 700,
                x: params.coordSys.cx,
                y: params.coordSys.cy,
                fill: "rgb(0,50,190)",
                align: "center",
                verticalAlign: "middle",
                enterFrom: { opacity: 0 },
              },
              during: function (apiDuring) {
                apiDuring.setStyle(
                  "text",
                  makeText(apiDuring.getExtra("valOnRadian"))
                );
              },
            },
          ],
        };
      }
      function convertToPolarPoint(renderItemParams, radius, radian) {
        return [
          Math.cos(radian) * radius + renderItemParams.coordSys.cx,
          -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
        ];
      }
      function makePionterPoints(renderItemParams, polarEndRadian) {
        return [
          convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
          convertToPolarPoint(
            renderItemParams,
            _outerRadius,
            polarEndRadian + Math.PI * 0.03
          ),
          convertToPolarPoint(
            renderItemParams,
            _pointerInnerRadius,
            polarEndRadian
          ),
        ];
      }
      function makeText(valOnRadian) {
        // Validate additive animation calc.
        if (valOnRadian < -10) {
          alert("illegal during val: " + valOnRadian);
        }
        return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + "%";
      }
      option = {
        animationEasing: _animationEasingUpdate,
        animationDuration: _animationDuration,
        animationDurationUpdate: _animationDurationUpdate,
        animationEasingUpdate: _animationEasingUpdate,
        dataset: {
          source: [[0, this.data6.progressRate | 0]],
        },
        tooltip: {},
        angleAxis: {
          type: "value",
          startAngle: 0,
          show: false,
          min: 0,
          max: _valOnRadianMax,
        },
        radiusAxis: {
          type: "value",
          show: false,
        },
        polar: {},
        series: [
          {
            type: "custom",
            coordinateSystem: "polar",
            renderItem: renderItem,
          },
        ],
      };
      myChart.setOption(option);
    },
    getProjectBriefing() {
      getProjectBriefing({
        agentId: this.formInline.agentId,
        stId: this.formInline.stId,
        interval: this.sift1,
        dateFrom: this.time1[0],
        dateTo: this.time1[1],
      }).then((res) => {
        this.data1 = res.data;
      });
    },
    getFundOccupation() {
      getFundOccupation({
        agentId: this.formInline.agentId,
        stId: this.formInline.stId,
        dateFrom: this.time2[0],
        dateTo: this.time2[1],
      }).then((res) => {
        this.data2 = res.data;
      });
    },
    getPlanSk() {
      getPlanSk({
        agentId: this.formInline.agentId,
        stId: this.formInline.stId,
        interval: this.sift3,
        dateFrom: this.time3[0],
        dateTo: this.time3[1],
      }).then((res) => {
        this.data3 = res.data;
        this.rate = this.data3.progressRate;
      });
    },
    getplanFk() {
      getplanFk({
        agentId: this.formInline.agentId,
        stId: this.formInline.stId,
        interval: this.sift4,
        dateFrom: this.time4[0],
        dateTo: this.time4[1],
      }).then((res) => {
        this.data4 = res.data;
        this.rate1 = this.data4.progressRate;
      });
    },
    getStatisticFk() {
      getStatisticFk({
        agentId: this.formInline.agentId,
        stId: this.formInline.stId,
        interval: this.sift5,
        dateFrom: this.time5[0],
        dateTo: this.time5[1],
      }).then((res) => {
        this.data5 = res.data;
        this.progressRate1 = res.data.progressRate;
        this.myEcharts();
      });
    },
    getStatisticSk() {
      getStatisticSk({
        agentId: this.formInline.agentId,
        stId: this.formInline.stId,
        interval: this.sift6,
        dateFrom: this.time6[0],
        dateTo: this.time6[1],
      }).then((res) => {
        this.data6 = res.data;
        this.progressRate2 = res.data.progressRate;
        this.myEcharts2();
      });
    },
  },
};
</script>

<style lang="scss">
.jindu1 {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #e8e9ed;
}
.jindu2 {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #e8e9ed;
}
.jindu3 {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #e8e9ed;
}
.jindu4 {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #e8e9ed;
}
.jindu5 {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #e8e9ed;
}
.jindu1b {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #00c18a;
}
.jindu2b {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #00c18a;
}
.jindu3b {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #00c18a;
}
.jindu4b {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #00c18a;
}
.jindu5b {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #00c18a;
}
.jindu1c {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #0000f1;
}
.jindu2c {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #0000f1;
}
.jindu3c {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #0000f1;
}
.jindu4c {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #0000f1;
}
.jindu5c {
  width: 115px;
  height: 22px;
  margin-right: 2px;
  background: #0000f1;
}
.report {
  #chart1 {
    height: 750px;
    width: 750px;
    transform: scale(0.4);
  }
  #chart2 {
    height: 750px;
    width: 750px;
    transform: scale(0.4);
  }
  background-color: #fafafa;
  .report_top {
    height: 64px;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(146, 153, 161, 0.28);
    .demo-form-inline {
      display: flex;
      justify-content: end;
      padding-top: 15px;
    }
  }
  .report_bottom {
    margin: 22px;
    .briefing {
      display: flex;
      margin-top: 10px;
      .briefing_items {
        width: 16%;
        margin-left: 1%;
        height: 97px;
        background: linear-gradient(266deg, #eaf2ff, #f0e9fb);
        .briefing_items_top {
          margin-top: 20px;
          display: flex;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
          justify-content: center;
          .bottom_left {
            width: 18px;
            height: 18px;
            background: linear-gradient(266deg, #3b58f2, #5927d8);
            border-radius: 50%;
          }
          .bottom_right {
            margin-left: 5px;
            font-size: 10px;
          }
        }
        .briefing_items_bottom {
          font-size: 20px;
          font-weight: 400;
          color: #333333;
          line-height: 32px;
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }
      }
      .briefing_items2 {
        width: 25%;
        margin-left: 1%;
        height: 97px;
        background: linear-gradient(266deg, #f6f7fb, #f3f7fa);
        .briefing_items_top {
          margin-top: 20px;
          display: flex;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
          justify-content: center;
          .bottom_left {
            width: 18px;
            height: 18px;
            background: linear-gradient(266deg, #ceced0, #98979d);
            border-radius: 50%;
          }
          .bottom_right {
            margin-left: 5px;
            font-size: 10px;
          }
        }
        .briefing_items_bottom {
          font-size: 20px;
          font-weight: 400;
          color: #333333;
          line-height: 32px;
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }
      }
    }
    .bottom {
      height: 282px;
      background: #ffffff;
      box-shadow: 0px 0px 6px 0px rgba(146, 153, 161, 0.28);
      padding: 20px;
    }
  }
}
</style>
