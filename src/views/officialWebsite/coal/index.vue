<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="您的称呼" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入您的称呼"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:coal:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:coal:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:coal:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="coalList">
      <el-table-column
        label="类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
      />
      <el-table-column label="您的称呼" align="center" prop="userName" />
      <el-table-column label="联系方式" align="center" prop="phone" />
      <el-table-column label="货品名称" align="center" prop="coalName" />
      <el-table-column label="分类" align="center" prop="coalType" />
      <!-- <el-table-column label="煤种" align="center" prop="coalMz" /> -->
      <el-table-column label="数量（吨）" align="center" prop="number" >
        <template slot-scope="scope">
                    {{
                      Number(scope.row.number)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column label="交割地-省" align="center" prop="province" />
      <el-table-column label="交割地-市" align="center" prop="city" />
      <el-table-column label="交割地-区" align="center" prop="area" />
      <el-table-column label="意向价格" align="center" prop="price">
        <template slot-scope="scope">
          {{
            Number(scope.row.price)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="产地" align="center" prop="adress" /> -->
      <!-- <el-table-column label="结算方式" align="center" prop="payMethod" /> -->
      <!-- <el-table-column label="有效期" align="center" prop="yxTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.yxTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交付期" align="center" prop="jfTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.jfTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="热值" align="center" prop="rz" />
      <el-table-column label="硫份" align="center" prop="lf" />
      <el-table-column label="全水分" align="center" prop="qsf" />
      <el-table-column label="水分" align="center" prop="sf" />
      <el-table-column label="灰分" align="center" prop="hf" />
      <el-table-column label="挥发分" align="center" prop="hff" />
      <el-table-column label="灰熔点" align="center" prop="hrd" />
      <el-table-column label="固定碳" align="center" prop="gdt" />
      <el-table-column label="氢" align="center" prop="qing" />
      <el-table-column label="焦渣特性" align="center" prop="jztx" />
      <el-table-column label="备注" align="center" prop="note" /> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改供需对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="您的称呼" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入您的称呼" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品名称" prop="coalName">
              <el-input v-model="form.coalName" placeholder="请输入货品名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="coalType">
              <el-select v-model="form.coalType" placeholder="请选择分类">
                <el-option
                  v-for="dict in coalTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="煤种" prop="coalMz">
              <el-input v-model="form.coalMz" placeholder="请输入煤种" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="数量" prop="number">
              <el-input v-model="form.number" placeholder="请输入数量" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="交割地-省" prop="province">-->
<!--              <el-input v-model="form.province" placeholder="请输入交割地-省" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="交割地-市" prop="city">-->
<!--              <el-input v-model="form.city" placeholder="请输入交割地-市" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="交割地-区" prop="area">-->
<!--              <el-input v-model="form.area" placeholder="请输入交割地-区" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="交割地-省市区" prop="area">
              <el-cascader
                placeholder="请点击选择地址"
                :options="options"
                v-model="selectedOptions"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="意向价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入意向价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产地" prop="adress">
              <el-input v-model="form.adress" placeholder="请输入产地" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结算方式" prop="payMethod">
              <el-input v-model="form.payMethod" placeholder="请输入结算方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="yxTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.yxTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择有效期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交付期" prop="jfTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.jfTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择交付期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="热值" prop="rz">
              <el-input v-model="form.rz" placeholder="请输入热值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="硫份" prop="lf">
              <el-input v-model="form.lf" placeholder="请输入硫份" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全水分" prop="qsf">
              <el-input v-model="form.qsf" placeholder="请输入全水分" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="水分" prop="sf">
              <el-input v-model="form.sf" placeholder="请输入水分" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灰分" prop="hf">
              <el-input v-model="form.hf" placeholder="请输入灰分" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="挥发分" prop="hff">
              <el-input v-model="form.hff" placeholder="请输入挥发分" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灰熔点" prop="hrd">
              <el-input v-model="form.hrd" placeholder="请输入灰熔点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="固定碳" prop="gdt">
              <el-input v-model="form.gdt" placeholder="请输入固定碳" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="氢" prop="qing">
              <el-input v-model="form.qing" placeholder="请输入氢" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="焦渣特性" prop="jztx">
              <el-input v-model="form.jztx" placeholder="请输入焦渣特性" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="note">
              <el-input v-model="form.note" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.once="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCoal,
  getCoal,
  delCoal,
  addCoal,
  updateCoal,
} from "@/api/home/coal";
import axios from "axios";
import Vue from "vue";
Vue.prototype.$http=axios;
export default {
  name: "Coal",
  data() {
    return {
      selectedOptions: [],
      distData:'',
      options:'',
      cityArr: [], //城市列表
      areaArr: [], //区县列表
      province: "", //省
      city: "", //市
      area: "", // 区县,
      provinceCityArea: "", //选择器选择的省市区
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 供需表格数据
      coalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      typeOptions: [],
      coalTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        userName: null,
        phone: null,
        coalName: null,
        coalType: null,
        coalMz: null,
        number: null,
        province: null,
        city: null,
        area: null,
        price: null,
        adress: null,
        payMethod: null,
        yxTime: null,
        jfTime: null,
        rz: null,
        lf: null,
        qsf: null,
        sf: null,
        hf: null,
        hff: null,
        hrd: null,
        gdt: null,
        qing: null,
        jztx: null,
        note: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },

  created() {
    this.getList();
    this.getDicts("supply_and_demand").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("coal_classification").then((response) => {
      this.coalTypeOptions = response.data;
    });
    this.initDistPicker();
  },
  methods: {
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    /** 查询供需列表 */
    getList() {
      this.loading = true;
      listCoal(this.queryParams).then((response) => {
        this.coalList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        type: null,
        userName: null,
        phone: null,
        coalName: null,
        coalType: null,
        coalMz: null,
        number: null,
        province: null,
        city: null,
        area: null,
        price: null,
        adress: null,
        payMethod: null,
        yxTime: null,
        jfTime: null,
        rz: null,
        lf: null,
        qsf: null,
        sf: null,
        hf: null,
        hff: null,
        hrd: null,
        gdt: null,
        qing: null,
        jztx: null,
        note: null,
        createBy: null,
        createTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.supplydId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加供需";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改供需";
      // const supplydId = row.supplydId || this.ids;
      // getCoal(supplydId).then((response) => {

      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCoal(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCoal(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const supplydIds = row.id || this.ids;
      this.$confirm('是否确认删除供需?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delCoal(supplydIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/coal/export",
        {
          ...this.queryParams,
        },
        `system_coal.xlsx`
      );
    },
    initDistPicker() {
      console.log("initDistrictsPicker");
      let self = this;
      this.$http.get("/js/districts.json").then(function(respones) {
        console.log("respones==>", respones);
        let distData = respones.data;
        let options = [];
        // 省
        for (var provinceKy in distData["100000"]) {
          let optProvinceItem = {
            value: provinceKy,
            label: distData["100000"][provinceKy]
          };
          if (distData[provinceKy]) {
            // 市
            for (var cityKy in distData[provinceKy]) {
              optProvinceItem.children = optProvinceItem.children
                ? optProvinceItem.children
                : [];
              let optCityItem = {
                value: cityKy,
                label: distData[provinceKy][cityKy]
              };
              if (distData[cityKy]) {
                // 区
                for (var areaKy in distData[cityKy]) {
                  optCityItem.children = optCityItem.children
                    ? optCityItem.children
                    : [];
                  let optAreaItem = {
                    value: areaKy,
                    label: distData[cityKy][areaKy]
                  };
                  optCityItem.children.push(optAreaItem);
                }
              }
              optProvinceItem.children.push(optCityItem);
            }
          }
          options.push(optProvinceItem);
        }
        self.distData = distData;
        self.options = options;
      });
    },
    //选择地区
    handleChange(value) {
      let self = this;
      console.log("value=>", value);
      //获取省名
      self.options.map((item, index) => {
        if (item.value == value[0]) {
          self.cityArr = item.children; //存储城市列表
          self.province = item.label;
          this.form.province=item.label;
        }
      });
      //获取市名
      self.cityArr.map((item, index) => {
        if (item.value == value[1]) {
          self.areaArr = item.children; //存储区县列表
          self.city = item.label;
          this.form.city=item.label;
        }
      });
      //获取区县名
      self.areaArr.map((item, index) => {
        if (item.value == value[2]) {
          self.area = item.label;
          this.form.area=item.label;
        }
      });
      self.provinceCityArea = self.province + self.city + self.area;
      console.log("self.provinceCityArea", self.provinceCityArea);
    },
  },
};
</script>
