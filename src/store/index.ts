import { createStore } from 'vuex'
import axios, { CancelTokenSource } from 'axios'

let request: CancelTokenSource | null = null

interface Segment {
  date: string,
  destination: string,
  duration: number,
  origin: string,
  stops: Array<string>,
}

interface Ticket {
  price: number,
  carrier: string,
  segments: Array<Segment>,
}

export default createStore({
  state: {
    tickets: Array<Ticket>(),
    ticketsLoad: false,
    ticketsFetched: false,
    active: 'cheap',
    filters: {
      all: { value: true, label: 'Все' },
      withoutTransfers: { value: true, label: 'Без пересадок' },
      oneChange: { value: true, label: '1 пересадка' },
      twoChange: { value: true, label: '2 пересадки' },
      threeChange: { value: true, label: '3 пересадки' },
    },
    part: 1,
    range: 5,
  },
  mutations: {
    setPart(state, value) {
      state.part = value
    },

    setActivePriceFilter (state, value) {
      state.active = value
    },    

    setFilters (state, value) {
      state.filters = value
    },

    setTickets(state, value) {
      state.tickets = [...state.tickets, ...value]
    },

    filterTickets(state, value) {
      const { active, filters } = state
      const { all, withoutTransfers, oneChange, twoChange, threeChange } = filters
      const result = [...state.tickets, ...value]
      switch (active) {
        case 'cheap':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'fast': 
          result.sort((a, b) => {
            let firstDuration = 0
            let secondDuration = 0

            a.segments.forEach((element: { duration: number }) => {
              firstDuration += element.duration
            });

            b.segments.forEach((element: { duration: number }) => {
              secondDuration += element.duration
            });

            return firstDuration - secondDuration
          })
          break;
        case 'optimal': 
          result.sort((a, b) => {
            let firstDuration = 0
            let secondDuration = 0

            a.segments.forEach((element: { duration: number }) => {
              firstDuration += element.duration
            });

            b.segments.forEach((element: { duration: number }) => {
              secondDuration += element.duration
            });

            if (a.price !== b.price) {
              return a.price - b.price
            } else { 
              return firstDuration - secondDuration
            }
          })
          break;
        default:
          break;
      }

      if (!all['value']) {
         const newList = result.filter(elem => {
          const validWithoutTransfers = withoutTransfers['value'] ? elem.segments[0].stops.length === 0 && elem.segments[1].stops.length === 0 : false
          const validOneChange = oneChange['value'] ? elem.segments[0].stops.length === 1 && elem.segments[1].stops.length === 1 : false
          const validTwoChange = twoChange['value'] ? elem.segments[0].stops.length === 2 && elem.segments[1].stops.length === 2 : false
          const validThreeChange = threeChange['value'] ? elem.segments[0].stops.length === 3 && elem.segments[1].stops.length === 3 : false
          
          return validWithoutTransfers || validOneChange || validTwoChange || validThreeChange
        })
        state.tickets = newList
      } else {
        state.tickets = result
      }

    },
    setTicketsFetched(state, value) { 
      state.ticketsFetched = value
    },
    setTicketsLoad(state, value) {
      state.ticketsLoad = value
    },
  },
  actions: {
    async getSearchId({ commit }, { active, filters }) {
      commit('setTicketsFetched', false)
      commit('setTicketsLoad', true)
      commit('setPart', 1)
      if(active) commit('setActivePriceFilter', active)
      if(filters) commit('setFilters', filters)
      try {
        const response = await axios.get('http://localhost:1234/search');
        this.dispatch('getTickets', response.data.searchId)
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getTickets({ commit }, searchId) {
      if (request) {
        request.cancel()
      }

      request = axios.CancelToken.source()
      try {
        const response = await axios.get(`http://localhost:1234/tickets?searchId=${searchId}`, {
          cancelToken: request.token
        })
        const { data, data: { stop } } = response
        if (!stop) {
          this.dispatch('getTickets', searchId)
          commit('setTickets', data.tickets)
        } else {
          commit('setTicketsFetched', true)
          commit('setTicketsLoad', false)
          commit('filterTickets', data.tickets)
        }

      } catch (error) {

        if (axios.isCancel(error)) {
          console.log('Previous request canceled, new request is send')
        } else {
          commit('setTicketsFetched', false)
          commit('setTicketsLoad', false)
        }
      }
    },
  },
})
