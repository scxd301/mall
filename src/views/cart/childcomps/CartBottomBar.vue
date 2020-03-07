<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button  :is-checked="isSelectAll" class="check-button"  @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate"   @click.native="calcClick">
     去计算({{checkLength}})
    </div>

  </div>

</template>

<script>
  import CheckButton from "components/content/checkbutton/CheckButton";
  import {mapGetters} from 'vuex'

	export default {
		name: "CartBottomBar",
    components: {
		  CheckButton
    },
    methods:{
		  checkClick(){
		    if(this.isSelectAll){
		      this.cartList.forEach(item=>item.checked=false)
        }else{
          this.cartList.forEach(item=>item.checked=true)
        }
      },
      calcClick(){
        if(!this.isSelectAll){
          this.$toast.show('请选择需要购买的商品',2000);
        }

      }
    },
    computed:{
		  ...mapGetters(['cartList']),
		  totalPrice(){
		    return '￥'+ this.cartList.filter(item=>{
		      return item.checked
        }).reduce((preValue,item)=>{
          return  preValue+item.price*item.count
        },0)
    },
      checkLength(){
		    return this.cartList.filter(item=>item.checked).length
      },
      isSelectAll(){
		    if(this.cartList.length===0) return false;
		    return !this.cartList.find(item=>!item.checked)
      }

	}
	}
</script>

<style scoped>
  .bottom-bar{
    height:40px;
    background-color: #999999;
    position:absolute;
    right: 0;
    left:0;
    bottom:49px;
    display:flex
  }
  .check-content{
    display: flex;
    align-items: center;
    width:40px
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height:20px;
  }
  .price{
    text-align: center;
    margin-top: 12px;
    font-size: 9px;
    margin-left: 20px;
    flex:1
  }
  .calculate{
    width: 90px;
    background-color:#ff6699;
    text-align: center;
    line-height: 40px;
    font-size: 9px;
  }


</style>
