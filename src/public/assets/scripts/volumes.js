!function(e){var t={};function i(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=t,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i(i.s=1)}({1:function(e,t,i){e.exports=i("8ALi")},"8ALi":function(e,t,i){"use strict";i.r(t);var r=biigle.$require("volumes.stores.filters"),n=biigle.$require("volumes.components.filterListComponent"),s=biigle.$require("messages").handleErrorResponse,o=biigle.$require("core.mixins.loader"),l=biigle.$require("core.mixins.editor");Array.isArray(r)&&r.push({id:"geo",label:"geo selection",help:"All images that were (not) selected on the world map.",listComponent:{mixins:[n],data:function(){return{name:"geo selection"}},created:function(){var e=this;window.addEventListener("storage",(function(){e.$emit("refresh",e.rule)}))}},getSequence:function(e){var t="biigle.geo.imageSequence."+e;return new Vue.Promise((function(e,i){e({data:JSON.parse(localStorage.getItem(t))||[]})}))}});var a=Vue.resource("api/v1/geo-overlays{/id}",{},{savePlain:{method:"POST",url:"api/v1/volumes{/volume_id}/geo-overlays/plain"}}),u={mixins:[o],data:function(){return{selectedFile:null,selectedName:"",selectedTLLat:"",selectedTLLng:"",selectedBRLat:"",selectedBRLng:"",errors:{},volumeId:null}},computed:{fileTooBig:function(){return this.selectedFile&&this.selectedFile.size>1e7},canSubmit:function(){return this.selectedFile&&!this.fileTooBig&&""!==this.selectedTLLat&&""!==this.selectedTLLng&&""!==this.selectedBRLat&&""!==this.selectedBRLng&&!this.loading}},methods:{selectFile:function(e){this.selectedFile=e.target.files[0],this.selectedName||(this.selectedName=this.selectedFile.name),this.fileTooBig&&(this.errors.file=["The overlay file must not be larger than 10 MByte."])},submit:function(){if(this.canSubmit){var e=new FormData(this.$refs.form);this.$emit("loading-start"),this.startLoading(),a.savePlain({volume_id:this.volumeId},e).then(this.handleSuccess,this.handleError).finally(this.finishLoading)}},handleError:function(e){422===e.status?this.errors=e.data:s(e),this.$emit("error")},hasError:function(e){return this.errors.hasOwnProperty(e)},getError:function(e){return this.hasError(e)?this.errors[e].join(" "):""},handleSuccess:function(e){this.$emit("success",e.data),this.reset()},reset:function(){this.selectedFile=null,this.selectedName="",this.selectedTLLat="",this.selectedTLLng="",this.selectedBRLat="",this.selectedBRLng="",this.errors={}}},created:function(){this.volumeId=biigle.$require("volumes.id")}},c={props:["overlay"],computed:{classObject:function(){return{"list-group-item-success":this.overlay.isNew}},title:function(){return"Delete overlay "+this.overlay.name}},methods:{remove:function(){confirm("Are you sure you want to delete the overlay ".concat(this.overlay.name,"?"))&&this.$emit("remove",this.overlay)}}},d={mixins:[o,l],components:{tabs:VueStrap.tabs,tab:VueStrap.tab,overlayItem:c,plainOverlayForm:u},data:{overlays:[]},computed:{classObject:function(){return{"panel-warning panel--editing":this.editing}},hasOverlays:function(){return this.overlays.length>0}},methods:{addOverlay:function(e){e.isNew=!0,this.overlays.unshift(e),this.finishLoading()},handleRemove:function(e){var t=this;this.startLoading(),a.delete({id:e.id}).then((function(){return t.overlayRemoved(e)})).catch(s).finally(this.finishLoading)},overlayRemoved:function(e){for(var t=this.overlays,i=t.length-1;i>=0;i--)if(t[i].id===e.id)return void t.splice(i,1)}},created:function(){this.overlays=biigle.$require("volumes.geoOverlays")}};biigle.$mount("volume-geo-overlay-upload",d)}});