<template>
  <div class="container">
    <div class="circle_purple"></div>
    <div class="circle_black"></div>
    <div class="box">
      <h1>Sign in.</h1>

      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="Username"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="Password"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="login">Sign in</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          console.log(res)
          if (res.meta.status !== 200) {
            // 失败
            this.$message.error('登陆失败')
          } else {
            this.$message.success('登陆成功')
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #181820;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .box {
    width: 420px;
    height: 40vh;
    background-color: #181820;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    h1 {
      color: #fdfefc;
      font-weight: bold;
    }
    .login_form {
      width: 100%;
      height: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      /deep/.el-form-item__error {
        color: #fb6da5;
        position: absolute;
        margin: 5px 0 0 10px;
      }
      .el-input {
        width: 100%;

        /deep/ .el-input__inner {
          width: 100%;
          height: 50px;
          color: #fdfefc;
          background-color: #181820;
          border: 3px solid #2f2f3b;
          border-radius: 10px;
          padding-left: 10px;
          box-sizing: border-box;
        }
        /deep/ .el-input__inner::placeholder {
          color: #fafbff;
        }
      }
      .el-button {
        width: 100%;
        height: 45px;
        color: #fdfefc;
        border-radius: 10px;
        border: 0;
        background-image: linear-gradient(to top right, #ca4bd0, #ff9e7b);
      }
    }
  }
  .circle_purple {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    position: absolute;
    top: -30px;
    left: 20%;
    background-image: linear-gradient(to top right, #ca4bd0, #ff9e7b);
  }
  .circle_black {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    position: absolute;
    top: 30px;
    right: 25%;
    background-image: linear-gradient(to top right, #111018, #323141);
  }
}
</style>
