!function(){var e="biigle.geo.imageSequence."+biigle.$require("volumes.volumeId"),i=(biigle.$require("volumes.events"),{id:"geo",label:"geo selection",help:"All images that were (not) selected on the world map.",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],data:function(){return{name:"geo selection"}},created:function(){var e=this;window.addEventListener("storage",function(){e.$emit("refresh",e.rule)})}},getSequence:function(i){return new Vue.Promise(function(i,t){i({data:JSON.parse(localStorage.getItem(e))||[]})})}});biigle.$require("volumes.stores.filters").push(i)}();