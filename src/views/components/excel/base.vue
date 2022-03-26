<template>
  <div>
    <el-tabs v-model="activeSheet" @tab-click="handleClick">
      <el-tab-pane v-for="(item, idx) in sheetNames" :key="idx" :label="item" :name="idx+''"></el-tab-pane>
    </el-tabs>
    <div id="result" class="xls-view"></div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx/xlsx.mjs';
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeSheet: '',
      sheetNames: [],
      workbook:null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadRemoteFile(this.url)
    })
  },
  methods: {
    // 请求网络接口
    loadRemoteFile(url) {
      this.sheetNames = []
      this.activeSheet = '0'
      let _this = this
      let loadingInstance = this.$loading({
          lock: true,
          text: '加载中'
        });
      this.readWorkbookFromRemoteFile(url, function(sheetIndex) {
        _this.readWorkbook(sheetIndex)
        loadingInstance.close()
      })
    },
    // 从网络上读取某个excel文件，url必须同域，否则报错
    readWorkbookFromRemoteFile(url, callback) {
      let _this = this
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function(e) {
        if (xhr.status == 200) {
          var data = new Uint8Array(xhr.response)
          _this.workbook = XLSX.read(data, { type: 'array' })
          _this.sheetNames = _this.workbook.SheetNames
          if (callback) callback(0)
        }
      }
      xhr.send()
    },
    // 读取 excel文件
    readWorkbook(sheetIndex) {
      var worksheet = this.workbook.Sheets[this.sheetNames[sheetIndex]] // 这里我们只读取第一张sheet
      var csv = XLSX.utils.sheet_to_csv(worksheet,{RS:'@N@',FS:'@C@'})
      document.getElementById('result').innerHTML = this.csv2table(csv)
    },
    // 将csv转换成表格
    csv2table(csv) {
      var html = '<table>'
      var rows = csv.split('@N@')
      //rows.pop() // 最后一行没用的
      rows.forEach(function(row, idx) {
        var columns = row.split('@C@')
        columns.unshift(idx + 1) // 添加行索引
        if (idx == 0) {
          // 添加列索引
          html += '<tr>'
          for (var i = 0; i < columns.length; i++) {
            html +=
              '<th>' + (i == 0 ? '' : String.fromCharCode(65 + i - 1)) + '</th>'
          }
          html += '</tr>'
        }
        html += '<tr>'
        // 如果只有第一列有值，就认为当前整行是合并单元格了
        if(columns[1] && columns[1] == columns.slice(1).join('') && isNaN(columns[1])){
          html += `<td>` + columns[0] + '</td>'
          html += `<td colspan="${columns.length-1}" align="center">` + columns[1] + '</td>'
        }else{
          columns.forEach(function(column) {
          html += '<td>' + column + '</td>'
          })
        }
        html += '</tr>'
      })
      html += '</table>'
      return html
    },
    handleClick(tab, event) {
      if(this.workbook){
        this.readWorkbook(tab.index)
      }
    }
  },
}
</script>

<style>
.xls-view table {
  border-collapse: collapse !important;
}
.xls-view th,
.xls-view td {
  border: solid 1px #6d6d6d !important;
  padding: 5px 10px !important;
  max-width: 200px;
}
</style>
