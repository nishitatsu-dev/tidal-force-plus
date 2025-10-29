# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "echarts", to: "https://ga.jspm.io/npm:echarts@5.6.0/dist/echarts.esm.min.mjs"
pin_all_from "app/javascript/tidal_force_plus", under: "tidal_force_plus"
pin "paginator"
pin "calc_results_formatter"
pin "calc_results_page"
pin "dataset_builder"
