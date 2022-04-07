<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目" prop="stId">
        <el-select filterable v-model="queryParams.stId" placeholder="请选择项目" clearable size="small">
          <el-option
            v-for="dict in stOptions"
            :key="dict.stId"
            :label="dict.name"
            :value="dict.stId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目编号" prop="stNo">

        <el-input
          v-model="queryParams.stNo"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标准名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入标准名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['project:rewardsp:add']"
        >新增</el-button>
      </el-col>


      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rewardspList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="stNo" />
      <el-table-column label="标准名称" align="center" prop="name" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleLook(scope.row)"-->
<!--            v-hasPermi="['project:rewardsp:edit']"-->
<!--          >查看</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:rewardsp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:rewardsp:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改奖惩对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="stId">
              <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择项目" style="width: 100%;">
                <el-option
                  v-for="obj in stOptions"
                  :key="obj.stId"
                  :label="obj.name"
                  :value="obj"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号" prop="name">
              {{ form.number }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标准名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入标准名称" />
            </el-form-item>
          </el-col>
        </el-row>



<!--        热值MJ/Kg-->
        <el-row style="margin-top: 30px; ">
          <el-col :span="3" >
            <span style="font-size: 20px; color: black;">热值MJ/Kg</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(1)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData1"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                 <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.a1'" :rules='rules.a1'>
                <el-select v-model="scope.row.a1">
                  <el-option label="Qgr,ad" value="Qgr,ad" />
                  <el-option label="Qnt,ar" value="Qnt,ar" />
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.s1'" :rules='rules.s1'>
                <el-select v-model="scope.row.s1">
                  <el-option label=">" value=">" />
                  <el-option label="<" value="<" />
<!--                  <el-option label="=" value="=" />-->
<!--                  <el-option label=">=" value=">=" />-->
<!--                  <el-option label="<=" value="<=" />-->
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.a2'" :rules='rules.a2'>
                <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.s2'" :rules='rules.s2'>
                <el-select v-model="scope.row.s2">
                  <el-option label="上升" value="上升" />
                  <el-option label="下降" value="下降" />
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.b1'" :rules='rules.b1'>
                <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.s3'" :rules='rules.s3'>
                <el-select v-model="scope.row.s3">
                  <el-option label="上升" value="上升" />
                  <el-option label="下降" value="下降" />
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData1.' + scope.$index + '.c1'" :rules='rules.c1'>
                <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData1,1)"
                  type="text"
                  size="small">
                  移除
                </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        热值Kcal/Kg-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">热值Kcal/Kg</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(2)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData2"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="Kcal" value="Kcal" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData2.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData2,2)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        含硫量-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">含硫量</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(3)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData3"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="含硫量" value="含硫量" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData3.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData3,3)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        挥发分-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">挥发分</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(4)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData4"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="Vda" value="Vda" />
                    <el-option label="Vdaf" value="Vdae" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData4.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData4,4)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        灰分-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">灰分</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(5)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData5"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="Aad" value="Aad" />
                    <el-option label="ad" value="ad" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData5.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData5,5)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        水分-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">水分</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(6)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData6"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="水分" value="水分" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData6.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData6,6)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        内水-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">内水</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(7)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData7"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="内水" value="内水" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData7.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData7,7)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>


<!--        固定碳-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">固定碳</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(8)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData8"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="固定碳" value="固定碳" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData8.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData8,8)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

<!--        灰熔点-->
        <el-row>
          <el-col :span="3" >
            <span style="font-size: 20px; color: black; ">灰熔点</span>
          </el-col>
          <el-col :span="2" v-if="isLook!=3">
            <el-button type="primary" @click="addTableData(9)" style="margin-bottom: 30px;font-size: 30px;padding: 0 10px;">+</el-button>
          </el-col>
        </el-row>
        <!--奖惩计划-->
        <div  style="margin-bottom: 30px">
          <el-table
            :show-header="false"
            ref="singleTable"
            :data="form.tableData9"
            style="width: 100%">
            <el-table-column align="right">
              <template>
                <el-form-item label-width="0">
                  <span>当</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别">
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.a1'" :rules='rules.a1'>
                  <el-select v-model="scope.row.a1">
                    <el-option label="灰熔点" value="灰熔点" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="符号" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.s1'" :rules='rules.s1'>
                  <el-select v-model="scope.row.s1">
                    <el-option label=">" value=">" />
                    <el-option label="<" value="<" />
