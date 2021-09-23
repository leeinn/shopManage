<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式布局 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary">添加分类</el-button>

      <!-- 表格 -->
      <!-- <zk-table :data="categoriesList" :colums="colums" :prop="cat_name"
        >123</zk-table
      > -->
      <tree-table
        :data="categoriesList"
        :columns="colums"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=" "
        border
        :show-row-hover="false"
        stripe
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === 'false'"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
      </tree-table>

      <!-- 分页 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      categoriesListParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      categoriesList: [],
      // 总条数
      total: 0,
      // 表格列配置
      colums: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 将这列定义为模板列
        type: 'template',
        // 这列使用的模板名称
        template: 'isOk'
      }]
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await this.axios.get('categories', { params: this.categoriesListParams })
      if (res.meta.status === 200) {
        this.categoriesList = res.data.result
        this.total = res.data.total
        this.$message.success('获取商品分类列表成功')
      } else {
        this.$message.error('获取商品分类列表失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
