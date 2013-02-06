var API = require('API');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');
var View = require('View');

var Auphonic = require('Auphonic');

var getData = exports.getData = function(store) {
  var list = [];
  var object = Object.expand(Object.clone(store.get('outgoing_services', {})));
  Object.each(object.outgoing_services, function(service) {
    if (!service.checked) return;

    service = Object.clone(service);
    delete service.checked;
    list.push(service);
  });

  return {
    outgoing_services: list
  };
};

var updateCounter = function(store, object) {
  var container = object.toElement().getElement('.servicesCount');
  if (!container) return;

  var count = getData(store).outgoing_services.length;
  container.set('text', count ? count + ' selected' : '');
};

exports.getType = function() {
  return 'outgoing_services';
};

exports.setData = function(store, outgoing_services, baseURL, object, immediate) {
  var services = {};
  if (outgoing_services) outgoing_services.each(function(service) {
    services['outgoing_services.' + service.uuid + '.checked'] = true;
    Object.each(service, function(value, key) {
      services['outgoing_services.' + service.uuid + '.' + key] = service[key];
    });
  });

  store.set('outgoing_services', services);

  if (immediate) updateCounter(store, object);
};

exports.setup = function(store, outgoing_services, object) {
  object.addEvent('show', function() {
    updateCounter(store, object);
  });
};

var get = exports.get = function(callback) {
  API.call('services').on({
    success: function(response) {
      callback(response.data.filter(function(service) {
        return !!service.outgoing;
      }));
    }
  });
};

exports.createView = function(store) {
  View.getMain().showIndicator();

  get(function(services) {
    var types = API.getInfo('service_types');
    services.each(function(service) {
      var type = types[service.type];
      if (!type.parameters) return;

      Object.each(type.parameters, function(info, parameter) {
        info.key = parameter;
        info.uuid = service.uuid; // Handlebars sucks
        info[info.type] = true;

        if (info.type == 'select') info.options.each(function(option) {
          if (!option.value && !info.default_value) {
            option.selected = true;
            info.hasEmptyOption = true;
            if (!option.display_name) option.display_name = 'None';
            return;
          }

          if (option.value == info.default_value)
            option.selected = true;
        });
      });

      service.parameters = Object.values(type.parameters);
    });

    var hasServices = !!services.length;

    var action = hasServices ? {
      title: 'Done',
      className: 'done',
      back: true,
      onClick: function() {
        store.set('outgoing_services', View.getMain().getCurrentObject().serialize());
      }
    } : null;

    var object = new View.Object({
      title: 'Transfers',
      content: renderTemplate('form-service', {
        service: hasServices && services,
        url: Auphonic.ExternalServicesURL
      }),
      action: action,
      back: {
        title: 'Cancel'
      },

      onShow: function() {
        this.unserialize(store.get('outgoing_services'));
      }
    });

    var onChange = function() {
      var uuid = this.get('data-uuid');
      var container = object.toElement().getElement('[data-service-uuid="' + uuid + '"]');
      if (!container) return;

      container.removeEvents('transitionComplete:once');
      if (this.get('checked')) {
        container.removeClass('hidden');
        (function() {
          container.setStyle('height', container.retrieve('offsetHeight')).removeClass('out');
        }).delay(UI.getTransitionDelay());
      } else {
        container.setStyle('height', 0).addClass('out').addEvent('transitionComplete:once', function() {
          container.addClass('hidden');
        });
      }
    };

    object.addEvent('show:once', function() {
      var parent = object.toElement();
      var elements = parent.getElements('input[type=checkbox][data-uuid]');
      elements.addEvent('change', onChange);

      elements.each(function(element) {
        var uuid = element.get('data-uuid');
        var container = parent.getElement('[data-service-uuid="' + uuid + '"]');
        if (!container) return;

        container.addClass('immediate');
        (function() {
          container.store('offsetHeight', container.offsetHeight);
          if (element.get('checked')) {
            container.setStyle('height', container.offsetHeight);
            container.getElements('select').fireEvent('focus:once').fireEvent('change');
          } else {
            container.setStyle('height', 0).addClass('hidden').addClass('out');
          }
          (function() {
            container.removeClass('immediate');
          }).delay(1);
        }).delay(1);
      });
    });

    View.getMain().push(object);
  });
};
