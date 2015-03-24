import Ember from 'ember';
import CollectionQuery from 'ember-eureka/collection-query';
import WidgetCollection from 'ember-eureka/widget-collection';

export default WidgetCollection.extend({

    model: Ember.computed.alias('routeModel'),
    db: Ember.computed.alias('store.db'),

    // widget's configuration
    label: Ember.computed.alias('config.label'),
    queryTemplate: Ember.computed.alias('config.query'),
    relationResource: Ember.computed.alias('config.resource'),

    _checkRequiredParameters: function() {
        var relationResource = this.get('relationResource');
        var queryTemplate = this.get('queryTemplate');

        if (!relationResource || !queryTemplate) {
            console.error('model-relations-list widget requires the resource and the query');
        }
    }.on('init'),


    /** fetch the relations from the query
     */
    // relations: function() {
    //     var db = this.get('db');
    //     var relationResource = this.get('relationResource');
    //     var query = this.get('query');
    //     return db[relationResource].find(query);
    // }.property('query', 'queryOptions'),


    /** build the collection model from relations
     */
    relationsRouteModel: function() {
        var relationResource = this.get('relationResource');
        var relationModelMeta = this.get('db.'+relationResource+'.modelMeta');
        var query = CollectionQuery.create();
        query.set('raw', this.get('query'));
        return Ember.Object.create({
            meta: relationModelMeta,
            query: query
        });
    }.property('relationResource', 'db', 'query'),


    // relationsWidgetConfig: function() {
        // var widgetType = this.get('config.widget.type') || 'collection-display';
        // var widgetConf = Ember.Object.create(this.get('config.widget'));
        // widgetConf.set('type', 'widget-'+widgetType);
        // return widgetConf;
    // }.property('config.widget.type'),

    /** build the query from the template and its options
     *  passed in the widget's configuration (queryTemplate)
     */
    query: function() {
        var queryTemplate = this.get('queryTemplate');

        if (!queryTemplate) {
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
        var queryOptions = this.getWithDefault('config.queryOptions', {});
        var results = {};
        if (queryOptions) {
            Ember.keys(queryOptions).forEach(function(option) {
                results['_'+option] = queryOptions[option];
            });
        }
        return results;
    }.property('config.queryOptions')

});