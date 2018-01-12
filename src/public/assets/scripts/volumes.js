Array.isArray(biigle.$require("volumes.stores.filters"))&&biigle.$require("volumes.stores.filters").push({id:"geo",label:"geo selection",help:"All images that were (not) selected on the world map.",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],data:function(){return{name:"geo selection"}},created:function(){var e=this;window.addEventListener("storage",function(){e.$emit("refresh",e.rule)})}},getSequence:function(e){var i="biigle.geo.imageSequence."+e;return new Vue.Promise(function(e,t){e({data:JSON.parse(localStorage.getItem(i))||[]})})}}),biigle.$viewModel("volume-geo-overlay-upload",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("api.geoOverlays"),s={props:["overlay"],computed:{classObject:function(){return{"list-group-item-success":this.overlay.isNew}},title:function(){return"Delete overlay "+this.overlay.name}},methods:{remove:function(){confirm("Are you sure you want to delete the overlay "+this.overlay.name+"?")&&this.$emit("remove",this.overlay)}}};new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],components:{tabs:VueStrap.tabs,tab:VueStrap.tab,overlayItem:s,plainOverlayForm:biigle.$require("geo.volumes.components.plainOverlayForm")},data:{overlays:biigle.$require("volumes.geoOverlays")},computed:{classObject:function(){return{"panel-warning panel--editing":this.editing}},hasOverlays:function(){return this.overlays.length>0}},methods:{addOverlay:function(e){e.isNew=!0,this.overlays.unshift(e),this.finishLoading()},handleRemove:function(e){this.startLoading();var s=this;t.delete({id:e.id}).then(function(){s.overlayRemoved(e)}).catch(i.handleErrorResponse).finally(this.finishLoading)},overlayRemoved:function(e){for(var i=this.overlays,t=i.length-1;t>=0;t--)if(i[t].id===e.id)return void i.splice(t,1)}}})}),biigle.$declare("api.geoOverlays",Vue.resource("api/v1/geo-overlays{/id}",{},{savePlain:{method:"POST",url:"api/v1/volumes{/volume_id}/geo-overlays/plain"}})),biigle.$component("geo.volumes.components.plainOverlayForm",{mixins:[biigle.$require("core.mixins.loader")],data:function(){return{selectedFile:null,selectedName:"",selectedTLLat:"",selectedTLLng:"",selectedBRLat:"",selectedBRLng:"",errors:{}}},computed:{fileTooBig:function(){return this.selectedFile&&this.selectedFile.size>1e7},canSubmit:function(){return this.selectedFile&&!this.fileTooBig&&""!==this.selectedTLLat&&""!==this.selectedTLLng&&""!==this.selectedBRLat&&""!==this.selectedBRLng&&!this.loading}},methods:{selectFile:function(e){this.selectedFile=e.target.files[0],this.selectedName||(this.selectedName=this.selectedFile.name),this.fileTooBig&&(this.errors.file=["The overlay file must not be larger than 10 MByte."])},submit:function(){if(this.canSubmit){var e=new FormData(this.$refs.form);this.$emit("loading-start"),this.startLoading(),biigle.$require("api.geoOverlays").savePlain({volume_id:biigle.$require("volumes.id")},e).then(this.handleSuccess,this.handleError).finally(this.finishLoading)}},handleError:function(e){422===e.status?this.errors=e.data:biigle.$require("messages.store").handleErrorResponse(e),this.$emit("error")},hasError:function(e){return this.errors.hasOwnProperty(e)},getError:function(e){return this.hasError(e)?this.errors[e].join(" "):""},handleSuccess:function(e){this.$emit("success",e.data),this.reset()},reset:function(){this.selectedFile=null,this.selectedName="",this.selectedTLLat="",this.selectedTLLng="",this.selectedBRLat="",this.selectedBRLng="",this.errors={}}}});