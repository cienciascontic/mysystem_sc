// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/terminal');

/** @class

  Display class for displaying a Node. Expects its 'content' property to be a MySystem.Node record.

  @extends SC.View
*/
MySystem.NodeView = RaphaelViews.RaphaelView.extend(
/** @scope MySystem.NodeView.prototype */ {

  displayProperties: 'content.x content.y bodyColor borderColor borderOpacity bodyWidth bodyHeight borderWidth'.w(),


  // PROPERTIES
  
  
  isSelected: NO,
  isDragging: NO,
  
  bodyColor: '#CCCCCC',
  
  borderColor: function () {
    return this.get('isSelected') ? '#FFFF00' : '#AAAAAA';
  }.property('isSelected'),
  
  borderOpacity: 1.0,
  
  bodyWidth: 50,
  bodyHeight: 50,
  
  borderWidth: function () {
    return this.get('isSelected') ? 4 : 2;
  }.property('isSelected'),

  collectionView: function () {
    var ret = this.get('parentView');
    
    if (ret && ret.kindOf && ret.kindOf(SC.CollectionView)) {
      return ret;
    }
    else {
      ret = ret.get('parentView');
      if (ret && ret.kindOf && ret.kindOf(SC.CollectionView)) {
        return ret;
      }
      else {
        return null;
      }
    }
  }.property('parentView').cacheable(),
  
  
  // RENDER METHODS
  
  
  renderCallback: function (raphaelCanvas, attrs) {
    return raphaelCanvas.rect().attr(attrs);
  },
  
  render: function (context, firstTime) {
    var content = this.get('content'),

        attrs = {
          'x':              content.get('x'),
          'y':              content.get('y'),
          'r':              5,
          'width':          this.get('bodyWidth'),
          'height':         this.get('bodyHeight'),
          'fill':           this.get('bodyColor'),
          'stroke':         this.get('borderColor'),
          'stroke-width':   this.get('borderWidth'),
          'stroke-opacity': this.get('borderOpacity')
        },

        rect;
    
    if (firstTime) {
      context.callback(this, this.renderCallback, attrs);
    }
    else {
      rect = this.get('raphaelObject');
      rect.attr(attrs);
    }
  },
  
  
  // EVENT METHODS
  
  
  mouseDown: function (evt) {
    this.startDrag(evt);
    return YES;
  },
  
  mouseDragged: function (evt) {
    this.drag(evt);
    return YES;
  },
  
  mouseUp: function (evt) {
    this.endDrag(evt);
    return YES;
  },
  
  startDrag: function (evt) {
    // our layer doesn't respect SC.Cursor, so set the cursors manually
    this.get('parentView').$().css('cursor', 'move');
    
    this.set('isDragging', YES);
    this._dragX = evt.pageX;
    this._dragY = evt.pageY;
    this._mouseDownEvent = evt;
    this._didDragBody = NO;
  },
  
  drag: function (evt) {
    var content = this.get('content'),
        x = content.get('x') + evt.pageX - this._dragX,
        y = content.get('y') + evt.pageY - this._dragY;

    if ( !this.get('isDragging') ) return;
    
    // FIXME this code to limit to the borders of the parent container could be simplified with local vars, and by 
    // double-checking the geometry and arithmetic:
    if (x < this.get('borderWidth')) x = this.get('borderWidth');
    if (x + this.get('bodyWidth') > this.getPath('parentView.width') + this.getPath('parentView.borderWidth')) {
      x = this.getPath('parentView.width') + this.getPath('parentView.borderWidth') - this.get('bodyWidth');
    }
    
    if (y < this.get('borderWidth')) y = this.get('borderWidth');
    if (y + this.get('bodyHeight') > this.getPath('parentView.height') + this.getPath('parentView.borderWidth')) {
      y = this.getPath('parentView.height') + this.getPath('parentView.borderWidth') - this.get('bodyHeight');
    }
    
    content.set('x', x);
    content.set('y', y);

    this._dragX = evt.pageX;
    this._dragY = evt.pageY;
    this._didDragBody = YES;
  },  
  
  endDrag: function (evt) {
    var cv = this.get('collectionView');
    
    if (!this._didDragBody) {
      cv.mouseDown(this._mouseDownEvent);    
      cv.mouseUp(evt);
    }

    this.drag(evt);
    
    this.get('parentView').$().css('cursor', 'default');
    this.set('isDragging', NO); 
  }
  
});


