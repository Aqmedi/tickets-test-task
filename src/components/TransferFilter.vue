<template>
    <div class="transfer-filter">
        <div class="transfer-filter__title">Количество пересадок</div>
        <div class="transfer-filter__item" v-for="(obj, name, index) in getFilters" :key="index">
            <div class="checkbox">
                <input class="checkbox__input"  type="checkbox" @change="onChange(obj.value, name)" :value="obj.value"  />
                <span class="checkbox__label">{{obj.label}}</span>
                <span class="checkbox__checkmark">
                    <IconChecked  :class="[obj.value ? 'checkbox__icon_active' : '', 'checkbox__icon']" />
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import { Options, Vue } from 'vue-class-component';
import IconChecked from '../assets/icons/IconChecked.vue'

@Options({
    el: '.transfer-filter',
    components: {
        IconChecked,
    },

    computed: {
        getFilters() {
            return this.$store.state.filters
        }
    },

    methods: {
        onChange(value, name) {
            const { filters } = this.$store.state
            let count = true

            Object.keys(filters).forEach(key => {
                if (name === 'all') {
                    filters[key]['value'] = !value
                    count = !value
                } else {
                    if (!filters[key]['value'] && key !== 'all') {
                        count = false
                    }

                    filters[name]['value'] = !value
                }
            })

            filters['all']['value'] = count 
            
            this.$store.dispatch("getSearchId", { filters })
        },
        isChecked(item) {
            const index = this.items.indexOf(item)
            return this.items[index].value
        }
    },
})

export default class TransferFilter extends Vue {}

</script>
