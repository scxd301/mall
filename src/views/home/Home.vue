<template>
  <div id="home">
    <nav-bar class="home-nav">
      <slot><div slot="center">购物街</div></slot>
    </nav-bar>
    <tab-control  :titles="['流行','新品','精选']"  ref="tabControl1"
                  class="tab-control" v-show="isTabFixed"
                  @tabClick="tabClick"></tab-control>
    <scroll class="content" ref="scroll"  :probe-type="3" :pull-up-load="true" @scroll="contentScroll" @pullingUp="loadMore">
    <home-swiper  :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control  :titles="['流行','新品','精选']"  ref="tabControl2"
     @tabClick="tabClick"></tab-control>
    <goods-list :goods="showgoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" ></back-top>
  </div>
</template>

<script>
  import backTop from "components/content/backtop/backTop";
  import Scroll from "components/common/scroll/Scroll";
  import NavBar  from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabcontrol/TabControl";
  import HomeSwiper from "./childcomps/HomeSwiper";
  import RecommendView from "./childcomps/RecommendView";
  import FeatureView from "./childcomps/FeatureView";
  import GoodsList from "components/content/goods/GoodsList";
  import {getHomeMultidata,getHomeGoods} from "network/home";

  export default {
      name: "Home",
      components:{
        TabControl,
        NavBar,
        HomeSwiper,
        FeatureView,
        RecommendView,
        GoodsList,
        Scroll,
        backTop
      },
      data(){
        return{
          banners:[],
          recommends:[],
          goods:{
            'pop':{page:0,list:[]},
            'new':{page:0,list:[]},
            'sell':{page:0,list:[]},
          },
          currentType:'pop',
          isShowBackTop:false,
          tabOffsetTop:0,
          isTabFixed:false,
          saveY:0,
        }
      },
    computed:{
        showgoods(){
         return  this.goods[this.currentType].list
        }
    },
      created() {
        //请求多个数据
           this.getHomeMultidata(),
            // 请求商品数据
           this.getHomeGoods('pop'),
           this.getHomeGoods('new'),
           this.getHomeGoods('sell')
      },
       activated() {
         this.$refs.scroll.scrollTo(0,this.saveY,0);
        // this.$refs.scroll.refresh()
       },
       deactivated() {
        //保存y值
         this.saveY=this.$refs.scroll.getScrollY()
         //取消全局监听
        // this.$bus.$off("itemImagLoad")
       },
    mounted() {
      //监听图片加载完成
    //  const refresh=this.debounce(this.$refs.scroll.refresh(),500)

      this.$bus.$on('itemImageLoad',()=>{
       this.$refs.scroll.refresh()
      // // refresh();
      })
    },
    methods:{
        //防抖动
       // debounce(func,delay){
         // let timer=null;
         // return function(...args){
         //   if(timer)clearTimeout(timer)
         //   timer=setTimeout(()=>{
          //    func.apply(this,args)
          //  },delay)
         // }
       // },
      swiperImageLoad(){
        //获取tabControl的offsetTop
        this. tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
      },
        tabClick(index){
          switch (index) {
            case 0:
              this.currentType='pop'
                  break
            case 1:
              this.currentType='new'
                  break
            case 2:
              this.currentType='sell'
                  break
          }
          this.$refs.tabControl1.currentIndex=index;
          this.$refs.tabControl2.currentIndex=index;
        },
      loadMore(){
          this.getHomeGoods(this.currentType)
      },
      backClick(){
          this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
        //判断backtop是否显示
          this.isShowBackTop=(-position.y)>1000;
          //什么时候吸顶
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      //网络请求
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
           console.log(res),
            this.banners=res.data.banner.list,
            this.recommends=res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page=this.goods[type].page+1;
        getHomeGoods(type,page).then(res=>{
        this.goods[type].list.push(...res.data.list),
        this.goods[type].page+=1
          this.$refs.scroll.finishPullUp()
      })

      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .home-nav{
  background-color:var(--color-tint);
  color:#fff;

  position:fixed;
  left: 0;
  right: 0;
  top:0;
  z-index: 9;
  }
  .content{
   overflow: hidden;
    position: absolute;
    top:44px;
    right: 0;
    left:0;
    bottom: 49px;
  }
  .tab-control{
    position:relative;
    z-index: 9;
  }

</style>
