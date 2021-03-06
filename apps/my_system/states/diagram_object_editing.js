// ==========================================================================
// Project:   MySystem.DIAGRAM_OBJECT_EDITING
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem */

/** 

  A state to handle the editing of properties of specific diagram objects.

  At the current time, that only means links (node titles can be edited in place) because link colors
  need the property editor pane for color selection. 

  The state opens the property editor pane and sets it up, then tears it down and returns to the 
  DIAGRAM_EDITING state when the object being edited is no longer selected.

*/
MySystem.DIAGRAM_OBJECT_EDITING = SC.State.design({
  
  /**
    Set up the property pane attributes and attach it.
  */
  setUpInspectorPane: function () {
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    inspector.set('isOptionsForNewLink', NO);
    inspector.set('isModal', NO);
    // inspector.set('layout', { top: 150, right: 5, width: 270, height: 275 });
    if (!inspector.isPaneAttached) {
      inspector.append();
    }
  },
  
  /**
    Delete the object being edited.
  */
  deleteObject: function () {
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    // FIXME this currently doesn't delete antying
    return YES;
  },
  
  /**
    Re-set the property pane attributes and remove it from the page.
  */
  tearDownInspectorPane: function () {
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    if (inspector.isPaneAttached) {
      inspector.remove();
    }
  },

  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
    if (MySystem.nodesController.get('selectionIsInspectable')) {
      this.setUpInspectorPane();
    }
    else {
      this.tearDownInspectorPane();
      this.gotoState('DIAGRAM_EDITING');
    } 
  },

  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
    // Detatch property editor pane and clean it up
    this.tearDownInspectorPane();
  },
  
  /**
    Deal with diagram selection update events.
  */
  diagramSelectionChanged: function () {
    if (MySystem.nodesController.get('selectionIsInspectable')) {
      this.setUpInspectorPane();
    }
    else {
      this.tearDownInspectorPane();
      this.gotoState('DIAGRAM_EDITING');
    }
    return YES;
  },

  addNode: function(attr) {
    // if the user tries to drag a new node onto the canvas while in
    // this mode, switch to DIAGRAM_EDITING, and trigger its addNode
    this.gotoState('DIAGRAM_EDITING');
    MySystem.statechart.sendEvent('addNode', attr);
    return YES;
  }
});