<!--                    <el-option label="=" value="=" />-->
<!--                    <el-option label=">=" value=">=" />-->
<!--                    <el-option label="<=" value="<=" />-->
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.a2'" :rules='rules.a2'>
                  <el-input v-model="scope.row.a2" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值"
              width="90">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>该值每：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.s2'" :rules='rules.s2'>
                  <el-select v-model="scope.row.s2">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="热值" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.b1'" :rules='rules.b1'>
                  <el-input v-model="scope.row.b1" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="70">
              <template slot-scope="scope">
                <el-form-item label-width="0" style="text-align: right;">
                  <span>价格：</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="上升/下降" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.s3'" :rules='rules.s3'>
                  <el-select v-model="scope.row.s3">
                    <el-option label="上升" value="上升" />
                    <el-option label="下降" value="下降" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="价格" >
              <template slot-scope="scope">
                <el-form-item label-width="0"  :prop="'tableData9.' + scope.$index + '.c1'" :rules='rules.c1'>
                  <el-input v-model="scope.row.c1" placeholder="价格" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLook!=3"
              label="操作">
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData9,9)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.once="submitForm" v-if="isLook!=3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRewardsp, getRewardsp, delRewardsp, addRewardsp, updateRewardsp,getStList } from "@/api/project/rewardsp";

