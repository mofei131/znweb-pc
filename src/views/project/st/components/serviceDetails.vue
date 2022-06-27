<template>
    <div class="app-container">
        <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="项目" prop="stId">
                <el-select filterable v-model="queryParams.stId" placeholder="请选择项目" clearable size="small">
                    <el-option v-for="dict in stOptions" :key="dict.stId" :label="dict.name" :value="dict.stId" />
                </el-select>
            </el-form-item> -->
        <!--      <el-form-item label="费用类型" prop="type">-->
        <!--        <el-select v-model="queryParams.type" placeholder="请选择费用类型" clearable size="small">-->
        <!--          <el-option label="请选择字典生成" value="" />-->
        <!--        </el-select>-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="付款日期" prop="putTime">-->
        <!--        <el-date-picker clearable size="small"-->
        <!--          v-model="queryParams.putTime"-->
        <!--          type="date"-->
        <!--          value-format="yyyy-MM-dd"-->
        <!--          placeholder="选择付款日期">-->
        <!--        </el-date-picker>-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="状态" prop="state">-->
        <!--        <el-input-->
        <!--          v-model="queryParams.state"-->
        <!--          placeholder="请输入状态"-->
        <!--          clearable-->
        <!--          size="small"-->
        <!--          @keyup.enter.native="handleQuery"-->
        <!--        />-->
        <!--      </el-form-item>-->
        <!-- <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form> -->

        <!-- <el-row :gutter="10" class="mb8"> -->
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          plain-->
        <!--          icon="el-icon-plus"-->
        <!--          size="mini"-->
        <!--          @click="handleAdd"-->
        <!--          v-hasPermi="['project:sp:add']"-->
        <!--        >新增</el-button>-->
        <!--      </el-col>-->
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--          type="success"-->
        <!--          plain-->
        <!--          icon="el-icon-edit"-->
        <!--          size="mini"-->
        <!--          :disabled="single"-->
        <!--          @click="handleUpdate"-->
        <!--          v-hasPermi="['project:sp:edit']"-->
        <!--        >修改</el-button>-->
        <!--      </el-col>-->
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--          type="danger"-->
        <!--          plain-->
        <!--          icon="el-icon-delete"-->
        <!--          size="mini"-->
        <!--          :disabled="multiple"-->
        <!--          @click="handleDelete"-->
        <!--          v-hasPermi="['project:sp:remove']"-->
        <!--        >删除</el-button>-->
        <!--      </el-col>-->
        <!-- <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['project:sp:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        <!-- </el-row> -->

        <el-table v-loading="loading" :data="spList" @selection-change="handleSelectionChange">
            <!-- <el-table-column label="项目名称" align="center" prop="stName" /> -->
            <el-table-column label="费用类型" align="center" prop="type" />
            <el-table-column label="付款日期" align="center" prop="putTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.putTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="付款金额(元)" align="center" prop="putPrice">
                <template slot-scope="scope">
                    {{
                            Number(scope.row.putPrice)
                                .toFixed(2)
                                .toString()
                                .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                    }}
                </template>
            </el-table-column>
            <el-table-column label="回收抵扣金额(元)" align="center" prop="outPrice">
                <template slot-scope="scope">
                    {{
                            Number(scope.row.outPrice)
                                .toFixed(2)
                                .toString()
                                .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                    }}
                </template>
            </el-table-column>
            <el-table-column label="回款日期" align="center" prop="outTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.outTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="资金占用时间(天)" align="center" prop="spTime" />
            <el-table-column label="服务费(元)" align="center" prop="spPrice">
                <template slot-scope="scope">
                    {{
                            Number(scope.row.spPrice)
                                .toFixed(2)
                                .toString()
                                .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                    }}
                </template>
            </el-table-column>
            <el-table-column label="资金成本占用时间(天)" align="center" prop="sjTime" />
            <el-table-column label="成本费用(元)" align="center" prop="sjPrice">
                <template slot-scope="scope">
                    {{
                            Number(scope.row.sjPrice)
                                .toFixed(2)
                                .toString()
                                .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                    }}
                </template>
            </el-table-column>
            <el-table-column label="资金占用利润(元)" align="center" prop="lrPrice">
                <template slot-scope="scope">
                    {{
                            Number(scope.row.lrPrice)
                                .toFixed(2)
                                .toString()
                                .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                    }}
                </template>
            </el-table-column>
            <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
            <!--        <template slot-scope="scope">-->
            <!--          <el-button-->
            <!--            size="mini"-->
            <!--            type="text"-->
            <!--            icon="el-icon-edit"-->
            <!--            @click="handleUpdate(scope.row)"-->
            <!--            v-hasPermi="['project:sp:edit']"-->
            <!--          >修改</el-button>-->
            <!--          <el-button-->
            <!--            size="mini"-->
            <!--            type="text"-->
            <!--            icon="el-icon-delete"-->
            <!--            @click="handleDelete(scope.row)"-->
            <!--            v-hasPermi="['project:sp:remove']"-->
            <!--          >删除</el-button>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改服务费明细对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="项目id" prop="stId">
                    <el-input v-model="form.stId" placeholder="请输入项目id" />
                </el-form-item>
                <el-form-item label="项目名称" prop="stName">
                    <el-input v-model="form.stName" placeholder="请输入项目名称" />
                </el-form-item>
                <el-form-item label="费用类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择费用类型">
                        <el-option label="请选择字典生成" value="" />
                    </el-select>
                </el-form-item>
                <el-form-item label="付款日期" prop="putTime">
                    <el-date-picker clearable size="small" v-model="form.putTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="选择付款日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="付款金额(元)" prop="putPrice">
                    <el-input v-model="form.putPrice" placeholder="请输入付款金额(元)" />
                </el-form-item>
                <el-form-item label="回收抵扣金额" prop="outPrice">
                    <el-input v-model="form.outPrice" placeholder="请输入回收抵扣金额" />
                </el-form-item>
                <el-form-item label="回款金额" prop="outTime">
                    <el-date-picker clearable size="small" v-model="form.outTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="选择回款金额">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="资金占用时间" prop="spTime">
                    <el-date-picker clearable size="small" v-model="form.spTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="选择资金占用时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="费率" prop="spRata">
                    <el-input v-model="form.spRata" placeholder="请输入费率" />
                </el-form-item>
                <el-form-item label="服务费" prop="spPrice">
                    <el-input v-model="form.spPrice" placeholder="请输入服务费" />
                </el-form-item>
                <el-form-item label="资金成本占用时间(天)" prop="sjTime">
                    <el-date-picker clearable size="small" v-model="form.sjTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="选择资金成本占用时间(天)">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="成本费用" prop="sjPrice">
                    <el-input v-model="form.sjPrice" placeholder="请输入成本费用" />
                </el-form-item>
                <el-form-item label="资金占用利润" prop="lrPrice">
                    <el-input v-model="form.lrPrice" placeholder="请输入资金占用利润" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-input v-model="form.state" placeholder="请输入状态" />
                </el-form-item>
                <el-form-item label="创建时间" prop="craeteTime">
                    <el-date-picker clearable size="small" v-model="form.craeteTime" type="date"
                        value-format="yyyy-MM-dd" placeholder="选择创建时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listSp, getSp, delSp, addSp, updateSp } from "@/api/project/sp";
import { getStList } from "@/api/project/grn";

export default {
    name: "Sp",
    data() {
        return {
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
            // 服务费明细表格数据
            spList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 项目集合
            stOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                stId: null,
                type: null,
                putTime: null,
                state: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
            }
        };
    },
    created() {
        this.queryParams.stId = this.stIdd
        this.form.stId = this.projectIdd
        this.getList();
        getStList().then(response => {
            this.stOptions = response.rows;
            if(response.total!=0){
            this.stOptions.forEach(e=>{
                    if(e.stId==this.projectIdd){
                        this.changeSt(e)
                    }
                })
            }
        });
    },
    props: ['stIdd', 'projectIdd'],
    methods: {
        /** 查询服务费明细列表 */
        getList() {
            this.loading = true;
            listSp(this.queryParams).then(response => {
                this.spList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
            getStList().then(response => {
                this.stOptions = response.rows;
                if(response.total!=0){
                this.stOptions.forEach(e=>{
                    if(e.stId==this.projectIdd){
                        this.changeSt(e)
                    }
                })
                }
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
                spId: null,
                stId: null,
                stName: null,
                type: null,
                putTime: null,
                putPrice: null,
                outPrice: null,
                outTime: null,
                spTime: null,
                spRata: null,
                spPrice: null,
                sjTime: null,
                sjPrice: null,
                lrPrice: null,
                state: null,
                createBy: null,
                craeteTime: null
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
            this.ids = selection.map(item => item.spId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加服务费明细";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const spId = row.spId || this.ids
            getSp(spId).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改服务费明细";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.spId != null) {
                        updateSp(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addSp(this.form).then(response => {
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
            const spIds = row.spId || this.ids;
            this.$confirm('是否确认删除服务费明细?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delSp(spIds);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('project/sp/export', {
                ...this.queryParams
            }, `project_sp.xlsx`)
        }
    }
};
</script>
