import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md2 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'

export default defineNuxtPlugin(app => {
  const vuetify = createVuetify({
    blueprint: md2,
    components: {
      ...components,
      ...labsComponents,
    },
  })
  app.vueApp.use(vuetify)
})
