biigle.geo={},biigle.geo.events=new Vue,biigle.$viewModel("geo-image-location-panel",function(e){new Vue({el:e,data:{images:[biigle.geo.image]},components:{imageMap:biigle.geo.components.imageMap}})}),biigle.$viewModel("geo-map",function(e){new Vue({el:e,data:{images:biigle.geo.images,key:"biigle.geo.imageSequence."+biigle.geo.transect.id},computed:{selectedImages:function(){return JSON.parse(localStorage.getItem(this.key))||[]}},components:{imageMap:biigle.geo.components.imageMap,sidebar:biigle.geo.components.sidebar,sidebarButton:biigle.geo.components.sidebarButton,sidebarTab:biigle.geo.components.sidebarTab},methods:{handleSelectedImages:function(e){e.length>0?localStorage.setItem(this.key,JSON.stringify(e)):localStorage.removeItem(this.key)}}})}),biigle.$viewModel("geo-sidebar",function(e){new Vue({el:e,data:{labelTrees:biigle.geo.labelTrees},components:{sidebar:biigle.geo.components.sidebar,sidebarTab:biigle.geo.components.sidebarTab,labelTrees:biigle.geo.components.labelTrees},methods:{handleSidebarToggle:function(){setTimeout(function(){biigle.geo.events.$emit("sidebar.toggle")})}}})}),biigle.geo.components={},biigle.geo.components.labelTreeLabel={name:"label-tree-label",template:'<li class="label-tree-label cf" :class="classObject"><div class="label-tree-label__name" @click.stop="select"><span class="label-tree-label__color" :style="colorStyle" @click.stop="toggleOpen"></span><span v-text="label.name"></span><span v-if="showFavourite" class="label-tree-label__favourite" @click.stop="toggleFavourite"><span class="glyphicon" :class="favouriteClass" aria-hidden="true" title=""></span></span></div><ul v-if="label.open" class="label-tree__list"><label-tree-label :label="label" v-for="label in label.children" @select="emitSelect"></label-tree-label></ul></li>',data:function(){return{favourite:!1}},props:{label:{type:Object,required:!0},showFavourite:{type:Boolean,required:!1}},computed:{classObject:function(){return{"label-tree-label--selected":this.label.selected,"label-tree-label--expandable":this.label.children}},colorStyle:function(){return{"background-color":"#"+this.label.color}},favouriteClass:function(){return{"glyphicon-star-empty":!this.favourite,"glyphicon-star":this.favourite}}},methods:{select:function(){this.label.selected?this.label.open=!this.label.open:(this.$emit("select",this.label),this.label.open=!0)},toggleOpen:function(){this.label.open=!this.label.open},toggleFavourite:function(){this.favourite=!this.favourite},emitSelect:function(e){this.$emit("select",e)}}},biigle.geo.components.sidebarButton={template:'<button class="sidebar__button btn btn-default btn-lg" :class="classObject" @click="toggle" :title="tab.title"><span v-if="open" class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span v-else class="glyphicon" :class="iconClass" aria-hidden="true"></span></button>',data:function(){return{open:!1}},props:{tab:{type:Object,required:!0}},computed:{iconClass:function(){return"glyphicon-"+this.tab.icon},classObject:function(){return{active:this.open}}},methods:{toggle:function(){this.open?this.$parent.$emit("close"):this.$parent.$emit("open",this.tab.name)}},mounted:function(){var e=this;this.$parent.$on("open",function(t){e.open=t===e.tab.name}),this.$parent.$on("close",function(){e.open=!1})}},biigle.geo.components.labelTree={template:'<div class="label-tree"><h4 class="label-tree__title" :if="showTitle" v-text="tree.name"></h4><ul class="label-tree__list"><label-tree-label :label="label" v-for="label in rootLabels" @select="emitSelect"></label-tree-label></ul></div>',components:{labelTreeLabel:biigle.geo.components.labelTreeLabel},props:{tree:{type:Object,required:!0},showTitle:{type:Boolean,default:!0},standalone:{type:Boolean,default:!1}},computed:{labels:function(){return this.tree.labels},compiledLabels:function(){for(var e,t={},l=this.labels.length-1;l>=0;l--)e=this.labels[l].parent_id,t.hasOwnProperty(e)?t[e].push(this.labels[l]):t[e]=[this.labels[l]];return t},rootLabels:function(){return this.compiledLabels[null]}},methods:{emitSelect:function(e){this.$emit("select",e)},selectLabel:function(e){for(var t=this.labels.length-1;t>=0;t--)this.labels[t].selected=this.labels[t].id===e.id}},created:function(){var e=this.compiledLabels;for(i=this.labels.length-1;i>=0;i--)e.hasOwnProperty(this.labels[i].id)&&Vue.set(this.labels[i],"children",e[this.labels[i].id]),Vue.set(this.labels[i],"open",!1),Vue.set(this.labels[i],"selected",!1);this.standalone?this.$on("select",this.selectLabel):this.$parent.$on("select",this.selectLabel)}},biigle.geo.components.sidebar={template:'<aside class="sidebar" :class="classObject"><div class="sidebar__buttons"><sidebar-button v-for="tab in tabs" :tab="tab"></sidebar-button></div><div class="sidebar__tabs"><slot name="tabs"></slot></div></aside>',components:{sidebarButton:biigle.geo.components.sidebarButton},data:function(){return{open:!1}},props:{openTab:{type:String}},computed:{classObject:function(){return{"sidebar--open":this.open}},tabs:function(){for(var e=[],t=this.$slots.tabs.length-1;t>=0;t--)e.unshift(this.$slots.tabs[t].componentOptions.propsData);return e}},created:function(){this.$on("open",function(){this.open=!0,this.$emit("toggle")}),this.$on("close",function(){this.open=!1,this.$emit("toggle")})},mounted:function(){this.openTab&&this.$emit("open",this.openTab)}},biigle.geo.components.labelTrees={template:'<div class="label-trees"><label-tree :tree="tree" v-for="tree in trees" @select="handleSelect"></label-tree></div>',components:{labelTree:biigle.geo.components.labelTree},props:{trees:{type:Array,required:!0}},methods:{handleSelect:function(e){this.$emit("select",e)}}},biigle.geo.components.imageMap={template:'<div class="image-map"></div>',props:{images:{type:Array,required:!0},preselected:{type:Array,default:function(){return[]}},interactive:{type:Boolean,default:!0},zoom:{type:Number},selectable:{type:Boolean,default:!1}},methods:{parseSelectedFeatures:function(e){return e.getArray().map(function(e){return e.get("id")})}},mounted:function(){for(var e=[],t=this,l=this.images.length-1;l>=0;l--)e.push(new ol.Feature({id:this.images[l].id,preselected:this.preselected.indexOf(this.images[l].id)!==-1,geometry:new ol.geom.Point(ol.proj.fromLonLat([this.images[l].lng,this.images[l].lat]))}));var i=new ol.source.Vector({features:e}),o=i.getExtent(),s=new ol.layer.Tile({source:new ol.source.OSM}),a=new ol.layer.Vector({source:i,style:biigle.geo.ol.style.default,updateWhileAnimating:!0,updateWhileInteracting:!0}),n=new ol.Map({target:this.$el,layers:[s,a],view:new ol.View,interactions:ol.interaction.defaults({altShiftDragRotate:!1,doubleClickZoom:this.interactive,keyboard:this.interactive,mouseWheelZoom:this.interactive,shiftDragZoom:!1,dragPan:this.interactive,pinchRotate:!1,pinchZoom:this.interactive}),controls:ol.control.defaults({zoom:this.interactive})});if(n.getView().fit(o,n.getSize()),this.zoom&&n.getView().setZoom(this.zoom),this.interactive&&(n.addControl(new ol.control.ScaleLine),n.addControl(new ol.control.ZoomToExtent({extent:o,label:""})),n.addControl(new ol.control.OverviewMap({collapsed:!1,collapsible:!1,layers:[s],view:new ol.View({zoom:1,maxZoom:1})}))),this.selectable){var r=new ol.interaction.Select({style:biigle.geo.ol.style.selected,features:e.filter(function(e){return e.get("preselected")})}),c=r.getFeatures();n.addInteraction(r),r.on("select",function(e){t.$emit("select",t.parseSelectedFeatures(c))});var b=new ol.interaction.DragBox({condition:ol.events.condition.platformModifierKeyOnly});n.addInteraction(b),b.on("boxend",function(){c.clear(),i.forEachFeatureIntersectingExtent(b.getGeometry().getExtent(),function(e){c.push(e)}),t.$emit("select",t.parseSelectedFeatures(c))})}biigle.geo.events.$on("sidebar.toggle",function(){n.updateSize()})}},biigle.geo.components.sidebarTab={template:'<div class="sidebar__tab" :class="classObject"><slot></slot></div>',data:function(){return{open:!1}},props:{name:{type:String,required:!0},icon:{type:String,required:!0},title:{type:String}},computed:{classObject:function(){return{"sidebar__tab--open":this.open}}},created:function(){var e=this;this.$parent.$on("open",function(t){e.open=t===e.name}),this.$parent.$on("close",function(){e.open=!1})}},biigle.geo.ol={},ol&&(biigle.geo.ol.style={colors:{blue:"#0099ff",white:"#ffffff",orange:"#ff5e00"},radius:{default:6},strokeWidth:{default:2}},biigle.geo.ol.style.default=new ol.style.Style({image:new ol.style.Circle({radius:biigle.geo.ol.style.radius.default,fill:new ol.style.Fill({color:biigle.geo.ol.style.colors.blue}),stroke:new ol.style.Stroke({color:biigle.geo.ol.style.colors.white,width:biigle.geo.ol.style.strokeWidth.default})})}),biigle.geo.ol.style.selected=new ol.style.Style({image:new ol.style.Circle({radius:biigle.geo.ol.style.radius.default,fill:new ol.style.Fill({color:biigle.geo.ol.style.colors.orange}),stroke:new ol.style.Stroke({color:biigle.geo.ol.style.colors.white,width:biigle.geo.ol.style.strokeWidth.default})}),zIndex:1/0}));