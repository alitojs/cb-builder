<template>
  <div class="actualPersonStyle">
    <a-card :bordered="false" class="oldman-top">
      <div class="table-page-search-wrapper">
        <a-form @keyup.enter.native="searchQuery" :labelCol="{ span: 7 }" :wrapperCol="{ span: 17 }">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="姓名" name="name" :colon="false">
                <a-input v-model="queryParam.name" placeholder="请输入姓名" allowClear />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="证件号码" name="idNumber" :colon="false">
                <a-input v-model="queryParam.idNumber" placeholder="请输入证件号码" allowClear :maxLength="18" />
              </a-form-item>
            </a-col>
            <div v-show="showMore">

            </div>
            <a-col :xl="6" :lg="8" :md="12" :sm="24" v-bind="showMore ? openCol : closeCol">
              <div class="showBtnStyle">
                <a-button type="primary" icon="search" :style="{ width: '100px' }" @click="searchClick">查询</a-button>
                <a-button icon="reload" @click="(e) => resetClick(e)" :style="{ width: '100px', marginLeft: '24px' }"
                  >重置
                </a-button>
                <span class="showMore" @click="showMore = !showMore"
                  >{{ showMore ? '收起' : '展开' }}<a-icon :type="showMore ? 'up' : 'down'"
                /></span>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card class="oldman-bottom">

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="middle"
          :scroll="{ x: 800, y: 'calc(100vh - 500px)' }"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            onSelect: onItemChange,
            columnWidth: selectionFlag ? 60 : 0,
            onSelectAll: onSelectAll,
          }"
          class="table-box"
          @change="handleTableChange"
        >
          <template slot="status" slot-scope="text, record">
            <div class="statusStyle" v-if="record.status_dictText">
              <div
                :class="{
                  statusDot: true,
                  grayBg: text == '0',
                  greenBg: text == '1',
                  orangeBg: text == '2',
                  blueBg: text == '3',
                }"
              />
              <div>{{ record.status_dictText }}</div>
            </div>
            <div v-else>-</div>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div>
              <a>详情</a>
              <a-divider type="vertical" />
              <a>编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => {}">
                <a>删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
        <div class="pageStyle">
          <div>
            <a-checkbox v-show="selectionFlag" :checked="selChecked" @change="selCheckedChange">
              查看已选({{ this.selectedRowKeys.length }})
            </a-checkbox>
            <a-checkbox
              v-show="selectionFlag"
              style="padding-left: 40px"
              :checked="all"
              @change="(e) => checkAllChange(e, 'id', 'get')"
            >
              全部全选
            </a-checkbox>
          </div>
          <a-pagination
            v-if="ipagination.total != 0"
            v-bind="ipagination"
            @change="paginationChange"
            @showSizeChange="paginationChange"
          />
        </div>
        <div class="bottomBtnStyle" v-show="selectionFlag">
          <a-space size="large">
            <a-button @click="batchingClick">取消</a-button>
            <a-button type="danger" @click="allDelClick"> 删除 </a-button>
          </a-space>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { myPublicMixins } from '@/mixins/myPublicMixins'
import { deleteAction } from '@/api/manage'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { getDictItemsFromCache } from '@/api/api'
import { AutoJeecgListMixin } from '@/mixins/AutoJeecgListMixin'

