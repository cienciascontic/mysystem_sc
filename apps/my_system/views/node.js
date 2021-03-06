// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/editable_label');
sc_require('views/terminal');
sc_require('views/remove_button');

/** @class

  Display class for displaying a Node. Expects its 'content' property to be a MySystem.Node record.

  @extends SC.RaphaelView
*/
MySystem.NodeView = RaphaelViews.RaphaelView.extend(SC.ContentDisplay,
/** @scope MySystem.NodeView.prototype */ {

  childViews: 'removeButtonView titleView terminalA terminalB'.w(),

  contentDisplayProperties: 'x y image title'.w(),
  displayProperties: 'bodyWidth bodyHeight bodyColor bodyOpacity borderColor borderOpacity borderWidth borderRadius imageWidth imageHeight enableNodeLabelDisplay'.w(),
    
  // PROPERTIES
  
  isSelected: NO,
  isDragging: NO,
  isHovered:  NO,
  
  verticalMargin: 0,
  horizontalMargin: 0,
  
  bodyWidthBinding:  SC.Binding.oneWay("MySystem.activityController.content.nodeWidth"),
  bodyHeightBinding: SC.Binding.oneWay("MySystem.activityController.content.nodeHeight"),
  terminalRadiusBinding: SC.Binding.oneWay("MySystem.activityController.content.terminalRadius"),
  enableNodeLabelDisplayBinding: SC.Binding.oneWay("MySystem.activityController.content.enableNodeLabelDisplay"),

  bodyColor:   '#000000',       // the node s/b visually transparent, but not transparent to mouse events, so it must have a fill
  bodyOpacity: 0,
  fontSize: 14,

  // for titleView
  titleBinding: '*content.title',
  xBinding:     '*content.x',
  yBinding:     '*content.y',
  
  centerX: function () {
    return this.get('x') + this.get('bodyWidth') / 2;
  }.property('x', 'bodyWidth').cacheable(),
  
  titleY: function () {
    return this.get('y') + this.get('bodyHeight') + this.get('fontSize') + this.get('terminalRadius');
  }.property('y', 'bodyHeight').cacheable(),
 
  terminalAY: function() {
    return this.get('y');     // could parameterize this better later
  }.property('y', 'bodyHeight').cacheable(),
  
  terminalBY: function() {
    return this.get('y') + this.get('bodyHeight');     // could parameterize this better later
  }.property('y', 'bodyHeight').cacheable(),

  borderColor: function () {
    return this.get('isSelected') ? 'rgb(173, 216, 230)' : '#CCCCCC';
  }.property('isSelected').cacheable(),
  
  borderOpacity: 1.0,
  
  borderWidth: function () {
    return this.get('isSelected') ? 4 : 1;
  }.property('isSelected'),
  
  borderRadius: 5,
  


  // place-holder for our rendered raphael image object
  // this is the nodes 'image'.
  _raphaelImage: null,

  // place-holder for our rendered raphael rectangle object
  // this is the nodes 'border' essentially.
  _raphaelRect: null,

  diagramControllerBinding: 'MySystem.nodesController',
  onlySelectedDiagramObjectBinding: '*diagramController.onlySelectedObject',
  
  isOnlySelectedDiagramObject: function () {
    return this.get('onlySelectedDiagramObject') === this.get('content');
  }.property('onlySelectedDiagramObject', 'content'),
  
  isRemoveButtonVisible: function () {
    return this.get('isHovered') || this.get('isOnlySelectedDiagramObject');
  }.property('isHovered', 'isOnlySelectedDiagramObject'),    
  
  // CHILD VIEWS
  
  removeButtonView: MySystem.RemoveButtonView.design({
    isVisibleBinding:          '.parentView.isRemoveButtonVisible',

    parentBorderColorBinding:  '.parentView.borderColor',
    parentXBinding:            '.parentView.x',
    parentBodyWidthBinding:    '.parentView.bodyWidth',    
    
    normalCircleStrokeBinding: '.parentBorderColor',
    hoveredCircleStroke:       '#666',
    normalCircleFill:          '#FFF',
    hoveredCircleFill:         '#666',
    normalXStrokeBinding:      '.parentBorderColor',
    hoveredXStroke:            '#FFF',
    
    cx: function () {
      return this.get('parentX') + this.get('parentBodyWidth');
    }.property('parentX', 'parentBodyWidth'),

    cyBinding: '.parentView.y'
  }),
  
  titleView: MySystem.EditableLabelView.design({
    isEditable:      NO,
    isVisibleBinding: '.parentView.enableNodeLabelDisplay',
    fontSizeBinding:  '.parentView.fontSize',
    textColor:        '#000',
    textBinding:      '.parentView.title',
    centerXBinding:   '.parentView.centerX',
    centerYBinding:   '.parentView.titleY',
    selectMe: function() {
      var currentNode = this.getPath('parentView.content');
      MySystem.nodesController.unselectAll();
      MySystem.nodesController.selectObject(currentNode);
    }.observes('isEditing')
  }),
 
  terminalA: MySystem.TerminalView.design({
    xBinding: '.parentView.centerX',
    yBinding: '.parentView.terminalAY',
    radiusBinding:     SC.Binding.oneWay(".parentView.terminalRadius"),  
    isVisible: YES
  }),
  
  terminalB: MySystem.TerminalView.design({
    xBinding: '.parentView.centerX',
    yBinding: '.parentView.terminalBY',
    radiusBinding:     SC.Binding.oneWay(".parentView.terminalRadius"),  
    isVisible: YES
  }),

  // RENDER METHODS
  renderCallback: function (raphaelCanvas, attrs,imageAttrs) {
    this._raphaelRect  = raphaelCanvas.rect();
    this._raphaelImage = raphaelCanvas.image();

    this._raphaelRect.attr(attrs);
    this._raphaelImage.attr(imageAttrs);

    return raphaelCanvas.set().push(this._raphaelRect,this._raphaelImage);
  },
  
  render: function (context, firstTime) {
    
    var content = this.get('content');
    var hMargin = this.get('horizontalMargin');
    var vMargin = this.get('verticalMargin');

    if (firstTime) {
      // when we first load this image, create a new Image object so we can inspect 
      // the actual width and height, and then scale the rendered image appropriately 
      // while keeping the aspect ratio
      var image = new Image();
      var self = this;
      image.onload = function() {
        self.setImageDimensions(image);
      };
      image.src = content.get('image');
      
    }
    
    var attrs = {
          'x':              content.get('x'),
          'y':              content.get('y'),
          'r':              this.get('borderRadius'),
          'width':          this.get('bodyWidth'),
          'height':         this.get('bodyHeight'),
          'fill':           this.get('bodyColor'),
          'fill-opacity':   this.get('bodyOpacity'),
          'stroke':         this.get('borderColor'),
          'stroke-width':   this.get('borderWidth'),
          'stroke-opacity': this.get('borderOpacity')
        },

        imageAttrs = {
          src:    content.get('image'),
          x:      hMargin + content.get('x'), // +((hMargin-this.get('imageWidth'))/2),  // center narrow images
          y:      content.get('y'),// vMargin + content.get('y'),
          width:  this.get('imageWidth') || 10,
          height: this.get('imageHeight')|| 10
        };

    if (firstTime) {
      context.callback(this, this.renderCallback, attrs, imageAttrs);
      this.renderChildViews(context,firstTime);
    }
    else {
      this._raphaelRect.attr(attrs);
      this._raphaelImage.attr(imageAttrs);
    }
  },
  
  setImageDimensions: function (image) {
    image.onload = null;
    if (image.width > 1){
      var bodyWidth    =  this.get('bodyWidth'),
          bodyHeight   =  this.get('bodyHeight'),
          targetWidth  =  bodyWidth  * 0.9,
          targetHeight =  bodyHeight * 0.9,
          srcWidth     =  image.width,
          srcHeight    =  image.height,
          scaledHeight = (targetHeight / srcHeight),
          scaledWidth  = (targetWidth  / srcWidth),
          scalar       = scaledWidth < scaledHeight ? scaledWidth : scaledHeight,
          newWidth     = srcWidth * scalar,
          newHeight    = srcHeight * scalar,
          hMargin      = (bodyWidth - newWidth) / 2,
          vMargin      = (bodyHeight - newHeight) / 2;

      SC.RunLoop.begin();
        this.set('imageWidth',  newWidth);
        this.set('imageHeight', newHeight);
        this.set('horizontalMargin',     hMargin);
        this.set('verticalMargin',     vMargin);
      SC.RunLoop.end();
    }
  },
  
  // EVENT METHODS GO HERE:
  
  mouseEntered: function () {
    this.set('isHovered', YES);
    return YES;
  },
  
  mouseExited: function () {
    this.set('isHovered', NO);
    return YES;
  },
  
  removeButtonClicked: function () {
    MySystem.statechart.sendAction('deleteDiagramObject', this, this.get('content'));
    return YES;
  }
  
});

MySystem.NodeView.mixin({
  DROP_OFFSET: {x: 21, y: 16}
});

