// ==========================================================================
// Project:   MySystem.storySentencesController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
MySystem.storySentenceController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope MySystem.storySentencesController.prototype */ {

  allowsMultipleSelection: NO,

  collectionViewDeleteContent: function(view, content, indexes) {
    // Destroy the records
    var records = indexes.map(function(idx) {
      return this.objectAt(idx);
    }, this);
    records.invoke('destroy');

    var selIndex = indexes.get('min')-1;
    if (selIndex<0) selIndex = 0;
    this.selectObject(this.objectAt(selIndex));

    return YES ;
  },

  collectionViewPerformDragOperation: function(view, drag, op, proposedInsertionIndex, proposedDropOperation) {
    var movingSentence = drag.get('source').get('selection').firstObject();
    movingSentence.set('order', proposedInsertionIndex);
    this.incrementOrderValues(proposedInsertionIndex);
    return SC.DRAG_REORDER ;
  },

  addStorySentence: function() {
    var sentence;
    sentence = this.addStorySentenceNoEdit();

    // Select the sentence in the UI
    this.selectObject(sentence);

    // Activate the editor once the UI repaints
    this.invokeLater(function() {
      var contentIndex = this.indexOf(sentence);
      var list = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView.contentView');
      var listItem = list.itemViewForContentIndex(contentIndex);
      listItem.get('sentenceText').beginEditing();
    });

    return sentence ;
  },

  addStorySentenceNoEdit: function() {
    var sentence;

    this.incrementOrderValues(0);

    // Create a new sentence in the store
    sentence = MySystem.store.createRecord(MySystem.StorySentence, {
      "guid": MySystem.StorySentence.newGuid(),
      "order": 0,
      "bodyText": "Describe a new step in the story."
    });

    return sentence ;
  },

  addLinksAndNodesToSentence: function (linksAndNodes, sentence) {
    linksAndNodes.forEach( function (item, index, enumerable) {
      if (item.instanceOf(MySystem.Link)) {
        sentence.get('links').pushObject(item);
      } else if (item.instanceOf(MySystem.Node)) {
        sentence.get('nodes').pushObject(item);
      } else {
        SC.Logger.log('Bad item type ' + item);
      }
    });
  },

  // Open the SentenceConnectPane
  addDiagramConnectPane: function (sentence) {
    // FIXME: This should be a state change...
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    var theCanvas = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.bottomRightView');
    var sentenceLinks = sentence.get('links');
    var allLinks = MySystem.store.find(MySystem.Link);
    // Un-dim all links
    allLinks.forEach( function (link) {
      link.unDimColor();
    });
    
    // Clear selections
    MySystem.nodesController.unselectAll();
    theCanvas.selectObjects([]);
    if (!diagramPane.isPaneAttached) {
      diagramPane.append();
      diagramPane.becomeFirstResponder();
    }
    
    theCanvas.selectObjects(sentenceLinks, true);
    theCanvas.get('classNames').push('sentence-linking');
    // Dim links
    allLinks.forEach( function (link) {
      if (sentenceLinks.indexOf(link) < 0) link.dimColor();
    });
    MySystem.nodesController.selectObjects(sentence.get('nodes'), true);
    diagramPane.set('activeSentence', sentence);
  },

  closeDiagramConnectPane: function () {
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    var theCanvas = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.bottomRightView');
    var diagramObjects = diagramPane.get('selectedObjects');
    var activeSentence = diagramPane.get('activeSentence');
    var allLinks = MySystem.store.find(MySystem.Link);
    if (activeSentence) {
      // Remove previously associated nodes and links
      activeSentence.get('nodes').removeObjects(activeSentence.get('nodes'));
      activeSentence.get('links').removeObjects(activeSentence.get('links'));
      this.addLinksAndNodesToSentence(diagramObjects, activeSentence);
    }
    if (diagramPane.isPaneAttached) {
      diagramPane.remove();
    }
    theCanvas.get('classNames').pop(); // TODO: This is brittle; if we've added another classname, it gets that instead of 'sentence-linking' which is what we want
    // Un-dim all links
    allLinks.forEach( function (link) {
      link.unDimColor();
    });
    MySystem.nodesController.unselectAll();
    diagramPane.set('activeSentence', null);
    // Refresh the transformation "badges" on the nodes.
    MySystem.get('nodesController').get('content').forEach(function(node) {
      node.notifyPropertyChange('transformationIcon');
    });
  },

  // Ensures there is only one active sentence-linking button at a time
  turnOffOtherButtons: function(buttonToLeaveOn) {
    var storyView = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView');
    var sentenceViews = storyView.get('contentView').get('childViews');
    sentenceViews.forEach( function (sentenceView) {
      if (sentenceView.get('linkButton') != buttonToLeaveOn) {
          sentenceView.get('linkButton').set('value', NO);
      }
    });
  },

  // Finished connecting nodes and links to sentences
  doneButtonPushed: function() {
    this.closeDiagramConnectPane();
    this.turnOffOtherButtons(null);
  },

  createSentence: function(node) {
    var sentence = this.addStorySentence();
    this.addLinksAndNodesToSentence([node], sentence);
    // This actually adds ALL links for a node to the sentence
    this.addLinksAndNodesToSentence(node.get('links').map(function(link){return link.model;}), sentence);
  },

  incrementOrderValues: function(startAt) {
    this.content.forEach( function (item, index, enumerable) {
      if (item.get('order') >= startAt) {
        item.set('order', item.get('order') + 1);
      }
    });
  }
}) ;