export default {
  name: 'actualPerson',
  mixins: [AutoJeecgListMixin, mixinDevice, myPublicMixins],
  components: {},
  data() {
    return {
      disableMixinCreated: true,
      selectedRowKeys: [],
      queryParam: {}, // 筛选的值
      columns: [
        {
          title: '人员信息',
          align: 'center',
          dataIndex: 'd1',
          width: 450,
          fixed: 'left',
        }
      ],
      url: {
        list: '',
        allList: '',
        delete: '',
        auditBatch: '',
        deleteBatch: '',
        exportXlsUrl: '',
        importExcelUrl: '',
      },
      selectionFlag: false,
      selectedRows: [],
      changePageParams: {},
      MENUS: {
      },
      modalSpinning: false,
      showMore: false,
      closeCol: {
        xl: 6,
        lg: 8,
        md: 12,
        sm: 24,
      },
      openCol: {
        xl: 24,
        lg: 24,
        md: 24,
        sm: 24,
      },
    }
  },
  created() {
  },
  mounted() {
    this.paramsOptions = {
    }
    this.listQueryType = 'get'

  },
  methods: {
    getDictItemsFromCache,
    // 下一条数据点击事件
    continueNext({ type }) {
      if (type == 'process') {
        this.$set(this.processData, 'data', this.dataSource[this.currentIndex])
        this.$nextTick(() => {
          this.$refs.processModalRef.init()
        })
      } else if (type == 'detail') {
        this.$set(this.detailData, 'data', this.dataSource[this.currentIndex])
        this.$nextTick(() => {
          this.$refs.personDetailRef.init()
        })
      }
    },
    // 改变请求列表的入参
    customChangeParams(params) {
      return params
    },
    // 重置
    resetClick(e) {
      this.searchReset(e, {})
    },
    searchClick() {
      this.searchQuery()
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        this.selectedRows = selectedRows
      } else {
        this.selectedRows = []
      }
    },
    // 列表勾选方法
    onItemChange(record, selected) {
      if (selected) {
        this.selectedRows.push(record)
      } else {
        const newList = this.selectedRows.filter((it) => it.id != record.id)
        this.selectedRows = newList
      }
    },
    // 列表勾选方法
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除点击事件
    allDelClick() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请选择至少一项数据')
        return
      }
      var ids = (this.selectedRowKeys || []).join(',')
      const that = this
      this.$error({
        title: '提示',
        content: '是否确认删除?',
        onOk: function () {
          that.loading = true
          deleteAction('', { ids })
            .then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.loading = false
            })
        },
      })
    },
  },
}
</script>

<style scoped lang="less">

.orgClass {
  background-color: #ff9100 !important;
  border: 1px solid #ff9100 !important;
}


.pageStyle {
  width: 100%;
  display: flex;
  padding: 20px 0;
  justify-content: space-between;
}

.actualPersonStyle {
  /deep/.ant-table-thead {
    .ant-table-row-cell-break-word {
      height: 70px;
    }
  }
  /deep/.ant-table-row-cell-break-word {
    height: 110px;
  }

  /deep/.ant-table-selection-column {
    overflow-x: hidden;
  }

  /deep/.ant-input-prefix {
    z-index: 1;
  }
  /deep/.ant-input-suffix {
    z-index: 1;
  }

  .showBtnStyle {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .showMore {
      color: #008cf1;
      cursor: pointer;
      padding-left: 20px;
    }

    .showMoreStyle {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 10px;

      .showMoreImg {
        width: 16px;
        height: 16px;
      }

      .showMoreText {
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #008cf1;
        line-height: 36px;
        padding-right: 5px;
      }
    }
  }
  .oldman-top {
    box-shadow: 0 1px 6px rgba(34, 40, 82, 0.12);
  }

  .oldman-bottom {
    margin-top: 10px;
    box-shadow: 0 1px 6px rgba(34, 40, 82, 0.12);

    .table-operator {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .topl-commandNumber {
        display: flex;
        align-items: center;
      }

      .top-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .topl-line {
          width: 2px;
          height: 18px;
          background: #2c43ef;
          border-radius: 0px 2px 2px 0px;
          opacity: 1;
        }
        .topl-text {
          font-size: 20px;
          font-family: Source Han Sans CN-Bold, Source Han Sans CN;
          font-weight: bold;
          color: #000000;
          padding-left: 10px;
        }
      }
    }
  }

  .bottomBtnStyle {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .checkBtn {
      background: #ff9100;
      border: 1px solid #ff9100;
    }
  }
}

.statusStyle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.statusDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}

.grayBg {
  background-color: #979eb4;
}
.greenBg {
  background-color: #0bae58;
}
.orangeBg {
  background-color: #ff9100;
}
.blueBg {
  background-color: #1cc5d7;
}


</style>
