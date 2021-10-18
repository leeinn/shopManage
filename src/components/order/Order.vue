<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--      搜索-->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      表格-->
      <el-row>
        <el-table :data="orderList" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
          ></el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格"
            width="250px"
          ></el-table-column>
          <el-table-column label="是否支付" width="250px">
            <template v-slot="scope">
              <el-tag type="danger" v-if="scope.row.pay_status === '0'"
                >未付款</el-tag
              >
              <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货"
            width="250px"
          ></el-table-column>
          <el-table-column label="下单时间" width="250px">
            <template v-slot="scope">
              {{ getTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="">
              <el-tooltip
                class="item"
                effect="dark"
                content="修改地址"
                placement="top"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showBox"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="物流状态"
                placement="top"
              >
                <el-button
                  type="success"
                  icon="el-icon-location"
                  circle
                  @click="showProgressBox"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!--      分页区-->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 9, 11, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!--    修改地址的对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      @close="addressDialogClosed"
      width="50%"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!--          <el-input v-model="addressForm.address1"></el-input>-->
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--    显示物流进度的对话框-->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      // 订单列表的数据
      orderList: [],
      // 订单的总数量
      total: 0,
      // 修改地址的对话框
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      // 地址的选择
      cityData,
      // 显示物流进度的
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      this.$message.success('获取订单列表成功!')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res, this.orderList, this.total)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getOrderList()
    },
    // 展示修改对话框
    showBox() {
      this.addressDialogVisible = true
    },
    // 关闭对话框清空表达
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      this.progressDialogVisible = true
    },
    getTime(time) {
      time = new Date(time)
      return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
    }
  }
}
</script>

<style scoped>
.el-table {
  margin: 15px 0 5px;
}
.el-cascader {
  width: 100%;
}
</style>
