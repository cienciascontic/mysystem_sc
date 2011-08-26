// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set
  saveFunction:      null,
  saveTime:          null,
  displayTime:       null,
  saveTimer:         null,
  autoSaveFrequency: 20000, // save every          20 seconds
  displayFrequency:   5000, // update disaply every 5 seconds

  // computes human-readable 'Saved: <when> text'
  saveStatusText: function() {
    var saveTime = this.get('saveTime'),
        seconds  = 0,
        minutes  = 0,
        hours    = 0,
        timeNow  = new Date().getTime();

    if (!!!saveTime) { return 'Not saved yet.'; }

    seconds = (timeNow - saveTime) / 1000.0;
    minutes = seconds / 60;
    hours   = minutes / 60;

    if (seconds < 10) { return ('Saved.'); }
    if (seconds < 60) { return ('Saved  ' + Math.round(seconds) + ' seconds ago.'); }
    if (minutes < 60) { return ('Saved '  + Math.round(minutes) + ' minutes ago.'); }
    return ('Saved '                      + Math.round(hours)   + ' hours ago.');

  }.property('saveTime', 'displayTime'),

  enableManualSave: function(){
    return !!this.get('saveFunction') && !!this.get('dataIsDirty');
  }.property('saveFunction', 'dataIsDirty'),

  // Called to attempt to save the diagram. Either by pressing 'save', navigating away,
  // or when the save button is pressed.
  // IMPORANT: dataSources must call: MySystem.savingController.set('dataIsDirty', YES); 
  save: function() {
    if(this.get('saveFunction') && this.get('dataIsDirty')) {
      this.get('saveFunction')();
    }
  },

  // Called when save function returns.
  // @param successful {Boolean}      true if the data was successfully saved
  saveSuccessful: function(successful) {
    if (successful){
      this.set('dataIsDirty', NO);
      this.set('saveTime', new Date().getTime());
    }
  },

  // Called when our dispayTimer reaches <displayFrequency> seconds
  // this will have the side-effect of calling this.saveStatusText()
  // which is observes 'displayTime'.
  updateDisplayTime: function() {
    this.set('displayTime', new Date().getTime());
  },

  setupTimers: function() {
    var saveTimer    = null,
        displayTimer = null;

    // This timer will attempt to display the last save time every <displayFrequency> seconds
    // unless the value for autoSaveFrequency is less than 1.
    if (this.get('displayFrequency') > 0) {
        this.set('displayTimer',SC.Timer.schedule({
          target:   this,
          action:   'updateDisplayTime',
          interval: this.get('displayFrequency'),
          repeats:  YES
        }));
    }

    // This timer will attempt to save dataevery <autoSaveFrequency> seconds
    // unless the value for autoSaveFrequency is less than 1.
    if (this.get('autoSaveFrequency') > 0) {
       this.set('saveTimer', SC.Timer.schedule({
          target:   this,
          action:   'save',
          interval: this.get('autoSaveFrequency'),
          repeats:  YES
        }));
    }
  }.observes('displayFrequency','autoSaveFrequency'),

  init: function() {
    sc_super();
    this.setupTimers();
  },

  destroy: function() {
    // ensure that our timers are destroyed.
    this.get('saveTimer').invalidate();
    this.set('saveTimer', null);
    this.get('displayTimer').invalidate();
    this.set('displayTimer', null);
    sc_super();
  }
});
