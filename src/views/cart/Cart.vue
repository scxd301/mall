<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">
      购物车({{length}})
      </div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>


  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childcomps/CartList";
  import CartBottomBar from "./childcomps/CartBottomBar";

  import {mapGetters} from 'vuex'
    export default {
      name: "Cart",
      components:{
        NavBar,
        CartList,
        CartBottomBar
      },
      computed:{
      ...mapGetters({
        length:'cartLength',
      })
      }
    }
</script>

<style scoped>

  #cart {
    /*position: relative;*/
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
  }
</style>
