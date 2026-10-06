import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import './bootstrap'
import './index.css'
import './App.css'

const pages = import.meta.glob('./Pages/**/*.jsx')

createInertiaApp({
  resolve: async name => {
    const importPage = pages[`./Pages/${name}.jsx`]
    if (!importPage) {
      throw new Error(`Página Inertia não encontrada: ${name}`)
    }

    const page = await importPage()
    return page.default
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