export default {
  name: "Rewardsp",
  data() {
    return {
      isLook:1,
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
      // 奖惩表格数据
      rewardspList: [],
      //项目集合
      stOptions:[],
      //奖惩集合
      //热值MJ/kg
      tableData1: [],
      //热值Kcal/kg
      tableData2: [],
      //含硫量
      tableData3: [],
      //挥发分
      tableData4: [],
      //灰分
      tableData5: [],
      //水分
      tableData6: [],
      //内水
      tableData7: [],
      //固定碳
      tableData8: [],
      //灰熔点
      tableData9: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        s1: null,
        s2: null,
        s3: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [
          { required: true, message: "请选择项目", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入标准", trigger: "blur" }
        ],
        a1: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        s1: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        a2: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        s2: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        b1: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        s3: [
          { required: true, message: "请选择项目", trigger: "blur" }
        ],
        c1: [
          { required: true, message: "请输入", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    getStList().then(response => {
      this.stOptions = response.rows;
    });
  },
  methods: {
    /** 查询奖惩列表 */
    getList() {
      this.loading = true;
      listRewardsp(this.queryParams).then(response => {
        this.rewardspList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
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
        rewardspId: null,
        name: null,
        stId: null,
        stId2: null,
        stName: null,
        a1: null,
        s1: null,
        a2: null,
        s2: null,
        b1: null,
        s3: null,
        c1: null,
        tableData1:[],
        tableData2:[],
        tableData3:[],
        tableData4:[],
        tableData5:[],
        tableData6:[],
        tableData7:[],
        tableData8:[],
        tableData9:[],
        createBy: null,
        createTime: null
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
      this.ids = selection.map(item => item.rewardspId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.tableData1=[]
      this.form.tableData2=[]
      this.form.tableData3=[]
      this.form.tableData4=[]
      this.form.tableData5=[]
      this.form.tableData6=[]
      this.form.tableData7=[]
      this.form.tableData8=[]
      this.form.tableData9=[]
      this.addTableData(1);
      this.addTableData(2);
      this.addTableData(3);
      this.addTableData(4);
      this.addTableData(5);
      this.addTableData(6);
      this.addTableData(7);
      this.addTableData(8);
      this.addTableData(9);
      this.isLook=1
      this.open = true;
      this.title = "添加奖惩";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.tableData1=[]
      this.form.tableData2=[]
      this.form.tableData3=[]
      this.form.tableData4=[]
      this.form.tableData5=[]
      this.form.tableData6=[]
      this.form.tableData7=[]
      this.form.tableData8=[]
      this.form.tableData9=[]
      const rewardspId = row.rewardspId || this.ids
      getRewardsp(rewardspId).then(response => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.form.tableData1=response.data.tableData1
        this.form.tableData2=response.data.tableData2
        this.form.tableData3=response.data.tableData3
        this.form.tableData4=response.data.tableData4
        this.form.tableData5=response.data.tableData5
        this.form.tableData6=response.data.tableData6
        this.form.tableData7=response.data.tableData7
        this.form.tableData8=response.data.tableData8
        this.form.tableData9=response.data.tableData9
        this.isLook=2
        this.open = true;
        this.title = "修改奖惩";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.form.tableData1=[]
      this.form.tableData2=[]
      this.form.tableData3=[]
      this.form.tableData4=[]
      this.form.tableData5=[]
      this.form.tableData6=[]
      this.form.tableData7=[]
      this.form.tableData8=[]
      this.form.tableData9=[]
      const rewardspId = row.rewardspId || this.ids
      getRewardsp(rewardspId).then(response => {
        console.log(response)
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.form.tableData1=response.data.tableData1
        this.form.tableData2=response.data.tableData2
        this.form.tableData3=response.data.tableData3
        this.form.tableData4=response.data.tableData4
        this.form.tableData5=response.data.tableData5
        this.form.tableData6=response.data.tableData6
        this.form.tableData7=response.data.tableData7
        this.form.tableData8=response.data.tableData8
        this.form.tableData9=response.data.tableData9
        this.isLook=3
        this.open = true;
        this.title = "查看奖惩";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.stId=this.form.stId2
          if (this.form.rewardspId != null) {
            updateRewardsp(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRewardsp(this.form).then(response => {
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
      const rewardspIds = row.rewardspId || this.ids;
      this.$confirm('是否确认删除奖惩?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRewardsp(rewardspIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/rewardsp/export', {
        ...this.queryParams
      }, `project_rewardsp.xlsx`)
    },

    //业务开始
    //选择项目
    changeSt(obj){
      this.form.stId2 = obj.stId
      this.form.stName = obj.name
      this.$set(this.form,'number',obj.number)
    },
    //溢出选中数据
    deleteRow(index, rows,ts) {
      if(ts==1){
        this.form.tableData1.splice(index, 1);
      }else if(ts==2){
        this.form.tableData2.splice(index, 1);
      }else if(ts==3){
        this.form.tableData3.splice(index, 1);
      }else if(ts==4){
        this.form.tableData4.splice(index, 1);
      }else if(ts==5){
        this.form.tableData5.splice(index, 1);
      }else if(ts==6){
        this.form.tableData6.splice(index, 1);
      }else if(ts==7){
        this.form.tableData7.splice(index, 1);
      }else if(ts==8){
        this.form.tableData8.splice(index, 1);
      }else if(ts==9){
        this.form.tableData9.splice(index, 1);
      }
    },
    //添加计划
    addTableData(ts){
      if(ts==1){
        if (this.form.tableData1 == undefined) {
          this.form.tableData1 = new Array();
        }
        let obj = {};
        obj.a1='Qgr,ad'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData1.push(obj);
      }else if(ts==2){
        if (this.form.tableData2 == undefined) {
          this.form.tableData2 = new Array();
        }
        let obj = {};
        obj.a1='Kcal'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData2.push(obj);
      }else if(ts==3){
        if (this.form.tableData3 == undefined) {
          this.form.tableData3 = new Array();
        }
        let obj = {};
        obj.a1='含硫量'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData3.push(obj);
      }else if(ts==4){
        if (this.form.tableData4 == undefined) {
          this.form.tableData4 = new Array();
        }
        let obj = {};
        obj.a1='Vda'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData4.push(obj);
      }else if(ts==5){
        if (this.form.tableData5 == undefined) {
          this.form.tableData5 = new Array();
        }
        let obj = {};
        obj.a1='Aad'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData5.push(obj);
      }else if(ts==6){
        if (this.form.tableData6 == undefined) {
          this.form.tableData6 = new Array();
        }
        let obj = {};
        obj.a1='水分'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData6.push(obj);
      }else if(ts==7){
        if (this.form.tableData7 == undefined) {
          this.form.tableData7 = new Array();
        }
        let obj = {};
        obj.a1='内水'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData7.push(obj);
      }else if(ts==8){
        if (this.form.tableData8 == undefined) {
          this.form.tableData8 = new Array();
        }
        let obj = {};
        obj.a1='固定碳'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData8.push(obj);
      }else if(ts==9){
        if (this.form.tableData9 == undefined) {
          this.form.tableData9 = new Array();
        }
        let obj = {};
        obj.a1='灰熔点'
        obj.s1='>'
        obj.s2="上升"
        obj.s3='上升'
        this.form.tableData9.push(obj);
      }


    },
  }
};
</script>
