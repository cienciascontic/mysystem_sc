/**
 * Sets the Mysystem2Node type as an object of this view
 *jslint browser: true, maxerr: 50, indent: 4 

 * @author npaessel
 */
View.prototype.Mysystem2Node = {};
View.prototype.Mysystem2Node.commonComponents = ['Prompt', 'LinkTo'];

/**
 * Sets the view and content and then builds the page
 */
View.prototype.Mysystem2Node.generatePage = function(view){
  this.view = view;
  this.content = this.view.activeContent.getContentJSON();
  if (typeof this.content == 'undefined') {
    this.content = {};
  }
  this.buildPage();
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 */
View.prototype.Mysystem2Node.getCommonComponents = function() {
  return this.commonComponents;
};

/**
 * Builds the html elements needed to author a my system node
 */
View.prototype.Mysystem2Node.buildPage = function(){
  var parent = document.getElementById('dynamicParent');

  /* remove any old elements */
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }

  /* create new elements */
  var pageDiv = createElement(document, 'div', {id: 'dynamicPage', style:'width:100%;height:100%'});
  var mainDiv = createElement(document, 'div', {id: 'mainDiv'});
  var modulesDiv = createElement(document, 'div', {id: 'modulesDiv', style:'width:100%;border: 1px solid black;'});
  var eTypesDiv = createElement(document, 'div', {id: 'eTypesDiv', style:'width:100%;border: 1px solid black;'});
  var instructionsText = document.createTextNode("When entering image filenames, make sure to use the asset uploader on the main authoring page to upload your images.");

  /* append elements */
  parent.appendChild(pageDiv);
  pageDiv.appendChild(mainDiv);
  mainDiv.appendChild(instructionsText);
  mainDiv.appendChild(createBreak());
  mainDiv.appendChild(document.createTextNode("Enter instructions -- text or html -- here."));
  mainDiv.appendChild(createBreak());
  mainDiv.appendChild(createElement(document, 'div', {id: 'promptContainer'}));
  mainDiv.appendChild(createBreak());
  mainDiv.appendChild(modulesDiv);
  mainDiv.appendChild(createBreak());
  mainDiv.appendChild(eTypesDiv);
  this.generateModules();
  this.generateEnergyTypes();
};

View.prototype.Mysystem2Node.populatePrompt = function() {
  $('#promptInput').val(this.content.prompt);
};

/**
 * Updates the html with the user entered prompt
 */
View.prototype.Mysystem2Node.updatePrompt = function(){
  this.content.prompt = document.getElementById('promptInput').value;

  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates the modules creation elements
 */
View.prototype.Mysystem2Node.generateModules = function(){
  var parent = document.getElementById('modulesDiv');
  var modsText = null;
  var a = 0;
  //remove old elements first
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }

  parent.appendChild(createBreak());

  if(this.content && this.content.modules && this.content.modules.length>0){
    modsText = document.createTextNode("Existing Modules");
  } else {
    modsText = document.createTextNode("Create Modules");
  }

  parent.appendChild(modsText);
  parent.appendChild(createBreak());

  if(this.content && this.content.modules && this.content.modules.length>0){
    //create current mod elements
    for(a=0;a<this.content.modules.length;a++){
      var modDiv = createElement(document, 'div', {id: 'modDiv_' + a});
      var modText = document.createTextNode('Module');
      var nameText = document.createTextNode("Name: ");
      var imageText = document.createTextNode("Image: ");
      var nameInput = createElement(document, 'input', {id: 'nameInput_' + a, type: 'text', value: this.content.modules[a].name, onchange: 'eventManager.fire("mysystemSCFieldUpdated",["name","' + a + '"])'});
      var imageInput = createElement(document, 'input', {id: 'imageInput_' + a, type: 'text', value: this.content.modules[a].image, onchange: 'eventManager.fire("mysystemSCFieldUpdated",["image","' + a + '"])'});
      var removeButt = createElement(document, 'input', {type: 'button', id: 'removeButt', value: 'remove module', onclick: 'eventManager.fire("mysystemSCRemoveMod","' + a + '")'});

      parent.appendChild(modDiv);
      modDiv.appendChild(modText);
      modDiv.appendChild(createBreak());
      modDiv.appendChild(nameText);
      modDiv.appendChild(nameInput);
      modDiv.appendChild(createBreak());
      modDiv.appendChild(imageText);
      modDiv.appendChild(imageInput);
      modDiv.appendChild(createBreak());
      modDiv.appendChild(removeButt);
      modDiv.appendChild(createBreak());
      modDiv.appendChild(createBreak());
    }
  }

  //create buttons to create new modules
  var createButt = createElement(document, 'input', {type:'button', value:'add new module', onclick:'eventManager.fire("mysystemSCAddNewModule")'});
  parent.appendChild(createButt);
};

