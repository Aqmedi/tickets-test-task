<template>
    <div v-if="getTicketsLoad">
        <div v-if="getTicketsFetched" class="tickets-list">
            <div  v-for="(ticket, index) in getTickets" :key="index" class="tickets-list__item">
                <div class="tickets-list__header">
                    <div class="tickets-list__price">{{getPrice(ticket.price)}} Р</div>
                    <div class="tickets-list__logo"><IconS7Logo /></div>
                </div>
                <div class="tickets-list__container" v-for="(segment, index) in ticket.segments" :key="index">
                    <div class="tickets-list__block" >
                        <div class="tickets-list__label">{{getDestination(segment)}}</div>
                        <div class="tickets-list__value">{{getSegmentDate(segment)}}</div>
                    </div>
                    <div class="tickets-list__block" >
                        <div class="tickets-list__label">В пути</div>
                        <div class="tickets-list__value">{{getDuration(segment.duration)}}</div>
                    </div>
                    <div class="tickets-list__block" >
                        <div class="tickets-list__label">{{getTransplantsLabel(segment.stops)}}</div>
                        <div class="tickets-list__value">{{getTransplants(segment.stops)}}</div>
                    </div>
                </div>
            </div>
            <button class="tickets-list__show" @click="handlerShow">Показать еще 5 билетов!</button>
        </div>
        <div v-else class="tickets-list__emty">Ошибка сервера, нажмите на кнопку чтобы получить результат
            <button @click="handlerReload">Перезагрузить</button>
        </div>
    </div>
    <div v-else class="tickets-list__loader"><Loader /></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import IconS7Logo from '../assets/icons/IconS7Logo.vue'
import Loader from './Loader.vue'

@Options({
    el: '.tickets-list',
    components: {
        IconS7Logo,
        Loader,
    },
    data() {
        return {
            part: 1,
            range: 5,
        }
    },
    computed: {
        getTicketsFetched() {
            return this.$store.state.ticketsFetched
        },

        getTicketsLoad() {
            return !this.$store.state.ticketsLoad
        },

        getTickets() {
            const { tickets, range, part } = this.$store.state
            return this.getArrRange(tickets, range , part)
        }
    },
    methods: {
         getArrRange (array: [], range: number, part: number) {
            var end = (range * part);
            return array.slice(0, end);
        },

        handlerShow() {
          this.$store.commit('setPart', this.$store.state.part + 1)
        },

        getPrice(price: string) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },
        getDestination (segment: { origin: any; destination: any; }) {
          return `${segment.origin} - ${segment.destination}`
        },
        getDuration(duration: number) {
            let num = duration;
            let hours = (num / 60);
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            return `${rhours}ч ${rminutes}м`;
        },
        getSegmentDate(segment: { date: Date; duration: number; }) {
            const { date, duration } = segment
            const newDate = new Date(date)
            const secondDate = new Date(date)
            secondDate.setMinutes(secondDate.getMinutes() + duration)

            return `${('0' + newDate.getHours()).slice(-2)}:${('0' + newDate.getMinutes()).slice(-2)} - ${('0' + secondDate.getHours()).slice(-2)}:${('0' + secondDate.getMinutes()).slice(-2)}`
        },
        getTransplantsLabel(stops: []) {
            if(stops.length === 0) {
                return 'Без пересадок'
            } else if(stops.length === 1) {
                return '1 пересадка'
            } else {
                return `${stops.length} пересадки`
            }
        },
        getTransplants(stops: []) {
            return stops.join()
        },

        handlerReload() {
             this.$store.dispatch("getSearchId", this.$store.state.active)
        }
    },
})
export default class TicketsList extends Vue {}
</script>
