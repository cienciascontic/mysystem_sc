// ==========================================================================
// Project:   MySystem.Node Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/node');

MySystem.Node.FIXTURES = [

  { guid: '1',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png',
    title: 'A Node',
		transformer: false, 
    inLinks: [],
    outLinks: ['link1', 'link2'],
    position: { x: 160, y: 160 }
  },
  
  { guid: '2',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
    title: 'B Node',
		transformer: false, 
    inLinks: ['link1'],
    outLinks: [],
    position: { x: 310, y: 10 }
  },
  
  { guid: '3',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png',
    title: 'Third Node',
		transformer: false, 
    inLinks: ['link2'],
    outLinks: [],
    position: { x: 10, y: 10 }
  }
];
