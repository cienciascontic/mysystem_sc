// ==========================================================================
// Project:   MySystem.PropertyEditorPane
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.Pane
*/
sc_require('core');

MySystem.PropertyEditorPane = SC.PalettePane.extend(
{
  acceptsFirstResponder: YES,
    layout: {
        top: 135,
        right: 5,
        width: 250,
        height: 240
    },
    classNames: 'propertyEditor'.w(),

    displayProperties: 'objectToEdit isSelected'.w(),
    objectToEdit: null,
    isSelected: false,

    childViews: ''.w(),

    propertiesForm: Forms.FormView.create({
      fields: "".w(),
      findField: function(key) {
        var rightField = null;
        this.fields.forEach( function (item, index, enumerable) {
          if (item.get('fieldKey') == key) {
            rightField = item;
          }
        });
        return rightField;
      }
    }),

    update_everything: function() {
      var form = this.get('propertiesForm');
      var baseObject = this.get('objectToEdit');
      if (baseObject === null) {
        // Clear fields
        if (form.parentView !== null) {
          form.set('fields', []);
          form.removeAllChildren();
        }
      } else {
        // Add the form if it doesn't exist
        if (form.parentView === null) {
          this.appendChild(form);
        }
        form.set('content', baseObject);
        // Clear fields before we start
        form.set('fields', []);
        form.removeAllChildren();
        // Append form rows
        // baseObject.get('formFields').forEach( function (item, index, enumerable) {
        //   form.set('fields', form.get('fields').concat(item));
        // });
				form.set('fields', baseObject.get('formFields'));
				if (baseObject.kindOf(MySystem.Link)) {
					var startNode = baseObject.get('startNode');
					if (!startNode.get('transformer')) {
						// TODO: Figure out a more elegant way to do this
						form.get('_displayFields').objectAt(0).get('_displayFields').objectAt(0).get('field').set('isEnabled', false);
					}
				}
      }
    }.observes('objectToEdit'),

    fieldChanged: function(target, key, value, revision) {// note value will always be null
      var field = target;
      var newValue = field.get('value');
      this.get('objectToEdit').set(key, newValue);
    },

    keyDown: function(evt) {
      return this.interpretKeyEvents(evt) ? YES : NO;
    },

    deleteBackward: function() {
      this.get('objectToEdit').destroy();
      return YES;
    },

    deleteForward: function() {
      this.get('objectToEdit').destroy();
      return YES;
    }
});
