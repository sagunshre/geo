biigle.geo={},biigle.geo.events=new Vue,biigle.$viewModel("geo-image-location-panel",function(e){new Vue({el:e,data:{images:[biigle.geo.image]},components:{imageMap:biigle.geo.components.imageMap}})}),biigle.$viewModel("geo-map",function(e){new Vue({el:e,data:{images:biigle.geo.images,key:"biigle.geo.imageSequence."+biigle.geo.transect.id},computed:{selectedImages:function(){return JSON.parse(localStorage.getItem(this.key))||[]}},components:{imageMap:biigle.geo.components.imageMap,sidebar:biigle.geo.components.sidebar,sidebarButton:biigle.geo.components.sidebarButton,sidebarTab:biigle.geo.components.sidebarTab},methods:{handleSelectedImages:function(e){e.length>0?localStorage.setItem(this.key,JSON.stringify(e)):localStorage.removeItem(this.key)}}})}),biigle.$viewModel("geo-sidebar",function(e){new Vue({el:e,components:{sidebar:biigle.geo.components.sidebar,sidebarButton:biigle.geo.components.sidebarButton,sidebarTab:biigle.geo.components.sidebarTab,labelTrees:biigle.geo.components.labelTrees},methods:{handleSidebarToggle:function(){setTimeout(function(){biigle.geo.events.$emit("sidebar.toggle")})}}})}),biigle.geo.components={},biigle.geo.components.imageMap={template:'<div class="image-map"></div>',props:{images:{type:Array,required:!0},preselected:{type:Array,default:function(){return[]}},interactive:{type:Boolean,default:!0},zoom:{type:Number},selectable:{type:Boolean,default:!1}},methods:{parseSelectedFeatures:function(e){return e.getArray().map(function(e){return e.get("id")})}},mounted:function(){for(var e=[],t=this,o=this.images.length-1;o>=0;o--)e.push(new ol.Feature({id:this.images[o].id,preselected:this.preselected.indexOf(this.images[o].id)!==-1,geometry:new ol.geom.Point(ol.proj.fromLonLat([this.images[o].lng,this.images[o].lat]))}));var i=new ol.source.Vector({features:e}),n=i.getExtent(),l=new ol.layer.Tile({source:new ol.source.OSM}),s=new ol.layer.Vector({source:i,style:biigle.geo.ol.style.default,updateWhileAnimating:!0,updateWhileInteracting:!0}),a=new ol.Map({target:this.$el,layers:[l,s],view:new ol.View,interactions:ol.interaction.defaults({altShiftDragRotate:!1,doubleClickZoom:this.interactive,keyboard:this.interactive,mouseWheelZoom:this.interactive,shiftDragZoom:!1,dragPan:this.interactive,pinchRotate:!1,pinchZoom:this.interactive}),controls:ol.control.defaults({zoom:this.interactive})});if(a.getView().fit(n,a.getSize()),this.zoom&&a.getView().setZoom(this.zoom),this.interactive&&(a.addControl(new ol.control.ScaleLine),a.addControl(new ol.control.ZoomToExtent({extent:n,label:""})),a.addControl(new ol.control.OverviewMap({collapsed:!1,collapsible:!1,layers:[l],view:new ol.View({zoom:1,maxZoom:1})}))),this.selectable){var r=new ol.interaction.Select({style:biigle.geo.ol.style.selected,features:e.filter(function(e){return e.get("preselected")})}),c=r.getFeatures();a.addInteraction(r),r.on("select",function(e){t.$emit("select",t.parseSelectedFeatures(c))});var g=new ol.interaction.DragBox({condition:ol.events.condition.platformModifierKeyOnly});a.addInteraction(g),g.on("boxend",function(){c.clear(),i.forEachFeatureIntersectingExtent(g.getGeometry().getExtent(),function(e){c.push(e)}),t.$emit("select",t.parseSelectedFeatures(c))})}biigle.geo.events.$on("sidebar.toggle",function(){a.updateSize()})}},biigle.geo.components.labelTrees={template:'<div class="label-trees"></div>',data:function(){return{}},computed:{},mounted:function(){}},biigle.geo.components.sidebar={template:'<aside class="sidebar" :class="classObject"><div class="sidebar__buttons"><slot name="buttons"></slot></div><div class="sidebar__tabs"><slot name="tabs"></slot></div></aside>',props:{openTab:{type:String}},data:function(){return{open:!1}},computed:{classObject:function(){return{"sidebar--open":this.open}}},mounted:function(){this.$on("open",function(){this.open=!0,this.$emit("toggle")}),this.$on("close",function(){this.open=!1,this.$emit("toggle")}),this.openTab&&this.$emit("open",this.openTab)}},biigle.geo.components.sidebarButton={template:'<button class="sidebar__button btn btn-default btn-lg" :class="classObject" @click="toggle" :title="title"><span v-if="open" class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span v-else class="glyphicon" :class="iconClass" aria-hidden="true"></span></button>',data:function(){return{open:!1}},props:{name:{type:String,required:!0},icon:{type:String,required:!0},title:{type:String}},computed:{iconClass:function(){return"glyphicon-"+this.icon},classObject:function(){return{active:this.open}}},methods:{toggle:function(){this.open?this.$parent.$emit("close"):this.$parent.$emit("open",this.name)}},mounted:function(){var e=this;this.$parent.$on("open",function(t){e.open=t===e.name}),this.$parent.$on("close",function(){e.open=!1})}},biigle.geo.components.sidebarTab={template:'<div class="sidebar__tab" :class="classObject"><slot></slot></div>',data:function(){return{open:!1}},props:{name:{type:String,required:!0}},computed:{classObject:function(){return{"sidebar__tab--open":this.open}}},mounted:function(){var e=this;this.$parent.$on("open",function(t){e.open=t===e.name}),this.$parent.$on("close",function(){e.open=!1})}},biigle.geo.ol={},ol&&(biigle.geo.ol.style={colors:{blue:"#0099ff",white:"#ffffff",orange:"#ff5e00"},radius:{default:6},strokeWidth:{default:2}},biigle.geo.ol.style.default=new ol.style.Style({image:new ol.style.Circle({radius:biigle.geo.ol.style.radius.default,fill:new ol.style.Fill({color:biigle.geo.ol.style.colors.blue}),stroke:new ol.style.Stroke({color:biigle.geo.ol.style.colors.white,width:biigle.geo.ol.style.strokeWidth.default})})}),biigle.geo.ol.style.selected=new ol.style.Style({image:new ol.style.Circle({radius:biigle.geo.ol.style.radius.default,fill:new ol.style.Fill({color:biigle.geo.ol.style.colors.orange}),stroke:new ol.style.Stroke({color:biigle.geo.ol.style.colors.white,width:biigle.geo.ol.style.strokeWidth.default})}),zIndex:1/0}));