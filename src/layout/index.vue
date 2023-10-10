<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar @open="openDialog" />
      </div>
      <app-main />
      <!-- 修改密码弹框 -->
      <el-dialog width="500px" title="修改密码" :visible.sync="showDialog" @close="btnCancel">
        <el-form ref="formEl" :model="passForm" label-width="120px" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passForm.oldPassword" show-password size="small" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passForm.newPassword" show-password size="small" />
          </el-form-item>
          <el-form-item label="重复密码" prop="confirmPassword">
            <el-input v-model="passForm.confirmPassword" show-password size="small" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="btnOK">确认修改</el-button>
            <el-button size="mini" @click="btnCancel">取消</el-button>
          </el-form-item></el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { updatePassword } from '@/api/user'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showDialog: false,
      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }], // 旧密码
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          min: 6,
          max: 16,
          message: '新密码的长度为6-16位之间'
        }], // 新密码
        confirmPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            // value
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }] // 确认密码字段
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    openDialog() {
      // 打开弹层
      this.showDialog = true
    },
    // 确定
    btnOK() {
      this.$refs.formEl.validate(async isOK => {
        if (isOK) {
          // 调用接口
          console.log(this.passForm, '修改密码')
          await updatePassword(this.passForm)
          this.$message.success('密码修改成功，请重新登陆！')
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.formEl.resetFields() // 重置表单
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
