<template>
  <el-container class="home">
    <el-aside :width="isCollapse ? '65px' : '200px'">
      <el-menu
        class="el-menu-vertical-demo"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath"
      >
        <!-- 一级菜单 -->
        <el-submenu
          :index="item.id + ''"
          v-for="item in menuList"
          :key="item.id"
        >
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="childItem.path"
            v-for="childItem in item.children"
            :key="childItem.id"
            @click="saveActivePath(childItem.path)"
          >
            <template>
              <i class="el-icon-menu"></i>
              <span>{{ childItem.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>

      <!-- 折叠展开 -->
      <div class="fold-button" @click="foldMenu">
        <div class="fold" v-if="!isCollapse">
          Fold Menu
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="unfold" v-else>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header
        >Header
        <div>
          <el-button @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单
      menuList: [],
      iconsObj: {
        // 一级菜单的icon图标
        147: 'el-icon-magic-stick',
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: 'roles'
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.menuList = res.data
        console.log(this.menuList)
      }
    },
    foldMenu() {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  .el-aside {
    background-color: #f2f6f9;
    position: relative;
    .el-submenu {
      .iconfont {
        margin-right: 5px;
        font-size: 18px;
      }
    }
    .fold-button {
      width: 100%;
      line-height: 50px;
      // font-size: 24px;
      text-align: center;
      cursor: pointer;
      position: absolute;
      bottom: 0;
    }
    .fold-button:hover {
      background-color: #ecf5ff;
    }
  }
  .el-header {
    background-color: #69def4;
  }
  .el-main {
    background-color: #e9edf1;
  }
}
</style>
