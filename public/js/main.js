var dataPool = {
	urlFun: "data/dark.js",
	urlSty: "data/medium.js",
	urlEle: "data/light.js",
	f: '',
	s: '',
	e: '',
	initiated: false,
	init: function(){
		var self = this;
		var count = 0;
		var u = self.urlFun;
		function makeCall(i, u){
			$.ajax({cache:false,url: u,type: 'GET',dataType: 'script',
				complete: function(){
					if(i==2) activate();
				},
				success: function(data){
					//console.log('in ajax');
					self[(i==0)?'f':''|(i==1)?'s':''|(i==2)?'e':'']=myJson;
				},
				error: function(xhr, status, errorThrown) {
					console.log(errorThrown);
				}
			});
		}
		for(var i=0; i<3; i++){
			if(i==1) u = self.urlSty;
			if(i==2) u = self.urlEle;
			makeCall(i,u);
		}
	}
}
dataPool.init();

function activate(){
	//dataPool.prototype.f = 
	var TagsManager = function(){
		this.fun = [];
		this.sty = [];
		this.ele = [];
	}
	var tagsMngr = new TagsManager();	
	var formatTagName = function(str){  //tag name string re-format
		var str = str.charAt(0).toUpperCase() + str.slice(1);
		str = str.replace(/(_.)/g,function(x){return ' ' + x[1].toUpperCase()});
		return str;
	}
	
	function traverse(jsonObj){
		$.each(jsonObj, function(k,v) {
			if( typeof v == "object" ) {
				traverse(v);
			} else {
				jsonObj.fName = formatTagName(v);
			}
		});
		return jsonObj;
	}
	
	var tagsViewModel = function(){ // View Model class
		var self=this, arrL1=[], arrL2=[], arrL3=[], arrSl1=[], arrEl1=[];
		var nTagsFun = jQuery.extend(true, {}, dataPool.f); // extending the Function json object
		var nObj =  traverse(nTagsFun).l1;
		$.each(nObj,function(k,v){//populates fun l1 after page loads
			arrL1.push(v);
		});
		self.l1 = ko.observableArray(arrL1); // adding properties to the Veiw Model to set as observable arrays
		self.l2 = ko.observableArray(arrL2);
		self.l3 = ko.observableArray(arrL3);
		self.sl1 = ko.observableArray(arrSl1);
		self.el1 = ko.observableArray(arrEl1);
	
		self.hasChildren = ko.observable(''); // setting observables 
		self.addToScope = ko.observableArray([]); //observable array for scope area
	
		self.txtFormat = function(el){ //manages self and siblings' font weight
				$(el).parents('.parentDiv').find('a').removeClass('txtBold');
				$(el).addClass('txtBold');
		}
	
		self.inputVisibleL2 = ko.observable(false);
		self.inputVisibleL3 = ko.observable(false);
	
		self.addL1= function(data, event){ //controls level2 VM - V bindings
				var name = data.name;
				self.l2.removeAll(); //empties array in level 2
				self.l3.removeAll(); //empties array in level 3
				self.txtFormat(event.target);
				$.each(data.l2,function(k,v){ //sets states, css classes and populates an array
					if(v.l3.length==0){
						self.hasChildren = 'noChildren'; //sets css class to control elements w & w/o children
						self.inputVisibleL2(true);
					} else {
						self.hasChildren = '';
						self.inputVisibleL2(false);
					}
					arrL2.push(v); //updates array holder for VM for level 2
				});
				self.l2.push(arrL2.pop()); //updates VM for level 2
		}
	
		self.addL2=function(data, event){ //controls level3 VM - V bindings
			var name = data.name;
				self.l3.removeAll();
				self.txtFormat(event.target);
				$.each(data.l3,function(k,v){
					self.hasChildren = 'noChildren';
					self.inputVisibleL3(true);
					arrL3.push(v);
				});
				self.l3.push(arrL3.pop());
		}
	
		self.addL3=function(data, event){ //unused for future work with level 3
			//console.log(data);
		}
	
		self.readInputVal=function(data,event){ //updates scope
			var name = data;
			var n = event.target.name;
			var val = event.target.value;
			var addToForm = function(n,val){
				tagsMngr[n].push(val);
			}
			var removeFromForm = function(n,val){
				var i = tagsMngr[n].indexOf(val);
				tagsMngr[n].splice(i, 1);
			}
	
			if(event.target.checked){ //deligates to update 2 arrays
				addToForm(n,val);
				self.addToScope.push(name);
			} else { //deligates to remove from 2 arrays
				removeFromForm(n,val);
				self.addToScope.remove(name);
			}
		}
	
		self.inputX={ //handles display of the scope elements
			show:function(data,event){
				//console.log('show');
				//console.log(data);
				$(event.target).addClass('toolTipOn');
			},
			hide:function(data,event){
				//console.log('hide');
				$(event.target).removeClass('toolTipOn');
			}
		}
	
		self.scopeItem=function(data, event){ //handles input fields and states
			$('input[value="'+data.name+'"]').attr('checked',false);
			self.addToScope.remove(data);
			$.each(tagsMngr, function(k,v){ //removes elements from form collection of tags
				$.each(v,function(a,b){
					if(b===data.name){
						v.splice(a, 1);
					}
				});
			});
		}
	
		self.delegateToInput=function(data,event){
			var delegatedEl = $(event.target).prev().find('input');
			$(delegatedEl).trigger('click');
		}
		self.tabSelected=function(data, event){ //handles Fun/Sty/Ele tab selection logic
			var id = event.target.id;
			//console.log(id);
			var tabRender = function(j,r,ObjR){ //helper
					var myjson = traverse(j);
					$.each(myjson.l1,function(k,v){
						r.push(v);
					});
					self.l2.removeAll(); //empties array in level 2
					self.l3.removeAll(); //empties array in level 3
					ObjR.push(r.pop());
			}
			switch(id){ //control flow for each tab
				case 'funJson':
					var fL1 = jQuery.extend(true, {}, dataPool.f);
					self.l1.removeAll();
					tabRender(fL1, arrL1, self.l1); 
				break;
				case 'styJson':
					self.sl1.removeAll();
					tabRender(dataPool.s, arrSl1, self.sl1); 
				break;
				case 'eleJson':
					self.el1.removeAll();
					tabRender(dataPool.e, arrEl1, self.el1); 
				break;
			}
		}
	}
	
	ko.applyBindings(new tagsViewModel());
}

$(document).ready(function() {
	/*
  var submitButton = $('input[type="submit"]');
  $('#new_image').submit(function(){
    var tags = function(){
      var col = '';
      $.each(tagsMngr, function(k,v){
        $.each(v,function(a,b){
          var nAtr = '';
          switch(k){
            case 'fun'://create input field for fun
              nAtr='function';
            break;
            case 'sty'://create input field for fun
              nAtr='style';
            break;
            case 'ele'://create input field for fun
              nAtr='element';
            break;
          }
          col+="<input name='image["+nAtr+"_list][]' value='"+b+"' />";
        });
      });
      return col;
    }
    $('#new_image').prepend(tags());
  });
  $('#tagScope').click(function(){
  });
  */
});
