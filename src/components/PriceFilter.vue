<template>
    <div class="price-filter">
        <div class="price-filter__container">
            <div class="price-filter__items">
                <div :class="[ item.buttonName === getActive ? 'price-filter__item_active' : '' ,'price-filter__item']" v-for="item in items" :key="item.label" @click="onClick(item)">
                    {{item.name}}
                </div>
            </div>
            <div :class="`price-filter__block price-filter__block_${getActive}`" />
        </div>
    </div>
</template>
<script>
import { Options, Vue } from 'vue-class-component';

@Options({
    el: '.price-filter',
    data: () => {
        return {
            items: [
                { name: 'Самый дешевый', buttonName: 'cheap' },
                { name: 'Самый быстрый', buttonName: 'fast' },
                { name: 'Оптимальный', buttonName: 'optimal' },
            ],
        }
    },

    computed: {
       getActive() {
           return this.$store.state.active
       }
    },
    methods: {
        onClick(item) {
            const { buttonName } = item
            if (this.$store.state.active !== buttonName) {
                this.$store.dispatch("getSearchId", {active: buttonName})
            }
        }
    },
})

export default class PriceFilter extends Vue {}

</script>
