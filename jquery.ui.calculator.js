(function($) {
    $.widget( "ui.calculator",{
        firstValueSelected:null,
        secondValueSelected:0,
        operatorSelected: null,
        operatorClick:false,
        result :null,
        change:0,
        resultField:null,
        memory:0,
        isPositive:true,
        splClick:true,
        memoryField:null,
        options: {
        theme:'forest'
        //default theme if nothing is specified.
        },

        _create: function() {
            this.element.addClass('jq-calculator');
            // adding a class to the div element
            var o = this.options;
            // retrieving the options given
            this.element.addClass(o.theme);
            // adding a class with the theme given
            this.resultField=$(document.createElement("input")).attr('type','text').addClass('screen').css('direction','rtl');
            // creating an input field for output screen
            this.element.append(this.resultField);
            var span = $(document.createElement("span"));
            // creating an input field for output screen
            this.element.append(span);
            this.memoryField = span;
            // appending it to the parent element
            var specialGrp = $(document.createElement("section")).addClass('splCharacters');
            // a group for the special characters
            this.element.append(specialGrp);
            var numberGrp = $(document.createElement("section")).addClass('numbers');
            // a group for the numbers
            this.element.append(numberGrp);
            var operatorGrp = $(document.createElement("section")).addClass('operators');
            // a group for the operators
            this.element.append(operatorGrp);

            var splButtons = ['MC','MR','MS','M+','M-','CE','&#177;','&#8730;','1/x','&#8592;'];
            // Handling the special buttons
            for(var i=0;i<splButtons.length;i++){
                this._renderButtonElement('splCharacter',splButtons[i], this._handleSplClick,specialGrp);
            }

            var numButtons = ['7','8','9','4','5','6','1','2','3','0','.'];
            // Handling the number buttons
            for(var i=0;i<numButtons.length;i++){
                this._renderButtonElement('number',numButtons[i], this._handleNumberClick, numberGrp);
            }
            //when initializing the class we need to set event listeners on the buttons
            //get the elements by class name and add event listener
            // buttons is an array of the elements retrieved
            var opButtons = ['+','-','*','/'];
            // Handling the operator buttons
            for (var j=0;j<opButtons.length;j++){
                this._renderButtonElement('operator',opButtons[j], this._handleOperatorClick,operatorGrp);
            }
            // Handling Equal button
            this._renderButtonElement('clear','C', this._handleClearClick,operatorGrp);
            // Handling Clear button
            this._renderButtonElement('equalTo','=', this._handleEqualClick,operatorGrp);
            // Handling the inputs from keyboard
            this._renderButtonElement('clear','%', this._handleSplClick,operatorGrp)
            console.log(document);
            console.log(this.element);
            $(document).live('keypress', this, this._handleKeyPress);
        } ,

        _renderButtonElement : function(type, value, clickHandler, sectionName){
        // creates buttons with required attributes and attaches an event Handlers
            var btn=$(document.createElement("Button")).attr('value',value).addClass(type).html(value);
            $(btn).on('click', this, clickHandler);
            $(sectionName).append(btn);
        },

        _handleKeyPress: function(evt){
            var obj = evt.data;
            var keyCode = evt.which;
            console.log(keyCode);
            console.log(obj);
            console.log(obj.resultField);
            // getting the key code of the key pressed
            var value = String.fromCharCode(keyCode);
            // retrieving the character from the key code
            if((keyCode>=48 && keyCode<=57)||(keyCode==46)){
            // handling the number keys and '.' key
                if(obj.operatorClick){
                    obj.resultField.val(value);
                    obj.operatorClick=false;
                }else{
                    obj.resultField.val(obj.resultField.val()+value);
                }
            } else if(keyCode==42||keyCode==43||keyCode==45||keyCode==47){
            // handling the operator keys
                if(obj.firstValueSelected != null ){
                    obj.handleEqual();
                    obj.firstValueSelected = obj.result;
                }else{
                    obj._clearAndStoreValue(true);
                }
                obj.operatorSelected = value;
                obj.operatorClick = true;

            }else if((keyCode==61)||(keyCode==13)){
            // handling '=' key and 'enter' key
                 obj.handleEqual();
            }else if(keyCode==67||keyCode==99){
            // handling 'c' and 'C' for clearing the screen
                obj._handleClearClick(evt);
            }
        },

        setFirstNumber: function(number){
        // Handles input for programmatical input
            this._handleNumber(number);
        },
        setSecondNumber: function (number){
        // Handles input for programmatical input
            this._handleNumber(number);
        },
        setOperator: function (operator){
        // Handles input for programmatical input
            this._handleOperator(operator);
        },

        _handleNumberClick : function(evt) {
        // handles the number click and retrieves the number from target
            var obj= evt.data;
            // referring to the target i.e. HTML Button element
            var value = (evt.target).value;
            // retrieving the value from the target
            obj._handleNumber(value);
        },
        _handleNumber : function(value){
        // takes the number as argument
            if(this.splClick==false){
                this.resultField.val(null);
                this.splClick=true;
            }
            if(this.operatorClick){
                this.resultField.val(value);
                this.operatorClick=false;
            }else{
                this.resultField.val(this.resultField.val()+value);
                // appending the number input
            }
        },

        _handleOperatorClick : function(evt) {
            var obj= evt.data;
            var value = (evt.target).value;
            // Retrieving the operator from the target
            obj._handleOperator(value);
        },

        _handleOperator : function(operator){
            // if result exists then its a second operation we need to set the  firstValueSelected to result

            if(this.splClick==false){
                this._clearAndStoreValue(true);
            }else{
                if(this.firstValueSelected !=null){
                    this.handleEqual();
                    this.firstValueSelected = this.result;
                }else{
                    this._clearAndStoreValue(true);
                }
            }
            //store the value and clear the text field
            this.operatorSelected = operator;
            this.operatorClick = true;

        },

        _clearAndStoreValue:function(isFirstValue) {
            var value = this.resultField.val();
            // Storing the value entered before clearing the screen
            if(isFirstValue){
                this.firstValueSelected = Number(value);
            }else{
                this.secondValueSelected = Number(value);
            }
            this.resultField.val(null);
        },

        _setCalculatedResult : function(){
            switch(this.operatorSelected){
            //  appending the operators and the values
                case '+' :
                    this.result = this.firstValueSelected + this.secondValueSelected;
                break;
                case '-' :
                    this.result =  - this.secondValueSelected + this.firstValueSelected;
                break;
                case '/' :
                    this.result = this.firstValueSelected / this.secondValueSelected;
                break;
                case '*' :
                    this.result = this.firstValueSelected * this.secondValueSelected;
                break;
            }
        },

        _handleEqualClick : function(evt) {
            var self= evt.data;
            self.handleEqual();
        },
        handleEqual : function(){
            this._clearAndStoreValue(false);
            this._setCalculatedResult();
            if(this.result!=null){
                this.resultField.val(this.result);
            }else{
                this.resultField.val(this.secondValueSelected);
            }
            this.operatorClick = true;
            this.firstValueSelected=0;
//            this.secondValueSelected=0;
        },

        _handleClearClick : function(evt) {
            var self= evt.data;
            self.resultField.val(null);
            // clearing the screen and initializing the values of the variables
            self.firstValueSelected = null;
            self.secondValueSelected = 0;
            self.operatorSelected = null;
            self.result = null;
            self.operatorClick=false;
        },
        _handleSplClick : function(evt) {
            var obj= evt.data;
            var value = (evt.target).value;
            if (value=='&#8592;'){
            // handling backspace
                obj.resultField.val(obj.resultField.val().slice(0,-1));
            }else if(value=='&#177;'){
            // handling +/- operator
                    obj.resultField.val(obj.resultField.val()*(-1));
            } else if(value=='CE'){
            // handling CE
                obj.resultField.val(null);
            } else if(value=='1/x'){
            // handling reciprocal
                obj.resultField.val(1/obj.resultField.val());
            } else if(value=='&#8730;'){
            // handling square root
                obj.resultField.val(Math.sqrt(obj.resultField.val()));
            } else if(value=='%'){
            // handling percentage
                obj.resultField.val(obj.resultField.val()/100);
            } else if(value=='MC'){
            // handling Clear Memory
                obj.memory=0;
                obj.memoryField.text('');
            } else if(value=='MR'){
            // handling Memory Recall
                obj.resultField.val(obj.memory);
                obj.firstValueSelected=0;
                obj.secondValueSelected=0;
                obj.memoryField.text('M');
            } else if(value=='MS'){
            // handling Memory Store
                var value = Number(obj.resultField.val());
                obj.memory=value;
                obj.splClick=false;
                obj.memoryField.text('M');
            } else if(value=='M+'){
            // handling Memory addition
                var value = Number(obj.resultField.val());
                obj.memory = obj.memory + value;
                obj.splClick=false;
                obj.memoryField.text('M');
            } else if(value=='M-'){
            // handling Memory Subtraction
                var value = Number(obj.resultField.val());
                obj.memory = obj.memory - value;
                obj.splClick=false;
                obj.memoryField.text('M');
            }
        },

        destroy: function() {
        // destroy function removes the functionality of the buttons by unbinding the event handlers
            $('.number').unbind('click');
            $('.operator').unbind('click');
            $('.clear').unbind('click');
            $('.equalTo').unbind('click');
            $('.splCharacters').unbind('click');
        }
    });
})( jQuery );