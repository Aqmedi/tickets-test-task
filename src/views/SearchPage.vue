<template>
    <div class="search-page">
        <TransferFilter />
        <div class="search-page__container">
            <PriceFilter />
            <TicketsList />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TransferFilter from '../components/TransferFilter.vue'
import PriceFilter from '../components/PriceFilter.vue'
import TicketsList from '../components/TicketsList.vue'

@Options({
    el: 'search-page',
    components: {
        TransferFilter,
        PriceFilter,
        TicketsList,
    },
    created() {
        this.$store.dispatch("getSearchId", this.$store.state.active)
    },

})
export default class SearchPage extends Vue {}
</script>
