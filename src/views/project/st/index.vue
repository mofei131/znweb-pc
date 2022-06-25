<template>
  <div class="app-container projectlist">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称">
        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable />
      </el-form-item>
      <el-form-item label="立项编号">
        <el-input v-model="queryParams.projectNo" placeholder="请输入立项编号" clearable />
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input v-model="queryParams.serialNo" placeholder="请输入项目编号" clearable />
      </el-form-item>
      <el-form-item label="代办人">
        <el-select filterable v-model="queryParams.userId" placeholder="请选择代办人" clearable>
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务名称" prop="stName">
        <el-input v-model="queryParams.stName" placeholder="业务名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['project:st:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="topicTable" v-loading="loading" :data="stList" row-key="projectId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="立项编号" align="center" prop="projectNo" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="业务类型" align="center">
        <template slot-scope="scope" v-if="scope.row.hType == '项目'">
          {{ changeBusinessType(scope.row.businessType) }}
        </template>
      </el-table-column>
      <el-table-column label="业务经理" align="center" prop="serviceManagerName" />
      <el-table-column label="货运方式" align="center">
        <template slot-scope="scope" v-if="scope.row.hType == '项目'">
          {{ changeTransType(scope.row.transType) }}
        </template>
      </el-table-column>
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{
              parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <div :style="'color:' + scope.row.scolor">{{ stateChange(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="业务状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.state == 3 && scope.row.hType == '业务'" :style="'color:' + scope.row.bcolor">
            {{ businessStateChange(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.hType == '项目' && scope.row.businessList.length != 0" size="mini" type="text"
            @click="toggleRowExpansion1(scope.row)">展开业务</el-button>
          <el-button v-if="scope.row.hType == '项目' && scope.row.businessList.length != 0" size="mini" type="text"
            @click="toggleRowExpansion2(scope.row)">关闭业务</el-button>
          <el-button v-if="scope.row.hType == '项目'" size="mini" type="text" v-hasPermi="['project:st:edit']"
            @click="openCheckProject(scope.row)">查看项目</el-button>
          <!-- <el-button size="mini" type="text" v-if="scope.row.hType == '项目'"
            @click="openChangeProject(scope.row)" v-hasPermi="['project:st:edit']">修改项目</el-button> -->
          <el-button size="mini" type="text" v-hasPermi="['project:st:edit']"
            v-if="scope.row.hType == '项目' && scope.row.state == 3" @click="openBusinessBox(scope.row)">添加业务
          </el-button>
          <el-button size="mini" type="text" v-if="scope.row.hType == '业务'" v-hasPermi="['project:st:edit']"
            @click="jumpBusiness(scope.row)">业务明细</el-button>
          <!-- <el-button size="mini" type="text" v-if="scope.row.hType == '业务'" @click="openChangeBusiness(scope.row)"
            v-hasPermi="['project:st:edit']">修改业务</el-button> -->
          <el-button size="mini"
            v-if="scope.row.hType == '业务' && scope.row.state == 3 && (scope.row.businessState == 1 || scope.row.businessState == 2)"
            type="text" v-hasPermi="['project:st:edit']" @click="openOperateBusiness(scope.row)">
            操作业务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog title="添加项目信息" :visible.sync="openAddBox" width="888px">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="立项类型" prop="projectType">
              <el-radio v-model="form1.projectType" label="一般立项">一般立项</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form1.projectName" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代办人" prop="userId">
              <el-select @change="changeUser" filterable value-key="userId" v-model="form1.userId" placeholder="请选择代办人"
                style="width: 100%">
                <el-option v-for="user in userOptions" :key="user.userId" :label="user.nickName" :value="user.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务经理" prop="serviceManagerId">
              <el-select @change="changeServiceManagerName" filterable value-key="serviceManagerId"
                v-model="form1.serviceManagerId" placeholder="请选择业务经理" style="width: 100%">
                <el-option v-for="user in userOptions" :key="user.userId" :label="user.nickName" :value="user.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务实控人" prop="actualControlId">
              <el-select @change="changeActualControlName" filterable value-key="id" v-model="form1.actualControlId"
                placeholder="请选择业务实控人" style="width: 100%">
                <el-option v-for="user in actualControlOptions" :key="user.id" :label="user.actualControlPerson"
                  :value="user.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务类型" prop="businessType">
              <el-select filterable value-key="value" v-model="form1.businessType" placeholder="请选择业务类型"
                style="width: 100%">
                <el-option v-for="obj in businessTypeList" :key="obj.value" :label="obj.label" :value="obj.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货运方式" prop="freightMode">
              <el-select filterable value-key="value" v-model="form1.freightMode" placeholder="请选择货运方式"
                style="width: 100%">
                <el-option v-for="obj in transType" :key="obj.value" :label="obj.label" :value="obj.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select @change="changeSupplierName" filterable value-key="supplierId" v-model="form1.supplierId"
                placeholder="请选择供应商" style="width: 100%">
                <el-option v-for="obj in supplierOptions" :key="obj.supplierId" :label="obj.name"
                  :value="obj.supplierId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端客户名称" prop="terminalId">
              <el-select @change="changetName" filterable value-key="terminalId" style="width: 100%"
                v-model="form1.terminalId" placeholder="请选择终端客户">
                <el-option v-for="obj in terminalOptions" :key="obj.terminalId" :label="obj.name"
                  :value="obj.terminalId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收费模式" prop="chargemType">
              <el-radio-group v-model="form1.chargemType">
                <el-radio label="1">年息</el-radio>
                <el-radio label="2">固定差价</el-radio>
                <el-radio label="3">年息+固定差价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div v-if="form1.chargemType == '1' || form1.chargemType == '3'">
              <el-form-item label="年息服务费费率(%)" prop="chargemNx">
                <el-input v-model="form1.chargemNx" placeholder="请输入年息" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div v-if="form1.chargemType == '2' || form1.chargemType == '3'">
              <el-form-item label="固定差价(元)" prop="chargemGd">
                <el-input v-model="form1.chargemGd" placeholder="请输入固定差价" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="node">
              <el-input type="textarea" v-model="form1.node" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="附件" prop="file">
              <el-upload class="upload-demo" :action="url" :headers="headers" :on-preview="handlePreview"
                :on-remove="handleRemove" :on-success="uploadSuccess" :on-error="uploadError"
                :before-remove="beforeRemove" multiple :limit="5" :on-exceed="handleExceed" :file-list="fileList">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加业务信息" :visible.sync="openAddBusinessBox" width="888px">
      <div style="font-weight: 600; margin-bottom: 20px;font-size:16px">项目信息</div>
      <div style="padding: 20px">
        <el-descriptions :column="2" border>
          <el-descriptions-item>
            <template slot="label">立项类型</template>{{ projectInfo.projectType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">立项编号</template>{{ projectInfo.projectNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目名称</template>{{ projectInfo.projectName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目编号</template>{{ projectInfo.serialNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">供应商</template>{{ projectInfo.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">代办人</template>{{ projectInfo.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">终端客户</template>{{ projectInfo.terminalName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务经理</template>{{ projectInfo.serviceManagerName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务类型</template>{{ changeBusinessType(projectInfo.businessType) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务实控人</template>{{ projectInfo.actualControlName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">收费模式</template>{{ projectInfo.chargemType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">货运方式</template>{{ changeTransType(projectInfo.freightMode) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">年服务费率(%)</template>{{ projectInfo.chargemNx }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">固定差价(元)</template>{{ projectInfo.chargemGd }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">备注说明</template>{{ projectInfo.node }}
          </el-descriptions-item>
          <el-descriptions-item></el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">附件</template>
            <custom-upload :fileList="projectInfo.filesList"></custom-upload>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="font-weight: 600; margin-bottom: 40px;margin-top:20px;font-size:16px">业务信息</div>
      <el-form ref="form2" :model="form2" :rules="rules2" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务名称" prop="stName">
              <el-input v-model="form2.stName" placeholder="业务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务金额(万元)" prop="stAmount">
              <el-input v-model="form2.stAmount" placeholder="请输入业务金额" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算比例" prop="settlementP">
              <el-select v-model="form2.settlementP" placeholder="请选择结算比例" style="width: 100%">
                <el-option v-for="obj in settlementPOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div v-if="form2.settlementP == '其他'">
            <el-col :span="3">
              <el-form-item label="" prop="settlementPA1" label-width="10px">
                <span>
                  <el-input v-model="form2.settlementPA1" placeholder="" style="width: 80%" />
                </span><span>%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" prop="settlementPA2" label-width="10px">
                <span>
                  <el-input v-model="form2.settlementPA2" placeholder="" style="width: 80%" />
                </span><span>%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" prop="settlementPA3" label-width="10px">
                <span>
                  <el-input v-model="form2.settlementPA3" placeholder="" style="width: 80%" />
                </span><span>%</span>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="履约保证金" prop="marginType">
              <el-radio-group v-model="form2.marginType">
                <el-radio label="1">有</el-radio>
                <el-radio label="2">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div v-if="form2.marginType == '1'">
              <el-form-item label="履约保证金金额（万元）" prop="margin">
                <el-input v-model="form2.margin" placeholder="请输入履约保证金" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务周期开始" prop="cycleStart">
              <el-date-picker clearable style="width: 100%" v-model="form2.cycleStart" @change="jsprice" type="date"
                value-format="yyyy-MM-dd" placeholder="选择服务周期开始">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务周期结束" prop="cycleEnd">
              <el-date-picker clearable style="width: 100%" v-model="form2.cycleEnd" @change="jsprice" type="date"
                value-format="yyyy-MM-dd" placeholder="选择服务周期结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计单价(元)" prop="expectPrice">
              <el-input v-model="form2.expectPrice" placeholder="请输入预计单价" @change="jsprice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计重量(吨)" prop="expectWeight">
              <el-input v-model="form2.expectWeight" placeholder="请输入预计重量" @change="jsprice" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成本年服务费费率(%)" prop="rateYear">
              <el-input v-model="form2.rateYear" placeholder="请输入成本年服务费费率" @change="jsprice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计利润" prop="expectProfits">
              <el-input v-model="form2.expectProfits" placeholder="请输入预计利润" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自融资金方" prop="shType">
              <el-radio-group v-model="form2.shType">
                <el-radio label="1">有</el-radio>
                <el-radio label="2">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form2.shType == '1'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="shName">
                <el-input v-model="form2.shName" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性质" prop="shXz">
                <el-select v-model="form2.shXz" style="width: 100%" placeholder="请选择性质">
                  <el-option v-for="obj in shXzOptions" :key="obj.key" :label="obj.label" :value="obj.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合作方式" prop="shHztype">
                <el-select v-model="form2.shHztype" style="width: 100%" placeholder="请选择合作方式">
                  <el-option v-for="obj in shHztypeOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div v-if="form2.shHztype == '年息收取'">
                <el-form-item label="资金费率(%)" prop="shHzrate">
                  <el-input v-model="form2.shHzrate" placeholder="请输入资金费率" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="下游渠道" prop="shChanneltype">
                <el-radio-group v-model="form2.shChanneltype">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="2">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div v-if="form2.shChanneltype == '1'">
                <el-form-item label="下游渠道年限" prop="shChannelyear">
                  <el-select v-model="form2.shChannelyear" style="width: 100%" placeholder="请选择下游渠道年限">
                    <el-option v-for="obj in shChannelyearOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="结算比例" prop="shSettlement">
                <el-select v-model="form2.shSettlement" style="width: 100%" placeholder="请选择结算比例">
                  <el-option v-for="obj in shSettlementOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-if="form2.shSettlement == '其他'">
              <el-col :span="3">
                <el-form-item label="" prop="shSettlementA1" label-width="10px">
                  <span>
                    <el-input v-model="form2.shSettlementA1" placeholder="" style="width: 80%" />
                  </span><span>%</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="" prop="shSettlementA2" label-width="10px">
                  <span>
                    <el-input v-model="form2.shSettlementA2" placeholder="" style="width: 80%" />
                  </span><span>%</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="" prop="shSettlementA3" label-width="10px">
                  <span>
                    <el-input v-model="form2.shSettlementA3" placeholder="" style="width: 80%" />
                  </span><span>%</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="履约保证金" prop="shMargintype">
                <el-radio-group v-model="form2.shMargintype">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="2">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <div v-if="form2.shMargintype == '1'">
              <el-col :span="12">
                <el-form-item label="履约保证金(元)" prop="shMargin">
                  <el-input v-model="form2.shMargin" placeholder="请输入履约保证金" />
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同签署" prop="shContracttype">
                <el-select v-model="form2.shContracttype" style="width: 100%" placeholder="请选择合同签署">
                  <el-option v-for="obj in shContracttypeOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="站台情况" prop="platformType">
          <el-radio-group v-model="form2.platformType">
            <el-radio label="1">有</el-radio>
            <el-radio label="2">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form2.platformType == '1'">
          <div v-for="(item, index) in form2.ztList" :key="index">
            <el-row>
              <el-col :span="12">
                <el-form-item label="站台名称" prop="ztId">
                  <el-select v-model="item.ztId" style="width: 100%" placeholder="请选择站台">
                    <el-option v-for="obj in platformList" :key="obj.id" :label="obj.ztName" :value="obj.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="站台费用" prop="ztFee">
                  <el-input v-model="item.ztFee" placeholder="请输入站台费用" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运费" prop="freight">
                  <el-input v-model="item.freight" placeholder="请输入运费" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button size="small" style="margin-left:30px" type="primary" @click="addZt(index)">添加站台</el-button>
                <el-button size="small" type="danger" @click="deleteZt(index)">删除站台</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="node">
              <el-input type="textarea" v-model="form2.node" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="附件" prop="file">
              <el-upload class="upload-demo" :action="url" :headers="headers" :on-preview="handlePreview2"
                :on-remove="handleRemove2" :on-success="uploadSuccess2" :on-error="uploadError2"
                :before-remove="beforeRemove2" multiple :limit="5" :on-exceed="handleExceed2" :file-list="fileList">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm2">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目信息" :visible.sync="checkProject" width="888px">
      <div style="padding: 20px">
        <el-descriptions title="" :column="2" border>
          <el-descriptions-item>
            <template slot="label">立项类型</template>{{ projectInfo.projectType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">立项编号</template>{{ projectInfo.projectNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目名称</template>{{ projectInfo.projectName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目编号</template>{{ projectInfo.serialNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">供应商</template>{{ projectInfo.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">代办人</template>{{ projectInfo.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">终端客户</template>{{ projectInfo.terminalName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务经理</template>{{ projectInfo.serviceManagerName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务类型</template>{{ changeBusinessType(projectInfo.businessType) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务实控人</template>{{ projectInfo.actualControlName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">收费模式</template>{{ projectInfo.chargemType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">货运方式</template>{{ changeTransType(projectInfo.freightMode) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">年服务费率(%)</template>{{ projectInfo.chargemNx }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">固定差价(元)</template>{{ projectInfo.chargemGd }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">备注说明</template>{{ projectInfo.node }}
          </el-descriptions-item>
          <el-descriptions-item></el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">附件</template>
            <custom-upload :fileList="projectInfo.filesList"></custom-upload>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
    <el-dialog title="操作业务" :visible.sync="operateBusiness" width="600px">
      <el-form ref="form3" :model="form3" :rules="rules3" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作业务" prop="businessState">
              <el-select @change="changeSupplierName" filterable value-key="value" v-model="form3.businessState"
                placeholder="请选择供应商" style="width: 100%">
                <el-option v-if="businessState == 1" label="异常" value="2"></el-option>
                <el-option v-if="businessState == 2" label="继续" value="1"></el-option>
                <el-option v-if="businessState == 2" label="结束" value="3"></el-option>
                <el-option v-if="businessState == 1" label="完成" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="node">
              <el-input type="textarea" v-model="form3.node" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="附件" prop="file">
              <el-upload class="upload-demo" :action="url" :headers="headers" :on-preview="handlePreview3"
                :on-remove="handleRemove3" :on-success="uploadSuccess3" :on-error="uploadError3"
                :before-remove="beforeRemove3" multiple :limit="5" :on-exceed="handleExceed3" :file-list="fileList">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm3">确 定</el-button>
        <el-button @click="cancel3">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSt,
  getUserList,
  getTerminalList,
  getSupplierList,
  addProject,
  projectInfo,
  platformList,
  addBusiness,
  editProject,
  getStInfo,
  editBusiness,
  updateBStatus,
  getActualControl
} from "@/api/project/st";
import { getToken } from "@/utils/auth";
export default {
  name: "St",
  data() {
    return {
      businessState: '',
      platformList: [],
      projectInfo: {},
      checkProject: false,
      operateBusiness: false,
      form1: {
        projectType: "一般立项",
        projectName: "",
        projectNo: "",
        serialNo: "",
        userId: "",
        userName: "",
        serviceManagerId: "",
        serviceManagerName: "",
        actualControlId: "",
        actualControlName: "",
        businessType: "",
        freightMode: "",
        supplierId: "",
        supplierName: "",
        terminalId: "",
        terminalName: "",
        chargemType: "1",
        chargemNx: "",
        chargemGd: "",
        node: "",
        filesList: null
      },
      form1back: {
        projectType: "一般立项",
        projectName: "",
        projectNo: "",
        serialNo: "",
        userId: "",
        userName: "",
        serviceManagerId: "",
        serviceManagerName: "",
        actualControlId: "",
        actualControlName: "",
        businessType: "",
        freightMode: "",
        supplierId: "",
        supplierName: "",
        terminalId: "",
        terminalName: "",
        chargemType: "1",
        chargemNx: "",
        chargemGd: "",
        node: "",
        filesList: null
      },
      form2: {
        projectId: '',
        serialNo: '',
        platformType: '2',
        ztList: [{
          ztId: '',
          ztFee: '',
          freight: ''
        }
        ],
        node: '',
        filesList: null,
        stName: '',
        stAmount: "",
        settlementP: '',
        settlementPA1: '',
        settlementPA2: '',
        settlementPA3: '',
        marginType: '2',
        margin: '',
        cycleStart: '',
        cycleEnd: '',
        expectPrice: '',
        expectWeight: '',
        rateYear: '',
        expectProfits: '',
        shType: '2',
        shName: '',
        shXz: '',
        shHztype: '',
        shChanneltype: '',
        shHzrate: '',
        shChannelyear: '',
        shSettlement: '',
        shSettlementA1: '',
        shSettlementA2: '',
        shSettlementA3: '',
        shMargintype: '',
        shMargin: '',
        shContracttype: ''
      },
      form2back: {
        projectId: '',
        serialNo: '',
        platformType: '2',
        ztList: [{
          ztId: '',
          ztFee: '',
          freight: ''
        }
        ],
        node: '',
        filesList: null,
        stName: '',
        stAmount: "",
        settlementP: '',
        settlementPA1: '',
        settlementPA2: '',
        settlementPA3: '',
        marginType: '2',
        margin: '',
        cycleStart: '',
        cycleEnd: '',
        expectPrice: '',
        expectWeight: '',
        rateYear: '',
        expectProfits: '',
        shType: '2',
        shName: '',
        shXz: '',
        shHztype: '',
        shChanneltype: '',
        shHzrate: '',
        shChannelyear: '',
        shSettlement: '',
        shSettlementA1: '',
        shSettlementA2: '',
        shSettlementA3: '',
        shMargintype: '',
        shMargin: '',
        shContracttype: ''
      },
      form3: {
        stId: '',
        businessState: '',
        node: '',
        filesList: null,
      },
      form3back: {
        stId: '',
        businessState: '',
        node: '',
        filesList: null,
      },
      //文件集合
      fileList: [],
      //合作方式
      shHztypeOptions: [
        { key: "固定差价买断", label: "固定差价买断" },
        {
          key: "固定差价买断+承兑贴息调整",
          label: "固定差价买断+承兑贴息调整",
        },
        { key: "年息收取", label: "年息收取" },
        { key: "其他", label: "其他" },
      ],
      //性质
      shXzOptions: [
        { key: "国有企业", label: "国有企业" },
        { key: "外资企业", label: "外资企业" },
        { key: "上市企业", label: "上市企业" },
        { key: "私营企业", label: "私营企业" },
      ],
      //结算比例
      shSettlementOptions: [
        { key: "70%-25%-5%", label: "70%-25%-5%" },
        { key: "95%-5%", label: "95%-5%" },
        { key: "其他", label: "其他" },
      ],
      //下游渠道年限
      shChannelyearOptions: [
        { key: "0年", label: "0年" },
        { key: "1年", label: "1年" },
        { key: "2年", label: "2年" },
        { key: "3年", label: "3年" },
        { key: "3年以上", label: "3年以上" },
        { key: "5年以上", label: "5年以上" },
      ],
      //合同签署
      shContracttypeOptions: [
        { key: "前置", label: "前置" },
        { key: "后置", label: "后置" },
      ],
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      showSearch: true,
      loading: false,
      openAddBusinessBox: false,
      stList: [],
      total: 0,
      actualControlOptions: [],
      transType: [
        {
          label: "汽运",
          value: "qy",
        },
        {
          label: "火运",
          value: "hy",
        },
        {
          label: "公铁联运",
          value: "ly",
        },
      ],
      //结算比例集合
      settlementPOptions: [
        { key: "70%-20%-10%", label: "70%-20%-10%" },
        { key: "70%-10%-20%", label: "70%-10%-20%" },
        { key: "70%-15%-15%", label: "70%-15%-15%" },
        { key: "80%-10%-10%", label: "80%-10%-10%" },
        { key: "其他", label: "其他" },
      ],
      //业务类型集合
      businessTypeList: [
        {
          label: "储备业务垫付运费",
          value: "cud",
        },
        {
          label: "储备业务不垫付运费",
          value: "cu",
        },
        {
          label: "到厂业务垫付运费",
          value: "dcd",
        },
        {
          label: "到厂业务不垫付运费",
          value: "dc",
        },
        {
          label: "车板业务垫付运费",
          value: "cbd",
        },
        {
          label: "车板业务不垫付运费",
          value: "cb",
        },
      ],
      // 供应商集合
      supplierOptions: [],
      // 代办人集合
      userOptions: [],
      // 终端客户集合
      terminalOptions: [],
      openAddBox: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        number: "",
        productNo: "",
        userId: "",
      },
      // 表单校验
      rules1: {
        projectType: [
          { required: true, message: "立项类型不能为空", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "代办人不能为空", trigger: "blur" },
        ],
        serviceManagerId: [
          { required: true, message: "业务经理不能为空", trigger: "blur" },
        ],
        actualControlId: [
          { required: true, message: "业务实控人不能为空", trigger: "blur" },
        ],
        businessType: [
          { required: true, message: "业务类型不能为空", trigger: "blur" },
        ],
        freightMode: [
          { required: true, message: "货运方式不能为空", trigger: "blur" },
        ],
        supplierId: [
          { required: true, message: "供应商不能为空", trigger: "blur" },
        ],
        terminalId: [
          { required: true, message: "终端客户名称不能为空", trigger: "blur" },
        ],
        chargemType: [
          { required: true, message: "收费模式不能为空", trigger: "blur" },
        ],
        chargemNx: [
          {
            required: true,
            message: "年息服务费费率不能为空",
            trigger: "blur",
          },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        chargemGd: [
          { required: true, message: "固定差价不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
      },
      rules2: {
        stName: [
          { required: true, message: "业务名称不能为空", trigger: "blur" },
        ],
        stAmount: [
          { required: true, message: "业务金额不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        settlementP: [
          { required: true, message: "结算比例为必选", trigger: "blur" },
        ],
        settlementPA1: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        settlementPA2: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        settlementPA3: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        marginType: [
          { required: true, message: "履约保证金为必选", trigger: "blur" },
        ],
        margin: [
          { required: true, message: "履约保证金不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        cycleStart: [
          { required: true, message: "服务周期开始时间不能为空", trigger: "blur" },
        ],
        cycleEnd: [
          { required: true, message: "服务周期结束时间不能为空", trigger: "blur" },
        ],
        expectPrice: [
          { required: true, message: "预计单价不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        expectWeight: [
          { required: true, message: "预计重量不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        rateYear: [
          { required: true, message: "成本年服务费费率不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        expectProfits: [
          { required: true, message: "预计利润不能为空", trigger: "blur" },
        ],
        shType: [
          { required: true, message: "自融资金方为必选", trigger: "blur" },
        ],
        shName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
        ],
        shXz: [
          { required: true, message: "性质不能为空", trigger: "blur" },
        ],
        shHztype: [
          { required: true, message: "合作方式不能为空", trigger: "blur" },
        ],
        shChanneltype: [
          { required: true, message: "下游渠道为必选", trigger: "blur" },
        ],
        shHzrate: [
          { required: true, message: "资金费率不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        shChannelyear: [
          { required: true, message: "下游渠道年限不能为空", trigger: "blur" },
        ],
        shSettlement: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        shSettlementA1: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        shSettlementA2: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        shSettlementA3: [
          { required: true, message: "结算比例不能为空", trigger: "blur" },
        ],
        shMargintype: [
          { required: true, message: "履约保证金为必选", trigger: "blur" },
        ],
        shMargin: [
          { required: true, message: "履约保证金金额不能为空", trigger: "blur" },
          {
            pattern: /^\d+(.\d{1,2})?$/,
            message: '只能输入数字且只能保留两位小数',
            trigger: 'change'
          }
        ],
        shContracttype: [
          { required: true, message: "合同签署不能为空", trigger: "blur" },
        ],
        platformType: [
          { required: true, message: "有无站台为必选", trigger: "blur" },
        ]
      },
      rules3: {

      }
    };
  },
  watch: {
    "form2.settlementP": {
      handler() {
        if (this.form2.settlementP != '其他') {
          let arr = this.form2.settlementP.split("-")
          this.form2.settlementPA1 = arr[0].replace(new RegExp("%"), "")
          this.form2.settlementPA2 = arr[1].replace(new RegExp("%"), "")
          this.form2.settlementPA3 = arr[2].replace(new RegExp("%"), "")
        }
      },
    },

    "form2.shSettlement": {
      handler() {
        if (this.form2.shSettlement != '其他') {
          let arr = this.form2.shSettlement.split("-")
          this.form2.shSettlementA1 = arr[0].replace(new RegExp("%"), "")
          this.form2.shSettlementA2 = arr[1].replace(new RegExp("%"), "")
          this.form2.shSettlementA3 = arr[2].replace(new RegExp("%"), "")
        }
      },
    },
  },
  mounted() {
    this.getList();
    getUserList().then((response) => {
      this.userOptions = response.rows;
    });
    getTerminalList().then((response) => {
      this.terminalOptions = response.rows;
    });
    getSupplierList().then((response) => {
      this.supplierOptions = response.rows;
    });
    platformList().then((response) => {
      this.platformList = response.rows;
    })
    getActualControl().then(res => {
      this.actualControlOptions = res.data
    })

  },
  methods: {
    stateChange(e) {
      if (e.state == 1) {
        return '未审批'
      } else if (e.state == 2) {
        e.scolor = '#09CC9D'
        return '审批中'
      } else if (e.state == 3) {
        e.scolor = '#007AFF'
        return '已通过'
      } else if (e.state == 4) {
        e.scolor = '#F12801'
        return '已打回'
      }
    },
    businessStateChange(e) {
      if (e.businessState == 0) {
        return '提交中'
      } else if (e.businessState == 1) {
        e.bcolor = '#09CC9D'
        return '进行中'
      } else if (e.businessState == 2) {
        e.bcolor = '#FFAC00'
        return '异常'
      } else if (e.businessState == 3) {
        e.bcolor = '#F12801'
        return '结束'
      } else if (e.businessState == 4) {
        e.bcolor = '#007AFF'
        return '完成'
      }
    },
    changeBusinessType(e) {
      if (e == 'cud') {
        return '储备业务垫付运费'
      } else if (e = 'cu') {
        return '储备业务不垫付运费'
      } else if (e = 'dcd') {
        return '到厂业务垫付运费'
      } else if (e = 'dc') {
        return '到厂业务不垫付运费'
      } else if (e = 'cbd') {
        return '车板业务垫付运费'
      } else if (e = 'cb') {
        return '车板业务不垫付运费'
      }
    },
    changeTransType(e) {
      if (e == 'qy') {
        return '汽运'
      } else if (e = 'hy') {
        return '火运'
      } else if (e = 'dcd') {
        return '公铁联运'
      }
    },
    addZt(index) {
      this.form2.ztList.splice(index + 1, 0, {
        ztId: '',
        ztFee: '',
        freight: ''
      });
    },
    deleteZt(index) {
      if (this.form2.ztList.length == 1) {
      } else {
        this.form2.ztList.splice(index, 1)
      }
    },
    jsprice() {
      let arr = ['cycleStart', 'cycleEnd', 'expectPrice', 'rateYear', 'chargemGd', 'expectWeight']
      let valida_all = true
      this.$refs["form2"].validateField(arr, valid => {
        if (valid) {
          valida_all = valida_all && false;
        } else {
          valida_all = valida_all && true;
        }
      })
      if (valida_all) {
        let dateSpan, iDays;
        let sDate1 = Date.parse(this.form2.cycleStart);
        let sDate2 = Date.parse(this.form2.cycleEnd);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        //周期天数
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        //预计单价
        let a1 = this.form2.expectPrice
        //年服务费率
        let a2 = 0.00
        if (this.form2.chargemType == '1' || this.form2.chargemType == '3') {
          a2 = parseFloat(this.form.chargemNx) * 100
        }
        //固定差价
        let a3 = 0.00
        if (this.form2.chargemType == '2' || this.form2.chargemType == '3') {
          a3 = parseFloat(this.form2.chargemGd)
        }
        //预计吨数
        let a4 = this.form2.expectWeight
        //单吨收益
        let jx1 = a1 * 0.09 * a2 / 360 * iDays + a3;
        //资金成本
        let jx2 = a1 * 0.9 * 0.08 / 360 * iDays;
        // 增值税
        let jx3 = jx1 * 0.13 / 1.13;
        //
        let jx4 = jx3 * 0.12
        //印花税
        let jx5 = ((2 * a1 - a1 * 0.9 * 0.08 / 360 * iDays) * 0.0003)
        console.log("jx1:" + jx1 + "-jx2:" + jx2 + "-jx3:" + jx3 + "-jx4:" + jx4 + "-jx5:" + jx5)
        console.log((jx1 - jx2 - jx3 - jx4 - jx5))
        let zzjx = (jx1 - jx2 - jx3 - jx4 - jx5) * a4
        this.form2.expectProfits = zzjx.toFixed(2)
      }
    },
    openOperateBusiness(row) {
      this.businessState = row.businessState
      this.form3.stId = row.stId
      this.operateBusiness = true
    },
    changetName(e) {
      this.terminalOptions.forEach((options) => {
        if (e == options.terminalId) {
          this.form1.terminalName = options.name;
        }
      });
    },
    changeSupplierName(e) {
      this.supplierOptions.forEach((options) => {
        if (e == options.supplierId) {
          this.form1.supplierName = options.name;
        }
      });
    },
    changeUser(e) {
      this.userOptions.forEach((options) => {
        if (e == options.userId) {
          this.form1.userName = options.nickName;
        }
      });
    },
    changeServiceManagerName(e) {
      this.userOptions.forEach((options) => {
        if (e == options.userId) {
          this.form1.serviceManagerName = options.nickName;
        }
      });
    },
    changeActualControlName(e) {
      this.actualControlOptions.forEach((options) => {
        if (e == options.id) {
          this.form1.actualControlName = options.actualControlPerson;
        }
      });
    },
    toggleRowExpansion1(row) {
      this.$refs.topicTable.toggleRowExpansion(row, true)
    },
    toggleRowExpansion2(row) {
      this.$refs.topicTable.toggleRowExpansion(row, false)
    },
    jumpBusiness(row) {
      this.$router.push('/st/lookAdd/' + row.stId)
    },
    openBusinessBox(row) {
      projectInfo(row.projectId).then(res => {
        this.projectInfo = res.data
      })
      this.form2.projectId = row.projectId
      this.form2.serialNo = row.serialNo
      this.openAddBusinessBox = true;
    },
    openChangeBusiness(row) {
      projectInfo(row.projectId).then(res => {
        this.projectInfo = res.data
      })
      getStInfo(row.stId).then(res => {
        this.form2 = res.data
        this.form2.settlementP = res.data.settlementPA1 + '%-' + res.data.settlementPA2 + '%-' + res.data.settlementPA3 + '%'
        if (this.form2.settlementP != "70%-20%-10%" && this.form2.settlementP != "70%-10%-20%" && this.form2.settlementP != "70%-15%-15%" && this.form2.settlementP != "80%-10%-10%") {
          this.form2.settlementP = '其他'
        }
        this.form2.shSettlement = res.data.shSettlementA1 + '%-' + res.data.shSettlementA2 + '%-' + res.data.shSettlementA3 + '%'
        if (this.form2.shSettlement != "70%-25%-5%" && this.form2.shSettlement != "95%-5%") {
          this.form2.settlementP = '其他'
        }
      })
      this.openAddBusinessBox = true;
    },
    openCheckProject(row) {
      projectInfo(row.projectId).then(res => {
        this.projectInfo = res.data
      })
      this.checkProject = true;
    },
    openChangeProject(row) {
      projectInfo(row.projectId).then(res => {
        this.form1 = res.data
        this.form1.userId = parseInt(res.data.userId)
        this.form1.supplierId = parseInt(res.data.supplierId)
        this.form1.terminalId = parseInt(res.data.terminalId)
        this.form1.serviceManagerId = parseInt(res.data.serviceManagerId)
        this.form1.actualControlId = parseInt(res.data.actualControlId)
      })
      this.openAddBox = true;
    },
    submitForm() {
      this.$refs["form1"].validate((valid) => {
        if (valid) {
          if (this.form1.projectId) {
            editProject(this.form1).then(() => {
              this.$message({
                message: "修改成功！",
                type: "success",
              });
              this.openAddBox = false;
              this.form1 = this.form1back
              this.getList();
            });
          } else {
            addProject(this.form1).then(() => {
              this.$message({
                message: "新增成功！",
                type: "success",
              });
              this.openAddBox = false;
              this.form1 = this.form1back
              this.getList();
            });
          }
        }
      });
    },
    submitForm2() {
      this.$refs["form2"].validate((valid) => {
        if (valid) {
          if (this.form2.stId) {
            editBusiness(this.form2).then(() => {
              this.$message({
                message: "修改成功！",
                type: "success",
              });
              this.openAddBusinessBox = false;
              this.form2 = this.form2back
              this.getList();
            });
          } else {
            addBusiness(this.form2).then(() => {
              this.$message({
                message: "新增成功！",
                type: "success",
              });
              this.openAddBusinessBox = false;
              this.form2 = this.form2back
              this.getList();
            });
          }
        }
      });
    },
    submitForm3() {
      this.$refs["form3"].validate((valid) => {
        if (valid) {
          updateBStatus(this.form3).then(res => {
            this.$message({
              message: "新增成功！",
              type: "success",
            });
            this.operateBusiness = false;
            this.form3 = this.form3back
            this.getList();
          })
        }
      });
    },
    handleAdd() {
      this.openAddBox = true;
    },
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      listSt(this.queryParams).then((response) => {
        this.stList = response.rows;
        this.stList.forEach((e) => {
          e.hType = "项目"
          e.children = e.businessList;
          e.children.forEach(e2 => {
            e2.hType = "业务"
          })
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    cancel() {
      this.openAddBox = false;
    },
    cancel2() {
      this.openAddBusinessBox = false;
    },
    cancel3() {
      this.operateBusiness = false;
    },
    //文件上传
    handlePreview(file) {
      if (file.response == undefined) {
        window.open(file.url);
      } else {
        window.open(file.response.data.url);
      }
    },
    handleRemove(file, filelist) {
      this.form1.filesList = [];
      for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].response != undefined) {
          let art = {
            name: filelist[i].response.data.name,
            url: filelist[i].response.data.url,
          };
          this.form1.filesList.push(art);
        } else {
          let art = { name: filelist[i].name, url: filelist[i].url };
          this.form1.filesList.push(art);
        }
      }
    },
    uploadSuccess(res, file, filelist) {
      if (res.code == "200") {
        this.form1.filesList = [];
        for (var i = 0; i < filelist.length; i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = { name: name, url: url };
            this.form1.filesList.push(art);
          } else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = { name: name, url: url };
            this.form1.filesList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index, 1);
      }
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
    //文件上传2
    handlePreview2(file) {
      if (file.response == undefined) {
        window.open(file.url);
      } else {
        window.open(file.response.data.url);
      }
    },
    handleRemove2(file, filelist) {
      this.form2.filesList = [];
      for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].response != undefined) {
          let art = {
            name: filelist[i].response.data.name,
            url: filelist[i].response.data.url,
          };
          this.form2.filesList.push(art);
        } else {
          let art = { name: filelist[i].name, url: filelist[i].url };
          this.form2.filesList.push(art);
        }
      }
    },
    uploadSuccess2(res, file, filelist) {
      if (res.code == "200") {
        this.form2.filesList = [];
        for (var i = 0; i < filelist.length; i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = { name: name, url: url };
            this.form2.filesList.push(art);
          } else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = { name: name, url: url };
            this.form2.filesList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index, 1);
      }
    },
    uploadError2(err, file, filelist) {
      this.$message.error("上传失败");
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed2(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
    //文件上传3
    handlePreview3(file) {
      if (file.response == undefined) {
        window.open(file.url);
      } else {
        window.open(file.response.data.url);
      }
    },
    handleRemove3(file, filelist) {
      this.form3.filesList = [];
      for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].response != undefined) {
          let art = {
            name: filelist[i].response.data.name,
            url: filelist[i].response.data.url,
          };
          this.form3.filesList.push(art);
        } else {
          let art = { name: filelist[i].name, url: filelist[i].url };
          this.form3.filesList.push(art);
        }
      }
    },
    uploadSuccess3(res, file, filelist) {
      if (res.code == "200") {
        this.form3.filesList = [];
        for (var i = 0; i < filelist.length; i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = { name: name, url: url };
            this.form3.filesList.push(art);
          } else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = { name: name, url: url };
            this.form3.filesList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index, 1);
      }
    },
    uploadError3(err, file, filelist) {
      this.$message.error("上传失败");
    },
    beforeRemove3(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed3(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
  },
};
</script>
<style scoped>
 .projectlist >>> .el-icon-arrow-right{
    display:none
  }
</style>
