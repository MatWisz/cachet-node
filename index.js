/*jshint -W069 */
/**
 * A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
 * @class Cachet
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var Cachet = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function Cachet(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.apiKey = (typeof options === 'object') ? (options.apiKey ? options.apiKey : {}) : {};
        this.basic = (typeof options === 'object') ? (options.basic ? options.basic : {}) : {};
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name Cachet#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    Cachet.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
        var req = {
            method: method,
            uri: url,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {}
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });
    };

    /**
     * Set Api Key
     * @method
     * @name Cachet#setApiKey
     * @param {string} value - apiKey's value
     * @param {string} headerOrQueryName - the header or query name to send the apiKey at
     * @param {boolean} isQuery - true if send the apiKey as query param, otherwise, send as header param
     */
    Cachet.prototype.setApiKey = function(value, headerOrQueryName, isQuery) {
        this.apiKey.value = value;
        this.apiKey.headerOrQueryName = headerOrQueryName;
        this.apiKey.isQuery = isQuery;
    };
    /**
     * Set Basic Auth
     * @method
     * @name Cachet#setBasicAuth
     * @param {string} username
     * @param {string} password
     */
    Cachet.prototype.setBasicAuth = function(username, password) {
        this.basic.username = username;
        this.basic.password = password;
    };
    /**
     * Set Auth headers
     * @method
     * @name Cachet#setAuthHeaders
     * @param {object} headerParams - headers object
     */
    Cachet.prototype.setAuthHeaders = function(headerParams) {
        var headers = headerParams ? headerParams : {};
        if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
            headers[this.apiKey.headerOrQueryName] = this.apiKey.value;
        }
        if (this.basic.username && this.basic.password) {
            headers['Authorization'] = 'Basic ' + new Buffer(this.basic.username + ':' + this.basic.password).toString("base64");
        }
        return headers;
    };

    /**
     * Test that the API is responding to your requests.
     * @method
     * @name Cachet#ping
     * @param {object} parameters - method options and parameters
     */
    Cachet.prototype.ping = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/ping';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get the Cachet version.
     * @method
     * @name Cachet#version
     * @param {object} parameters - method options and parameters
     */
    Cachet.prototype.version = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/version';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get all components.
     * @method
     * @name Cachet#getComponents
     * @param {object} parameters - method options and parameters
     * @param {string} parameters.sort - Object property to filter on.
     * @param {string} parameters.order - Ordering parameter with options of asc or desc.
     * @param {number} parameters.perPage - Results per page.
     * @param {number} parameters.page - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     * @param {number} parameters.id - Unique identifier representing a specific component.
     * @param {string} parameters.name - Full name or partial name to search for a component.
     * @param {number} parameters.status - Unique status identifier representing a specific component status.
     * @param {number} parameters.groupId - Unique group identifier representing a specific component group.
     * @param {boolean} parameters.enabled - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     */
    Cachet.prototype.getComponents = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        /** set default value **/
        queryParameters['sort'] = id;

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        /** set default value **/
        queryParameters['order'] = asc;

        if (parameters['order'] !== undefined) {
            queryParameters['order'] = parameters['order'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['id'] !== undefined) {
            queryParameters['id'] = parameters['id'];
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['status'] !== undefined) {
            queryParameters['status'] = parameters['status'];
        }

        if (parameters['groupId'] !== undefined) {
            queryParameters['group_id'] = parameters['groupId'];
        }

        if (parameters['enabled'] !== undefined) {
            queryParameters['enabled'] = parameters['enabled'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create a new component.
     * @method
     * @name Cachet#createComponent
     * @param {object} parameters - method options and parameters
     * @param {} parameters.body - Component to be created.
     */
    Cachet.prototype.createComponent = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get a component.
     * @method
     * @name Cachet#getComponentById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.component - Unique component identifier.
     */
    Cachet.prototype.getComponentById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/{component}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{component}', parameters['component']);

        if (parameters['component'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: component'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Update a compoonent.
     * @method
     * @name Cachet#updateComponentById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.component - Unique component identifier.
     * @param {} parameters.body - Component data to be updated
     */
    Cachet.prototype.updateComponentById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/{component}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{component}', parameters['component']);

        if (parameters['component'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: component'));
            return deferred.promise;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete a component.
     * @method
     * @name Cachet#deleteComponentById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.component - Unique component identifier.
     */
    Cachet.prototype.deleteComponentById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/{component}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{component}', parameters['component']);

        if (parameters['component'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: component'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get all Component Groups.
     * @method
     * @name Cachet#getComponentGroups
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.id - Unique component group id
     * @param {string} parameters.name - Full or partial component group name
     * @param {number} parameters.collapsed - Group collapsed or not.
     * @param {string} parameters.sort - Object property to filter on.
     * @param {string} parameters.order - Ordering parameter with options of asc or desc.
     * @param {number} parameters.perPage - Results per page.
     * @param {number} parameters.page - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     */
    Cachet.prototype.getComponentGroups = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/groups';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        if (parameters['id'] !== undefined) {
            queryParameters['id'] = parameters['id'];
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['collapsed'] !== undefined) {
            queryParameters['collapsed'] = parameters['collapsed'];
        }

        /** set default value **/
        queryParameters['sort'] = id;

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        /** set default value **/
        queryParameters['order'] = asc;

        if (parameters['order'] !== undefined) {
            queryParameters['order'] = parameters['order'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create a new Component Group.
     * @method
     * @name Cachet#createComponentGroup
     * @param {object} parameters - method options and parameters
     * @param {} parameters.body - Component Group to be created.
     */
    Cachet.prototype.createComponentGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/groups';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get a Component Group.
     * @method
     * @name Cachet#getComponentGroupById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.group - Unique component group id
     */
    Cachet.prototype.getComponentGroupById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/groups/{group}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{group}', parameters['group']);

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Update a Component Group.
     * @method
     * @name Cachet#updateComponentGroupById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.group - Unique component group id
     * @param {} parameters.body - Component Group data to be updated
     */
    Cachet.prototype.updateComponentGroupById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/groups/{group}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{group}', parameters['group']);

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete a Component Group.
     * @method
     * @name Cachet#deleteComponentGroupById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.group - Unique component group id
     */
    Cachet.prototype.deleteComponentGroupById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/components/groups/{group}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{group}', parameters['group']);

        if (parameters['group'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: group'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get all incidents.
     * @method
     * @name Cachet#getIncidents
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.id - Unique incident id
     * @param {number} parameters.componentId - Unique component group id
     * @param {string} parameters.name - Full or partial component group name
     * @param {number} parameters.status - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     * @param {number} parameters.visible - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     * @param {string} parameters.sort - Object property to filter on.
     * @param {string} parameters.order - Ordering parameter with options of asc or desc.
     * @param {number} parameters.perPage - Results per page.
     * @param {number} parameters.page - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     */
    Cachet.prototype.getIncidents = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        if (parameters['id'] !== undefined) {
            queryParameters['id'] = parameters['id'];
        }

        if (parameters['componentId'] !== undefined) {
            queryParameters['component_id'] = parameters['componentId'];
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['status'] !== undefined) {
            queryParameters['status'] = parameters['status'];
        }

        if (parameters['visible'] !== undefined) {
            queryParameters['visible'] = parameters['visible'];
        }

        /** set default value **/
        queryParameters['sort'] = id;

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        /** set default value **/
        queryParameters['order'] = asc;

        if (parameters['order'] !== undefined) {
            queryParameters['order'] = parameters['order'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create a new incident.
     * @method
     * @name Cachet#createIncident
     * @param {object} parameters - method options and parameters
     * @param {} parameters.body - Incident to be created
     */
    Cachet.prototype.createIncident = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get an incident
     * @method
     * @name Cachet#getIncidentById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     */
    Cachet.prototype.getIncidentById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Update an incident
     * @method
     * @name Cachet#updateIncidentById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     * @param {} parameters.body - Incident data to be updated
     */
    Cachet.prototype.updateIncidentById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete an incident
     * @method
     * @name Cachet#deleteIncidentById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     */
    Cachet.prototype.deleteIncidentById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get incident updates
     * @method
     * @name Cachet#getIncidentUpdatesById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     * @param {string} parameters.sort - Object property to filter on.
     * @param {string} parameters.order - Ordering parameter with options of asc or desc.
     * @param {number} parameters.perPage - Results per page.
     * @param {number} parameters.page - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     */
    Cachet.prototype.getIncidentUpdatesById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}/updates';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        /** set default value **/
        queryParameters['sort'] = id;

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        /** set default value **/
        queryParameters['order'] = asc;

        if (parameters['order'] !== undefined) {
            queryParameters['order'] = parameters['order'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create an Incident Update
     * @method
     * @name Cachet#createIncidentUpdate
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     * @param {} parameters.body - Incident update to create
     */
    Cachet.prototype.createIncidentUpdate = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}/updates';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get an incident update
     * @method
     * @name Cachet#getIncidentUpdateById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     * @param {number} parameters.update - Unique incident update id
     */
    Cachet.prototype.getIncidentUpdateById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}/updates/{update}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        path = path.replace('{update}', parameters['update']);

        if (parameters['update'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: update'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Update an incident update
     * @method
     * @name Cachet#putIncidentUpdateById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     * @param {number} parameters.update - Unique incident update id
     * @param {number} parameters.status - The incident status flag
     * @param {string} parameters.message - The update message
     */
    Cachet.prototype.putIncidentUpdateById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}/updates/{update}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        path = path.replace('{update}', parameters['update']);

        if (parameters['update'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: update'));
            return deferred.promise;
        }

        if (parameters['status'] !== undefined) {
            queryParameters['status'] = parameters['status'];
        }

        if (parameters['message'] !== undefined) {
            queryParameters['message'] = parameters['message'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete an incident update
     * @method
     * @name Cachet#deleteIncidentUpdateById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.incident - Unique incident id
     * @param {number} parameters.update - Unique incident update id
     */
    Cachet.prototype.deleteIncidentUpdateById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/incidents/{incident}/updates/{update}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{incident}', parameters['incident']);

        if (parameters['incident'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incident'));
            return deferred.promise;
        }

        path = path.replace('{update}', parameters['update']);

        if (parameters['update'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: update'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get all metrics
     * @method
     * @name Cachet#getMetrics
     * @param {object} parameters - method options and parameters
     * @param {string} parameters.sort - Object property to filter on.
     * @param {string} parameters.order - Ordering parameter with options of asc or desc.
     * @param {number} parameters.perPage - Results per page.
     * @param {number} parameters.page - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     */
    Cachet.prototype.getMetrics = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        /** set default value **/
        queryParameters['sort'] = id;

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        /** set default value **/
        queryParameters['order'] = asc;

        if (parameters['order'] !== undefined) {
            queryParameters['order'] = parameters['order'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create a metric
     * @method
     * @name Cachet#createMetric
     * @param {object} parameters - method options and parameters
     * @param {} parameters.body - Create metric data
     */
    Cachet.prototype.createMetric = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get a metric
     * @method
     * @name Cachet#getMetricById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.metric - Unique metric id
     */
    Cachet.prototype.getMetricById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics/{metric}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{metric}', parameters['metric']);

        if (parameters['metric'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metric'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete a metric
     * @method
     * @name Cachet#deleteMetricById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.metric - Unique metric id
     */
    Cachet.prototype.deleteMetricById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics/{metric}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{metric}', parameters['metric']);

        if (parameters['metric'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metric'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get points for a metric
     * @method
     * @name Cachet#getMetricPointsById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.metric - Unique metric id
     * @param {string} parameters.sort - Object property to filter on.
     * @param {string} parameters.order - Ordering parameter with options of asc or desc.
     * @param {number} parameters.perPage - Results per page.
     * @param {number} parameters.page - A swagger documentation file based on the documentation for the Cachet Status Page https://cachethq.io/
     */
    Cachet.prototype.getMetricPointsById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics/{metric}/points';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{metric}', parameters['metric']);

        if (parameters['metric'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metric'));
            return deferred.promise;
        }

        /** set default value **/
        queryParameters['sort'] = id;

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        /** set default value **/
        queryParameters['order'] = asc;

        if (parameters['order'] !== undefined) {
            queryParameters['order'] = parameters['order'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create point for a metric
     * @method
     * @name Cachet#createMetricPointById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.metric - Unique metric id
     * @param {} parameters.body - Metric data
     */
    Cachet.prototype.createMetricPointById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics/{metric}/points';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{metric}', parameters['metric']);

        if (parameters['metric'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metric'));
            return deferred.promise;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete a metric point
     * @method
     * @name Cachet#deleteMetricPointById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.metric - Unique metric id
     * @param {number} parameters.point - Unique metric point id
     */
    Cachet.prototype.deleteMetricPointById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/metrics/{metric}/points/{point}';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];

        path = path.replace('{metric}', parameters['metric']);

        if (parameters['metric'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metric'));
            return deferred.promise;
        }

        path = path.replace('{point}', parameters['point']);

        if (parameters['point'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: point'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return Cachet;
})();

exports.Cachet = Cachet;