// TODO: Remove the following when RaphaelViews conversion is complete. RPK 8-11-11


// LinkIt.NodeView,
// /** @scope MySystem.NodeView.prototype */ {
// 
//   layout: { top: 0, left: 0, width: 100, height: 120 },
//   classNames: 'node'.w(),
// 
//   displayProperties: 'content isSelected'.w(),
//   content: null,
//   isSelected: false,
// 
//   childViews: 'icon label aTerminal bTerminal'.w(), //  transformationIcon
// 
//   /** @private */
//   _runAction: function(evt) {
//     var action = this.get('action'),
//         target = this.get('target') || null;
// 
//     if (action) {
//       this.getPath('pane.rootResponder').sendAction(action, target, this, this.get('pane'));
//     }
//   },
// 
//   render: function (context) {
//     sc_super();
//     if (this.get('isSelected')) context.addClass('selected');
//   },  
// 
//   icon: SC.ImageView.design({
//     classNames: 'image',
//     useImageQueue: YES,
//     layout: { top: 20, width:50, height:70, centerX: 0},
//     valueBinding: '.parentView*content.image'
//   }),
// 
//   label: SC.LabelView.design({
//     layout: { bottom: 12, centerX: 0, width: 100, height: 25 },
//     classNames: ['name'],
//     textAlign: SC.ALIGN_CENTER,    
//     valueBinding: '.parentView*content.title',
//     isEditable: YES
//   }),
// 
//   aTerminal: MySystem.Terminal.design({
//     nodeBinding: '.parentView*content',
//     classNames: 'input terminal'.w(),
//     terminal: 'a'
//     // direction: LinkIt.INPUT_TERMINAL
//   }),
// 
//   bTerminal: MySystem.Terminal.design({
//     layout: { left: 45, bottom: +5, width: 10, height: 10 },
//     nodeBinding: '.parentView*content',
//     classNames: 'output terminal'.w(),
//     terminal: 'b'
//     // direction: LinkIt.OUTPUT_TERMINAL
//   }),
// 
//   /* Temporarily removed for Berkeley 0.1 release */
//   // transformationIcon: SC.ImageView.design({
//   //   classNames: 'image',
//   //   useImageQueue: YES,
//   //   layout: {left: 5, bottom: +5, width: 20, height:20 },
//   //   valueBinding: '.parentView*content.transformationIcon',
//   //   toolTipBinding: '.parentView*content.toolTip',
//   //   click: function(evt) {
//   //     if (this.get('toolTip')) { // If tooltip is null, there's nothing to do
//   //       MySystem.transformationsController.openTransformationBuilder(this.get('parentView').get('content'));
//   //     }
//   //     return YES;
//   //   }
//   // }),
// 
//   // ..........................................................
//   // LINKIT Specific for the view
//   // 
//   /**
//     Implements LinkIt.NodeView.terminalViewFor()
//   */
//   terminalViewFor: function (terminalKey) {
//     return this[terminalKey + 'Terminal'];
//   },
// 
//   /** 
//   * implement action behavior of see sproutcore/desktop/view/button
//   */
//   // doubleClick: function(evt, skipHoldRepeat) {
//   //     this._runAction(evt);
//   // }
// 
//   /**
//   * Stuff for DropTarget
//   */
//   dragStarted: function(drag, evt) {},
//   dragEntered: function(drag, evt) {},
//   dragUpdated: function(drag, evt) {},
//   dragExited: function(drag, evt) {},
//   dragEnded: function(drag, evt) {},
//   computeDragOperations: function(drag, evt, ops) {
//     if (drag.hasDataType('Boolean')) {
//       return SC.DRAG_LINK;
//     } else {
//       return SC.DRAG_NONE;
//     }
//   },
//   acceptDragOperation: function(drag, operation) { return true; },
//   performDragOperation: function(drag, operation) {
//     this.content.set('transformer', true);
//     return operation;
//   }
// });
