<style scoped>
.head-title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
  margin-top: 30px;
  margin-left: 20px;
}
.head-text{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
}
.head-text1{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 53px;
}
.head-text span{
  display: block;
  width:220px;
  line-height:30px;
  margin-top:0px
}

.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
.newproColor{
  color: red;
  width: 80px;
  min-width: 80px!important;
}
.dtdTitle{
  width: 80px;
  min-width: 80px;
}

</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <!--    合同信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="随车数质量信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #FF0000;">{{stateF(form.state)}}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">项目名称</td>
              <td class="tdCoent">{{form.projectName}}</td>
              <td class="tdTitle">业务名称</td>
              <td class="tdCoent">{{form.stName}}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.serialNo}}</td>
            </tr>
            <tr>
              <td class="tdTitle">物流公司</td>
              <td class="tdCoent">{{form.tpcName}}</td>
              <td class="tdTitle">货品名称</td>
              <td class="tdCoent">{{form.name}}</td>
              <td class="tdTitle">重量(吨)</td>
              <td class="tdCoent">{{$options.filters.weightFilter(form.grnNumber)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">发货日期</td>
              <td class="tdCoent">{{parseTime(form.deliveryTime, '{y}-{m}-{d}')}}</td>
              <td class="tdTitle">热值</td>
              <td class="tdCoent">{{form.grnRz}}</td>
              <td class="tdTitle">运输方式</td>
              <td class="tdCoent">{{form.transportType}}</td>
            </tr>
            <tr>
              <td class="tdTitle">车数</td>
              <td class="tdCoent">{{form.carNumber}}</td>
              <td class="tdTitle">批次</td>
              <td class="tdCoent">{{form.batch}}</td>
              <td class="tdTitle">基准单价(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.basePrice)}}</td>
            </tr>
          </table>
        </el-col>
        </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>项目名称：</div><span v-text="form.projectName"></span>
          </div>
          <div style="display:flex">
            <div>业务名称：</div><span v-text="form.stName"></span>
          </div>
          <div style="display:flex">
            <div>项目编号：</div><span v-text="form.serialNo"></span>
          </div>
          <div style="display:flex">
            <div>物流公司：</div><span v-text="form.wlCompany"></span>
          </div>
          <div style="display:flex">
            <div>货品名称：</div><span v-text="form.name"></span>
          </div>
          <div style="display:flex">
            <div>入库重量(吨)：</div><span v-text="$options.filters.weightFilter(form.grnNumber)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>发货日期：</div><span>{{ parseTime(form.deliveryTime, '{y}-{m}-{d}') }}</span>
          </div>
          <div style="display:flex">
            <div>入库热值：</div><span v-text="form.grnRz"></span>
          </div>
          <div style="display:flex">
            <div>运输方式：</div><span v-text="form.transportType"></span>
          </div>
          <div style="display:flex">
            <div>车数：</div><span v-text="form.carNumber"></span>
          </div>
          <div style="display:flex">
            <div>批次：</div><span v-text="form.batch"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>基准单价(元)：</div><span v-text="$options.filters.moneyFilter(form.basePrice)"></span>
          </div>
        </el-col>
      </el-row> -->
      <el-row style="margin-top: 30px;">
        <el-col :span="22" :offset="1">
          <el-table :data="tabledatas" fit style="margin-bottom: 22px;">
            <el-table-column label="水分(%)">
              <template slot-scope="scope">
                <span v-text="form.coalSf"></span>
              </template>
            </el-table-column>
            <el-table-column label="内水(%)">
              <template>
                <span v-text="form.coalNs" />
              </template>
            </el-table-column>
            <el-table-column label="灰份(%)">
              <el-table-column label="Aad">
                <template prop="coalAad">
                  <span v-text="form.coalAad" />
                </template>
              </el-table-column>
              <el-table-column label="ad">
                <template prop="coalAd">
                  <span v-text="form.coalAd" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="挥发份(%)">
              <el-table-column label="Vda">
                <template prop="coalVda">
                  <span v-text="form.coalVda" />
                </template>
              </el-table-column>
              <el-table-column label="Vdaf">
                <template prop="coalVdae">
                  <span v-text="form.coalVdae" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="灰熔点(℃)">
              <template prop="coalHrd">
                <span v-text="form.coalHrd" />
              </template>
            </el-table-column>
            <el-table-column label="固定碳(%)">
              <template prop="coalGdt">
                <span v-text="form.coalGdt" />
              </template>
            </el-table-column>
            <el-table-column label="含硫量(%)">
              <template prop="coalHll">
                <span v-text="form.coalHll" />
              </template>
            </el-table-column>
            <el-table-column label="热值(%)">
              <el-table-column label="Qgr,ad">
                <template prop="coalQgrad">
                  <span v-text="form.coalQgrad" />
                </template>
              </el-table-column>
              <el-table-column label="Qnt,ar">
                <template prop="coalQntar">
                  <span v-text="form.coalQntar" />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="head-title" style="margin-left: 0px;">
        <el-col :span="12" :offset="1">
          <el-form-item label="奖惩"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle dtdTitle">水分</td>
              <td class="tdCoent newproColor">{{form.jc1}}</td>
              <td class="tdTitle dtdTitle">内水</td>
              <td class="tdCoent newproColor">{{form.jc2}}</td>
              <td class="tdTitle dtdTitle">灰份Aad</td>
              <td class="tdCoent newproColor">{{form.jc3}}</td>
              <td class="tdTitle dtdTitle">灰份ad</td>
              <td class="tdCoent newproColor">{{form.jc10}}</td>
              <td class="tdTitle dtdTitle">挥发份Vda</td>
              <td class="tdCoent newproColor">{{form.jc4}}</td>
              <td class="tdTitle dtdTitle">挥发份Vdaf</td>
              <td class="tdCoent newproColor">{{form.jc11}}</td>
            </tr>
            <tr>
              <td class="tdTitle dtdTitle">灰熔点</td>
              <td class="tdCoent newproColor">{{form.jc5}}</td>
              <td class="tdTitle dtdTitle">固定碳</td>
              <td class="tdCoent newproColor">{{form.jc6}}</td>
              <td class="tdTitle dtdTitle">含硫量</td>
              <td class="tdCoent newproColor">{{form.jc7}}</td>
              <td class="tdTitle dtdTitle">热值Qgr,ad</td>
              <td class="tdCoent newproColor">{{form.jc8}}</td>
              <td class="tdTitle dtdTitle">热值Qnt,ar</td>
              <td class="tdCoent newproColor">{{form.jc9}}</td>
              <td class="tdTitle dtdTitle">热值Kcal</td>
              <td class="tdCoent newproColor">{{form.jc12}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text1">
        <el-col :span="20" :offset="1">
          <el-form-item label="">
            <span>水分：<span style="color: red" v-text="form.jc1">0.00</span></span>
            <span style="margin-left: 20px;">内水：<span style="color: red" v-text="form.jc2">0.00</span></span>
            <span style="margin-left: 20px;">灰份Aad：<span style="color: red" v-text="form.jc3">0.00</span></span>
            <span style="margin-left: 20px;">灰份ad：<span style="color: red" v-text="form.jc10">0.00</span></span>
            <span style="margin-left: 20px;">挥发份Vda：<span style="color: red" v-text="form.jc4">0.00</span></span>
            <span style="margin-left: 20px;">挥发份Vdaf：<span style="color: red" v-text="form.jc11">0.00</span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text1">
        <el-col :span="20" :offset="1">
          <el-form-item label="">
            <span>灰熔点：<span style="color: red" v-text="form.jc5">0.00</span></span>
            <span style="margin-left: 20px;">固定碳：<span style="color: red" v-text="form.jc6">0.00</span></span>
            <span style="margin-left: 20px;">含硫量：<span style="color: red" v-text="form.jc7">0.00</span></span>
            <span style="margin-left: 20px;">热值Qgr,ad：<span style="color: red" v-text="form.jc8">0.00</span></span>
            <span style="margin-left: 20px;">热值Qnt,ar：<span style="color: red" v-text="form.jc9">0.00</span></span>
            <span style="margin-left: 20px;">热值Kcal：<span style="color: red" v-text="form.jc12">0.00</span></span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row class="head-text" style="margin-top: 30px;">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">货值单价(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.valuePrice)}}</td>
              <td class="tdTitle">货值总价(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.valueTprice)}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
        </el-row>
     <!-- <el-row class="head-text1">
        <el-col :span="5" :offset="1">
          货值单价(元)：<span v-text="$options.filters.moneyFilter(form.valuePrice)"></span>
        </el-col>
        <el-col :span="5">
          货值总价(元)：<span v-text="$options.filters.moneyFilter(form.valueTprice)"></span>
        </el-col>
      </el-row> -->

      <el-row class="head-text1">
        <el-col :span="12" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file">
            <!-- <el-upload
              disabled
              :action="url"
              :headers="headers"
              class="upload-hidden"
              :on-preview="handlePreview"
              list-type="text"
              :file-list="fileList">
            </el-upload> -->
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      审批流程·-->
      <approval-process :typeId="10" :stId="grnId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="10" :stId="grnId"></approval-record>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right;margin-bottom: 50px;margin-right: 50px;">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {getGrn} from "@/api/project/grn";
import {getProcessData, getProcessDataByStId} from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //煤炭质量集合
      zlList:[],
      tabledatas: [
        {show:true}
      ],
      //附件集合
      fileList: [],
      // 表单参数
      form: {},
      grnId:""
    };
  },
  created() {
    const grnId = this.$route.params && this.$route.params.grnId;
    this.grnId=grnId
    getGrn(grnId).then(response => {
      this.form=response.data
      this.fileList = response.data.fileList;
    })
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
