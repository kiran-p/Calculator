(function($) {
    $.widget( "ui.calculator",{
        firstValueSelected:null,
        secondValueSelected:0,
        operatorSelected: null,
        operatorClick:false,
        result :0,
        change:0,
        resultField:null,

        options: {
          theme:'theme1'
        },

        _create: function() {
            this.element.addClass('jq-calculator');
            var o = this.options;
            console.log(this.options);
            this.element.addClass(o.theme);
            this.resultField=$(document.createElement("input")).attr('type','text').addClass('screen').css('direction','rtl');
            this.element.append(this.resultField);

            var specialGrp = $(document.createElement("section")).addClass('splCharacters');
            this.element.append(specialGrp);
            var numberGrp = $(document.createElement("section")).addClass('numbers');
            this.element.append(numberGrp);
            var operatorGrp = $(document.createElement("section")).addClass('operators');
            this.element.append(operatorGrp);

            var splButtons = ['MC','MR','MS','M+','M-','CE','Ca','^','1/x','$'];
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
            this._renderButtonElement('clear','%', this._handleClearClick,operatorGrp)
        } ,

        _renderButtonElement : function(type, value, clickHandler, sectionName){
            var btn=$(document.createElement("Button")).attr('value',value).addClass(type).html(value);
            $(btn).on('click', this, clickHandler);
            $(sectionName).append(btn);
        },

        setFirstNumber: function(number){
            this._handleNumber(number);
        },
        setSecondNumber: function (number){
            this._handleNumber(number);
        },
        setOperator: function (operator){
            this._handleOperator(operator);
        },

        _handleNumberClick : function(evt) {
            var obj= evt.data;
            // referring to the target i.e. HTML Button element
            var value = (evt.target).value;
            console.log(obj);
            // retrieving the value from the target
            obj._handleNumber(value);
        },
        _handleNumber : function(value){
            if(this.operatorClick){
                this.resultField.val(value);
                this.operatorClick=false;
            }else{
                this.resultField.val(this.resultField.val()+value);
                // appending the number input
            }
        },

        _handleOperatorClick : function(evt) {
            // if result exists then its a second operation we need to set the  firstValueSelected to result
            var obj= evt.data;
            var value = (evt.target).value;
            obj._handleOperator(value);
        },

        _handleOperator : function(operator){
            // if result exists then its a second operation we need to set the  firstValueSelected to result
            if(this.firstValueSelected !=null){
                this.handleEqual();
                this.firstValueSelected = this.result;
            }else{
                this._clearAndStoreValue(true);
            }
            //store the value and clear the text field
            // Retrieving the operator from the target
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
                    this.result = this.firstValueSelected - this.secondValueSelected;
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
            this.resultField.val(this.result);
            this.operatorClick = true;
        },

        _handleClearClick : function(evt) {
            var self= evt.data;
            self.resultField.val(null);
            // clearing the screen and initializing the values of the variables
            self.firstValueSelected = null;
            self.secondValueSelected = 0;
            self.operatorSelected = null;
            self.result = 0;
            self.operatorClick=false;
        },
        _handleSplClick : function() {},

        destroy: function() {
            $('.number').unbind('click');
            $('.operator').unbind('click');
            $('.clear').unbind('click');
            $('.equalTo').unbind('click');
            $('.splCharacters').unbind('click');
        }
    });
})( jQuery );