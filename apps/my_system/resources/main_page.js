// ==========================================================================
// Project:   MySystem - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt SCUI */

sc_require('views/node');

// This page describes the main user interface for your application.  
MySystem.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
  childViews: 'topView'.w(),
    topView: SC.SplitView.design({
      defaultThickness: 120,
      topLeftView: SC.View.design({ // Node Palette (left)
        layout: { top: 0, bottom: 0, left: 15 },
        childViews: 'addDecorator addClay'.w(),

        addDecorator: SC.View.design({
          layout: { left: 20, right: 0, top: 0, height: 23, width: 80 },
          classNames: ['add-decorator']
        }),

        addClay: MySystem.AddButtonView.design({
          layout: { left: 20, right: 0, top: 23, width: 100, height: 120 },
          classNames: ['add-clay'],
          title: "Clay",
          icon: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png',
          target: MySystem.nodesController,
          action: 'addClay'
        })

        // addHand: MySystem.AddButtonView.design({
        //   layout: { left: 20, right: 0, top: 153, width: 100, height: 120 },
        //   classNames: ['add-hand'],
        //   icon: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
        //   title: "Hand",
        //   target: MySystem.nodesController,
        //   action: 'addHand'
        // }),
        // 
        // addBulb: MySystem.AddButtonView.design({
        //   layout: { left: 20, right: 0, top: 283, width: 100, height: 120 },
        //   classNames: ['add-bulb'],
        //   icon: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png',
        //   title: "Bulb",
        //   target: MySystem.nodesController,
        //   action: 'addBulb'
        // })
      }),
      dividerView: SC.SplitDividerView, // Divider for resizing right/left
      bottomRightView: SC.SplitView.design({ // Rest of app (right)
        defaultThickness: 120,
        layoutDirection: SC.LAYOUT_VERTICAL,
        topLeftView: SC.LabelView.design({ // Story section
          layout: { top: 0, right: 0, left: 0 },
          anchorLocation: SC.ANCHOR_TOP,
          textAlign: SC.ALIGN_LEFT,
          backgroundColor: '#CCCCFF',
          tagName: "div",
          escapeHTML: NO,
          valueBinding: 'MySystem.storyController.content.storyHtml',
          canCollapse: YES
        }),
        dividerView: SC.SplitDividerView, // Divider for resizing up/down
        bottomRightView: LinkIt.CanvasView.design( SCUI.Cleanup, { // Workspace
          layout: { top: 120, left: 0, right: 0, bottom: 0 },
          contentBinding: SC.Binding.from('MySystem.nodesController').oneWay(),
          selectionBinding: 'MySystem.nodesController.selection',
          exampleView: MySystem.NodeView
        })
      })
    })
  })

});
