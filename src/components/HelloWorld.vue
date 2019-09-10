<template>
  <div class="hello">
    <el-button type="primary" size="small" style="float: left;margin-bottom: 10px;" @click="beforeInsert()">新增信息</el-button>
    <el-table
    :data="tableData"
    :loading="!tableData"
    style="width: 100%">
    <el-table-column
      label="Id"
      width="50"
      prop="id">
    </el-table-column>
    <el-table-column
      prop="report_id"
      label="编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="assignor"
      label="委托人"
      width="240">
    </el-table-column>
    <el-table-column
      prop="product"
      label="产品名称">
    </el-table-column>
    <el-table-column
      prop="create_date"
      label="签发日期">
    </el-table-column>
    <el-table-column
      prop="ems"
      label="EMS单号">
    </el-table-column>
    <el-table-column
      prop="filename"
      width="240"
      label="文件">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button @click="deleteRow(scope.row, scope.$index)" type="text" size="small">删除</el-button>
        <el-button type="text" size="small" @click="beforeEdit(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    :title="isEdit ? '修改': '新增'"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form label-width="80px" :model="formLabelAlign">
    <el-form-item label="编号">
      <el-input v-model="formLabelAlign.report_id" placeholder="请输入数字类型"></el-input>
    </el-form-item>
    <el-form-item label="委托人">
      <el-input v-model="formLabelAlign.assignor" placeholder="请输入文字"></el-input>
    </el-form-item>
    <el-form-item label="产品名称">
      <el-input v-model="formLabelAlign.product" placeholder="请输入文字"></el-input>
    </el-form-item>
    <el-form-item label="签发日期">
      <el-input v-model="formLabelAlign.create_date" placeholder="时间类型,如2019-05-01"></el-input>
    </el-form-item>
    <el-form-item label="EMS单号">
      <el-input v-model="formLabelAlign.ems" placeholder="请输入数字类型"></el-input>
    </el-form-item>
    <el-form-item label="PDF文件" v-if="!isEdit">
      <el-button type="primary" size="mini" style="float: left;margin-top: 6px;" @click="uploadFile">文件上传</el-button>
      {{formLabelAlign.filename}}
      <input type="file" ref="file" @change="doUpload" style="display: none"  accept="application/pdf" />
    </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="doUpdate">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      tableData: null,
      dialogVisible: false,
      isEdit: false,
      formLabelAlign: {
        filename: null
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    uploadFile () {
      this.$refs.file.click()
    },
    doUpload (e) {
      const file = e.target.files[0]
      const formdata = new FormData()
      formdata.append('files', file)
      this.$fetch({
        api: 'uploads',
        params: formdata,
        configs: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.formLabelAlign.filename = res.filename
        this.$message.success('上传成功')
      })
    },
    getList () {
      this.$fetch({
        api: 'list'
      }).then(res => {
        function ten(i) {
            return i > 9 ? i : ('0'+i)
        }
        if (res.code === 0) {
          this.tableData = res.data.reverse().map(v => {
            const date = new Date(v.create_date)
            v.create_date = date.getFullYear() + '-' + ten(date.getMonth() + 1) + '-' + ten(date.getDate())
            return v
          })
        }
      })
    },
    deleteRow(item, i) {
      this.$fetch({
        api: 'delete',
        params: item
      }).then(res => {
        if (res.code === 0) {
          this.tableData.splice(i, true)
          this.$message.success('删除成功')
        }
      })
    },
    beforeEdit(item) {
      this.dialogVisible = true
      this.isEdit = true
      this.formLabelAlign = item
    },
    beforeInsert () {
      this.dialogVisible = true
      this.isEdit = false
      this.formLabelAlign = {}
    },
    doUpdate () {
      if (!this.isEdit && !this.formLabelAlign.filename) return this.$message.warning('请上传文件')
      this.$fetch({
        api: this.isEdit ? 'update' : 'insert',
        params: this.formLabelAlign
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message.success('操作失败')
        }
      })
  
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 1200px;
  margin: auto
}
</style>
