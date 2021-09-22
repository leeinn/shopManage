<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开 角色权限 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="i of scope.row.children" :key="i.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, i.id)">{{
                  i.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="j of i.children" :key="j.id">
                  <!-- 二级权限 -->
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, j.id)"
                      >{{ j.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, k.id)"
                      v-for="k of j.children"
                      :key="k.id"
                      >{{ k.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightsSettingDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsSettingVisible"
      width="50%"
      @close="rightsSettingClose"
    >
      <button @click="test">um</button>
      <!-- 树形列表 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRightsRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer">
        <el-button @click="rightsSettingVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightsSetting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表
      roleList: [],
      editDialogVisible: false,
      // 查询的角色信息
      editForm: {},
      editFormRules: {
        roleName: {
          required: true, message: '请输入角色名称', trigger: 'blur'
        },
        roleDesc: {
          required: true, message: '请输入角色描述', trigger: 'blur'
        }
      },
      rightsSettingVisible: false,
      // 所有的权限数据(树)
      rightsList: [],
      // 树形控件属性绑定
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 树形控件默认选中的节点
      defKeys: [],
      // 分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status === 200) {
        this.roleList = res.data
        // console.log(this.roleList)
        this.$message.success('获取角色列表成功')
      } else {
        this.$message.error('获取角色列表失败')
      }
    },
    // 显示编辑角色对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.axios.get('roles/' + id)
      if (res.meta.status === 200) {
        this.editForm = res.data
      } else {
        this.$message.error('查询用户失败')
      }
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.axios.put('roles/' + this.editForm.roleId, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          if (res.meta.status === 200) {
            this.editDialogVisible = false
            this.getRolesList()
            this.$message.success('修改用户信息成功')
          } else {
            return this.$message.error('修改用户信息失败')
          }
        }
      })
    },
    removeRoleById(roleId) {
      this.$confirm('即将删除该用户', '提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.axios.delete('roles/' + roleId)
        if (res.meta.status === 200) {
          this.$message.success('已经删除该用户')
          await this.getRolesList()
        } else {
          this.$message.error('删除用户失败')
        }
      }).catch((err) => {
        this.$message.info('已经取消删除')
        return err
      })
    },
    removeRightById(role, rightId) {
      this.$confirm('即将删除该权限', '提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.axios.delete('roles/' + role.id + '/rights/' + rightId)
        if (res.meta.status === 200) {
          role.children = res.data
          this.$message.success('删除权限成功')
        } else {
          this.$message.error('删除权限失败')
        }
      }).catch((err) => {
        this.$message.info('已经取消删除')
        return err
      })
    },
    // 展示分配权限对话框
    async showRightsSettingDialog(role) {
      this.getLeafKeys(role.children)
      this.roleId = role.id
      // 获取树形权限列表
      if (this.rightsList.length !== 0) {
        this.rightsSettingVisible = true
        return
      }
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status === 200) {
        this.rightsSettingVisible = true
        this.rightsList = res.data
        this.$message.success('获取权限列表成功')
      } else {
        this.$message.error('获取权限列表失败')
      }
    },
    getLeafKeys(rights) {
      // 获取三级权限id
      const arr = []
      for (const i of rights) {
        for (const j of i.children) {
          for (const k of j.children) {
            arr.push(k.id)
          }
        }
      }
      this.defKeys = arr
    },
    test() {
      this.defKeys = []
      console.log(this.defKeys)
    },
    rightsSettingClose() {
      // 清空树 直接赋值不能监听到 ?
      this.$refs.treeRightsRef.setCheckedKeys([])
    },
    // 给角色分配权限
    async rightsSetting() {
      const idarr = [...this.$refs.treeRightsRef.getCheckedKeys(), ...this.$refs.treeRightsRef.getHalfCheckedKeys()]
      const idStr = idarr.join(',')
      const { data: res } = await this.axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status === 200) {
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.rightsSettingVisible = false
      } else {
        this.$message.error('分配权限失败')
      }
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  border-bottom: 1px solid #eee;
  .el-row {
    &:last-of-type {
      border-bottom: 0;
    }
  }
  .el-tag {
    margin: 10px;
  }
}
</style>
