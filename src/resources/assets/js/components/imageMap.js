/**
 * An element displaying the position of a single image on a map.
 *
 * @type {Object}
 */
biigle.geo.components.imageMap = {
    template: '<div class="image-map"></div>',
    props: {
        images: {
            type: Array,
            required: true
        },
        interactive: {
            type: Boolean,
            default: true
        },
        zoom: {
            type: Number
        },
        cluster: {
            type: Boolean,
            default: false
        }
    },
    mounted: function () {
        var features = [];

        for (var i = this.images.length - 1; i >= 0; i--) {
            features.push(new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([
                    this.images[i].lng,
                    this.images[i].lat
                ]))
            }));
        }

        var source = new ol.source.Vector({features: features});
        var extent = source.getExtent();

        if (this.cluster) {
            source = new ol.source.Cluster({
                source: source,
                distance: 5
            });
        }

        var tileLayer = new ol.layer.Tile({
          source: new ol.source.OSM()
        });

        var vectorLayer = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: [0, 153, 255, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            }),
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });

        var map = new ol.Map({
            target: this.$el,
            layers: [tileLayer, vectorLayer],
            view: new ol.View(),
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                doubleClickZoom: this.interactive,
                keyboard: this.interactive,
                mouseWheelZoom: this.interactive,
                shiftDragZoom: this.interactive,
                dragPan: this.interactive,
                pinchRotate: false,
                pinchZoom: this.interactive,
            }),
            controls: ol.control.defaults({
                zoom: this.interactive
            }),
        });

        map.getView().fit(extent, map.getSize());

        if (this.zoom) {
            map.getView().setZoom(this.zoom);
        }

        if (this.interactive) {
            map.addControl(new ol.control.ZoomToExtent({
                extent: extent,
                label: '\ue097',
                tipLabel: 'Reset Zoom'
            }));
            map.addControl(new ol.control.OverviewMap({
                collapsed: false,
                collapsible: false,
                layers: [tileLayer],
                view: new ol.View({
                    zoom: 1,
                    maxZoom: 1
                })
            }));
        }
    }
};
