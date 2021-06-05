// components/w-tab-control/w-tab-control.js
Component({

  properties: {
    titles:{
      type:Array,
      value:[]
    }
  },

  data: {
    currentIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick(event) {
      const index = event.currentTarget.dataset.index
      //修改currentIndex的值
      this.setData({
        currentIndex: index
      })
      //向外发出事件
      this.triggerEvent('itemClick',{index:this.data.currentIndex},{})
    }
  }
})
