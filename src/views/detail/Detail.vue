<template>
<div id="detail">
<detail-nav-bar class="detail-nav" @titleClick="titleClick"  ref="nav"></detail-nav-bar>
  <scroll class='content'  ref="scroll" :probe-type="3" @scroll="contentScroll">
  <detail-swiper :top-images="topImages"></detail-swiper>
  <detail-base-info  :goods="goods"></detail-base-info>
  <detail-shop-info :shop="shop"></detail-shop-info>
   <detail-goods-info :detail-info="detailInfo"  @image-load="imageLoad"></detail-goods-info>
    <detail-param-info  ref="params" :param-info="paramInfo"></detail-param-info>
    <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
    <goods-list  ref="recommend" :goods="recommends"></goods-list>

  </scroll>
  <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
</div>
</template>

<script>
  import DetailNavBar from "./childcomps/DetailNavBar";
  import DetailSwiper from "./childcomps/DetailSwiper";
  import DetailBaseInfo from "./childcomps/DetailBaseInfo";
  import DetailShopInfo from "./childcomps/DetailShopInfo";
  import DetailGoodsInfo from "./childcomps/DetailGoodsInfo";
  import DetailParamInfo from "./childcomps/DetailParamInfo";
  import DetailCommentInfo from "./childcomps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childcomps/DetailBottomBar";
  import Scroll from "components/common/scroll/Scroll";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/datail";
  import {debouce} from "../../common/utils";

  export default {
      name: "Detail",
      components:{
        DetailParamInfo,
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        Scroll
      },
      data(){
          return{
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommends:[],
            themeTopYs:[],
            getThemeTopYs:[],
            currentIndex:0
          }
      },
    created() {
          //保存传入的iid
          this.iid=this.$route.params.iid;
        //根据iid请求详情数据
        getDetail(this.iid).then(res=>{
          const data=res.result;
          console.log(res);
          //获取顶部轮播数据
          this.topImages=res.result.itemInfo.topImages;
          //商品信息
          this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services);
          //店铺信息
          this.shop=new Shop(data.shopInfo)
          //商品详细信息
          this.detailInfo=data.detailInfo
          //获取参数信息
          this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)
          //获取评论信息
          if(data.rate.cRate!==0){
            this.commentInfo=data.rate.list[0];
          }
          //获取推荐信息
          getRecommend().then(res=>{
            this.recommends=res.data.list
          })
          //请求y

        })

      },
    updated() {
        this.themeTopYs=[],
          this.themeTopYs.push(0),
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    },

    methods:{
      imageLoad(){
          this.$refs.scroll.refresh();
        },
      titleClick(index){
          //console.log(index);
          this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100);
      },
      contentScroll(position){
        const positionY=-position.y;
        let length=this.themeTopYs.length;
        for(let i=0;i<length;i++){
          if(this.currentIndex!==i&&((i<length-1&&positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])||
            (i===length-1&&positionY>=this.themeTopYs[i]))){
            this.currentIndex=i;
            this.$refs.nav.currentIndex=this.currentIndex
          }
        }
      },
      addToCart(){
        //获取相关信息
        const product = {}
        // 2.对象信息
        product.iid = this.iid;
        product.img = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;

        // 3.添加到Store中
        this.$store.dispatch('addCart', product).then(res=>{
         // console.log(res)
          this.$toast.show(res,2000)
        });

      }
    }
    }
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height:100vh;
}
  .content{
    height: 800px
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
