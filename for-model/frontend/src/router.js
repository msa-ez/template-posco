path: frontend/src
---

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


{{#boundedContexts}}
    {{#aggregates}}
        {{#if uiStyle.layout}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Manager from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}{{#layoutPascalCase uiStyle.layout}}{{/layoutPascalCase}}"
        {{else}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Manager from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}Cards"
        {{/if}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Detail from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}Detail"
    {{/aggregates}}

    {{#viewes}}
import {{namePascalCase}}View from "./components/{{namePascalCase}}View"
import {{namePascalCase}}ViewDetail from "./components/{{namePascalCase}}ViewDetail"
    {{/viewes}}
{{/boundedContexts}}

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
       {{#boundedContexts}}
        {{#aggregates}}
            {
                path: '/{{boundedContext.namePlural}}/{{namePlural}}',
                name: '{{boundedContext.namePascalCase}}{{namePascalCase}}Manager',
                component: {{boundedContext.namePascalCase}}{{namePascalCase}}Manager
            },
            {
                path: '/{{boundedContext.namePlural}}/{{namePlural}}/:id',
                name: '{{boundedContext.namePascalCase}}{{namePascalCase}}Detail',
                component: {{boundedContext.namePascalCase}}{{namePascalCase}}Detail
            },
        {{/aggregates}}

        {{#viewes}}
            {
                path: '/{{namePlural}}',
                name: '{{namePascalCase}}View',
                component: {{namePascalCase}}View
            },
            {
                path: '/{{namePlural}}/:id',
                name: '{{namePascalCase}}ViewDetail',
                component: {{namePascalCase}}ViewDetail
            },
        {{/viewes}}
       {{/boundedContexts}}


    ]
})

<function>
    window.$HandleBars.registerHelper('layoutPascalCase', function (layout) {
        let layoutPas = layout.toLowerCase();
        layoutPas = layoutPas.replace(/^[a-z]/, char => char.toUpperCase());
        try{
            if(layout=='CARD'){
                return layoutPas+'s'
            } else if(layout=='LIST-ITEM'){
                return 'List'
            } else if(layout=='GRID'){
                return 'Table'
            } else{
                return layoutPas
            }
        }catch(e){
            console.log(e);
        }
    })
</function>
