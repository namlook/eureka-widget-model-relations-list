# Eureka-widget-model-relations-list

A widget to display a relation of Eureka's models. Usage:


    {
        BlogPost: {
            views: {
                model: {
                    widgets: [
                        {
                            type: 'model-relations-list',

                            // the relation model type
                            modelType: 'Comment',

                            // query on the "comment" resource
                            query: '{"blogPost._id": "${_id}"}', // "${_id}" is the id of the model (from the route)

                            // query option
                            queryOptions: {
                                limit: 10
                            },

                            // the header of the panel
                            header: "related comments"

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
