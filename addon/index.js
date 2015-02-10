import Ember from 'ember';
import CollectionWidget from 'ember-eureka/model-widget';
import isEmpty from 'ember-eureka/utils/is-empty';

export default CollectionWidget.extend({

    model: Ember.computed.alias('routeModel'),
    db: Ember.computed.alias('modelStore.db'),

    // widget's configuration
    label: Ember.computed.alias('config.label'),
    queryTemplate: Ember.computed.alias('config.query'),
    relationModelType: Ember.computed.alias('config.modelType'),
    limit: Ember.computed.alias('config.limit'),


    _checkRequiredParameters: function() {
        var relationModelType = this.get('relationModelType');
        var queryTemplate = this.get('queryTemplate');

        if (!relationModelType || !queryTemplate) {
            console.error('model-relations-list widget requires the modelType and the query');
        }
    }.on('init'),


    /** fetch the relations from the query
     */
    relations: function() {
        var db = this.get('db');
        var relationModelType = this.get('relationModelType');
        var query = this.get('query');
        var queryOptions = this.get('queryOptions');
        Ember.setProperties(query, queryOptions);
        console.log('>>>', query);
        return db[relationModelType].find(query);
    }.property('query'),


    /** build the query from the template
     *  passed in the widget's configuration (queryTemplate)
     */
    query: function() {
        var queryTemplate = this.get('queryTemplate');

        if (!queryTemplate || isEmpty(queryTemplate)) {
            return {};
        }

        var re = /\$\{([^}]*)\}/g;
        var model = this.get('model');
        var query = queryTemplate;
        var match = re.exec(queryTemplate);
        var placeholder, fieldName;

        while (match !== null) {
            placeholder = match[0];
            fieldName = match[1];
            query = query.replace(placeholder, model.get(fieldName));
            match = re.exec(queryTemplate);
        }

        return JSON.parse(query);
    }.property('queryTemplate', 'model._id'),


    queryOptions: function() {
        var options = Ember.Object.create();
        var limit = this.get('limit');
        if (limit !== undefined) {
            options.set('_limit', limit);
        }
        return options;
    }.property('limit'),
});