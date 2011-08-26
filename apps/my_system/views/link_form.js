// ==========================================================================
// Project:   MySystem.LinkFormView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

MySystem.LinkFormView = SC.FormView.extend({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  linkSelectionOnly: NO,
  contentBinding: SC.Binding.oneWay('MySystem.nodesController.selection').firstIfType(MySystem.Link),
  childViews: function() {
    var children = ["energy"];
    if (MySystem.activityController.get('enableLinkLabelEditing')) {
      children.push("label");
    }
    if (MySystem.activityController.get('enableLinkDescriptionEditing')) {
      children.push("description");
    }
    return children;
  }.property(),
  isVisible: NO,
  contentChanged: function() {
    var c = this.get('content');
    if (!!c && c.instanceOf(MySystem.Link)) {
      this.set('isVisible', YES);
    } else {
      this.set('isVisible', NO);
    }
  }.observes('*content.guid'),

  linkOnlyChanged: function() {
    var linkOnly = this.get('linkSelectionOnly');
    // label and description may still be 'designs', in which case setPath will fail.
    // That's ok, though. Just catch it and move on.
    try {
      this.setPath('label.isVisible', !linkOnly);
    } catch(e) { }
    try {
      this.setPath('description.isVisible', !linkOnly);
    } catch(e) { }
  }.observes('linkSelectionOnly'),

  label: SC.FormView.row("Label:", SC.TextFieldView.design({
    layout: {width: 150, height: 20, centerY: 0 },
    contentValueKey: 'text'
  })),

  energy: SC.FormView.row("Energy:", SC.RadioView.design({
    // apparently it is vitally important that width be speficied prior to height in the RadioView layout...
    layout: { width: 150, height: 100, centerY: 0},
    itemsBinding: SC.Binding.oneWay('MySystem.activityController.energyTypes'),
    contentValueKey: 'energyType',
    itemTitleKey: 'label',
    itemValueKey: 'uuid',
    itemIsEnabledKey: 'isEnabled',
    layoutDirection: SC.LAYOUT_VERTICAL,

    // override so we can inject the color information
    displayItems: function() {
      var ret = sc_super();
      for (var i = 0; i < ret.length; i++) {
        var item = this._findItemByValue(ret[i].get('value'));
        if (!!item) {
          ret[i].set('color', item.get('color'));
        }
      }
      return ret;
    }.property('isEnabled', 'value', 'items', 'itemTitleKey', 'itemWidthKey', 'itemValueKey', 'itemIsEnabledKey', 'localize', 'itemIconKey','itemAriaLabeledByKey', 'itemAriaLabelKey').cacheable(),

    _findItemByValue: function(val) {
      var key = this.get('itemValueKey');
      var items = this.get('items');
      for (var i = 0; i < items.length(); i++) {
        var item = items.objectAt(i);
        var iVal = item.get(key);
        if (iVal == val) {
          return item;
        }
      }
      return null;
    }
  })),

  description: SC.FormView.row("Description:", SC.TextFieldView.design({
    layout: {width: 150, height: 60, centerY: 0 },
    contentValueKey: 'description',
    isTextArea: YES
  }))

});
