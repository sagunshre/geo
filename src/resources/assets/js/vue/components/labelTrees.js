/**
 * A component that displays a list of label trees.
 *
 * @type {Object}
 */
biigle.$component('geo.components.labelTrees', {
    template: '<div class="label-trees">' +
        '<label-tree :tree="tree" v-for="tree in trees" @select="handleSelect"></label-tree>' +
    '</div>',
    components: {
        labelTree: biigle.$require('geo.components.labelTree'),
    },
    props: {
        trees: {
            type: Array,
            required: true,
        }
    },
    methods: {
        handleSelect: function (label) {
            this.$emit('select', label);
        }
    }
});