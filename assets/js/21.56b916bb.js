(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{271:function(t,e,i){},281:function(t,e,i){"use strict";i(271)},297:function(t,e,i){"use strict";i.r(e);var s={name:"TopNav",data:()=>({displayText:""}),mounted(){this.changeText(),this.$router.afterEach(()=>{this.isSidebarOpen=!1,this.changeText()})},methods:{changeText(){let t=this.$route.path.split("/")[1];["0.1"].includes(t)?this.displayText="This is the documentation for the current version (v0.1) of UnoPim. Stay informed and make the most of UnoPim's capabilities.":this.displayText="master"===t?"WARNING: You're browsing the documentation for an upcoming version. Features of this release are subject to change.":'Heads up: You are viewing outdated documentation for UnoPim. Please consider upgrading to <a class="nav-text latest-version-link" href="/0.1/prologue">v1.x</a> for the latest information.'}}},a=(i(281),i(10)),n=Object(a.a)(s,(function(){var t=this._self._c;return t("div",{staticClass:"top-nav"},[t("div",{staticClass:"nav-text",domProps:{innerHTML:this._s(this.displayText)}})])}),[],!1,null,null,null);e.default=n.exports}}]);