# Eureka-widget-model-relations-list

A widget to display a relation of Eureka's models. Usage:


    {
        BlogPost: {
            views: {
                model: {
                    widgets: [
                        {
                            type: 'model-relations-list',
                            label: "related comments",
                            modelType: 'Comment',               // the relation model type
                            query: '{"blogPost._id": "${_id}"}' // "${_id}" is the id of the model (from the route)
                            limit: 10                           // query option
                        }
                    ]
                }
            }
        }
    }



## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