/**
 * Generates the energy_types creation elements
 */
View.prototype.Mysystem2Node.generateEnergyTypes= function(){
  var parent = document.getElementById('eTypesDiv');
  var eTypesText = document.createTextNode("Create energy types");
  if (this.content && this.content.energy_types && this.content.energy_types.length) {}
  else { this.content.energy_types = []; }
  //remove old elements first
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  };

  parent.appendChild(createBreak());

  if(this.content.energy_types.length>0){
    var eTypesText = document.createTextNode("Existing energy types");
  }

  parent.appendChild(eTypesText);
  parent.appendChild(createBreak());

  //create current mod elements
  for(var a=0;a<this.content.energy_types.length;a++){
    var modDiv = createElement(document, 'div', {id: 'ETDiv_' + a});
    var modText = document.createTextNode('EnergyType');
    var labelText = document.createTextNode("Label: ");
    var colorText = document.createTextNode("Color: ");
    var labelInput = createElement(document, 'input', {id: 'labelInput_' + a, type: 'text', value: this.content.energy_types[a].label, onchange: 'eventManager.fire("mysystemSCEnergyFieldUpdated",["label","' + a + '"])'});
    var colorInput = createElement(document, 'input', {id: 'colorInput_' + a, type: 'text', value: this.content.energy_types[a].color, onchange: 'eventManager.fire("mysystemSCEnergyFieldUpdated",["color","' + a + '"])'});
    var removeButt = createElement(document, 'input', {type: 'button', id: 'removeButt', value: 'remove module', onclick: 'eventManager.fire("mysystemSCRemoveEtype,"' + a + '")'});
    var colorWell = createElement(document, 'div', {
      id: 'colorWell_' + a, 
      style:'display:inline-block; border: 1px solid black; margin-left:1em; width:15px; height:15px; background-color: ' +  this.content.energy_types[a].color + ';'
    });
    parent.appendChild(modDiv);
    modDiv.appendChild(modText);
    modDiv.appendChild(createBreak());
    modDiv.appendChild(labelText);
    modDiv.appendChild(labelInput);
    modDiv.appendChild(createBreak());
    modDiv.appendChild(colorText);
    modDiv.appendChild(colorInput);
    modDiv.appendChild(colorWell);
    modDiv.appendChild(createBreak());
    modDiv.appendChild(removeButt);
    modDiv.appendChild(createBreak());
    modDiv.appendChild(createBreak());
  };

  //create buttons to create new energy_types
  var createButt = createElement(document, 'input', {type:'button', value:'add new Energy Type', onclick:'eventManager.fire("mysystemSCAddNewEnergyType")'});
  parent.appendChild(createButt);
};
/**
 * Updates a module's, at the given index, filed of the given name
 * with the given value.
 */
View.prototype.Mysystem2Node.fieldUpdated = function(name,ndx){
  this.content.modules[ndx][name] = document.getElementById(name + 'Input_' + ndx).value;

  /* for now, the icon is the same as the image */
  if(name=='image'){
    this.content.modules[ndx].icon = document.getElementById(name + 'Input_' + ndx).value;
  };

  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};

/**
 * Removes a module from the modules
 */
View.prototype.Mysystem2Node.removeMod = function(ndx){
  this.content.modules.splice(ndx, 1);
  this.generateModules();

  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};

/**
 * Creates a new dummy module object and adds it to the mods array
 */
View.prototype.Mysystem2Node.AddNewModule = function(){
  this.content.modules.push({name:'', icon:'', image:'', xtype:'MySystemContainer', etype:'source', fields:{efficiency:'1'}});
  this.generateModules();

  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};

/**
 * Creates a new dummy module object and adds it to the mods array
 */
View.prototype.Mysystem2Node.AddNewEnergyType = function(){
  this.content.energy_types.push({label:'heat',color:'#E97F02'});
  this.generateEnergyTypes();
  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};
/**
 * Removes a module from the modules
 */
View.prototype.Mysystem2Node.removeEtype = function(ndx){
  this.content.energy_types.splice(ndx, 1);
  this.generateEnergyTypes();
  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};

/** 
 * Updates a module's, at the given index, filed of the given name
 * with the given value.
 */
View.prototype.Mysystem2Node.fieldEnergyUpdated = function(name,ndx){
  this.content.energy_types[ndx][name] = document.getElementById(name + 'Input_' + ndx).value;
  // deviant use of jQuery here?
  var colorWell = $('#colorWell_'+ndx);
  colorWell.css('background-color',this.content.energy_types[ndx].color);
  /* fire source updated event */
  this.view.eventManager.fire('sourceUpdated');
};
/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.Mysystem2Node.updateContent = function(){
  /* update content object */
  this.view.activeContent.setContent(this.content);
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
  eventManager.fire('scriptLoaded', 'vle/node/mysystem2/authorview_mysystem2.js');
};




