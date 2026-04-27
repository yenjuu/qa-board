import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Host from './views/Host.vue'
import Participant from './views/Participant.vue'
import ParticipantJoin from './views/ParticipantJoin.vue'
import Question from './views/Question.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/host/:roomId', name: 'Host', component: Host, props: true },
  { path: '/room/:roomId', name: 'Participant', component: Participant, props: true },
  { path: '/join/:roomId', name: 'Join', component: ParticipantJoin, props: true },
  { path: '/questions', name: 'Questions', component: Question }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
