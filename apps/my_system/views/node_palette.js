// ==========================================================================
// Project:   MySystem.NodePaletteView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('core');


MySystem.NodePaletteView = SC.View.extend({ // Node Palette (left)
  layout: { top: 0, bottom: 0, left: 15 },
  childViews: 'addDecorator addClay addHand addBulb'.w(),

  addDecorator: SC.View.design({
    layout: { left: 20, right: 0, top: 0, height: 23, width: 80 },
    classNames: ['add-decorator']
  }),

  addClay: MySystem.AddButtonView.design({
    layout: { left: 10, right: 10, top: 33, width: 100, height: 120 },
    classNames: ['add-clay'],
    title: "Clay",
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png'
  }),

  addHand: MySystem.AddButtonView.design({
    layout: { left: 10, right: 10, top: 163, width: 100, height: 120 },
    classNames: ['add-hand'],
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
    title: "Hand"
  }),

  addBulb: MySystem.AddButtonView.design({
    layout: { left: 10, right: 10, top: 293, width: 100, height: 120 },
    classNames: ['add-bulb'],
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png',
    title: "Bulb"
  })
});