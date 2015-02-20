import Ember from 'ember';
import WidgetCollection from 'ember-eureka/widget-collection';
import isEmpty from 'ember-eureka/utils/is-empty';

export default WidgetCollection.extend({

    model: Ember.computed.alias('routeModel'),
    db: Ember.computed.alias('modelStore.db'),

    // widget's configuration
    label: Ember.computed.alias('config.label'),
    queryTemplate: Ember.computed.alias('config.query'),
    relationModelType: Ember.computed.alias('config.modelType'),


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
        return db[relationModelType].find(query);
    }.property('query', 'queryOptions'),


    /** build the collection model from relations
     */
    relationsRouteModel: function() {
        var relationModelType = this.get('relationModelType');
        var relationModelMeta = this.get('db.'+relationModelType+'.modelMeta');
        var query = this.get('query');
        return Ember.Object.create({
            meta: relationModelMeta,
            query: query
        });
    }.property('relationModelType', 'db', 'query'),


    relationsWidgetConfig: function() {
        return Ember.Object.create({
            type: 'collection-display',
            label: this.get('label')
        });
    }.property('label'),

    /** build the query from the template and its options
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

        query = JSON.parse(query);

        // update the query with options
        Ember.setProperties(query, this.get('queryOptions'));

        return query;
    }.property('queryTemplate', 'model._id', 'queryOptions'),


    queryOptions: function() {
        var queryOptions = this.get('config.queryOptions');
        var results = {};
        if (queryOptions) {
            Ember.keys(queryOptions).forEach(function(option) {
                results['_'+option] = queryOptions[option];
            });
        }
        return results;
    }.property('config.queryOptions')

});