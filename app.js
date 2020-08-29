//Budget Controller

 const budgetController = (function(){
 let Expense = function(id, description,value){
   this.id = id;
   this.description = description;
   this.value = value;
 };
 let Income = function(id, description,value){
   this.id = id;
   this.description = description;
   this.value = value;
 };

let calculateTotal = function(type){
  let sum = 0;
  data.allitems[type].forEach((cur)=>{
    sum += cur.value;
  });
  data.totals[type] = sum;
};

 let data ={
   allitems:{
     exp:[],
     inc:[]
 },

 totals:{
   exp: 0,
   inc: 0
 },
 budget: 0,
 percentage: -1
};

return {
  addItem: function(type,des,value){
    let newItem, id;

    // create new id
    if(data.allitems[type].length>0){
      id = data.allitems[type][data.allitems[type].length -1].id +1;
    }else{
      id = 0;
    }



//create new item based on income or expense type
    if(type === 'exp'){
      newItem = new Expense(id, des, value);
    } else if(type === 'inc'){
      newItem = new Income(id, des, value);
    }
    //push it into our data structure
    data.allitems[type].push(newItem);
    // return the new element
    return newItem;
  },
  calculateBudget: function(){

    // calculate total income and expenses
    calculateTotal('exp');
    calculateTotal('inc');


    // calculate the budget: income - expense
data.budget = data.totals.inc - data.totals.exp ;

    // calculate the percentage of income that we spent
    if(data.totals.inc > 0){
      data.percentage = Math.round((data.totals.exp / data.totals.inc ) * 100);
    }else{
      data.percentage = -1;
    }



  },

  getBudget: function(){
    return {
      budget: data.budget,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp,
      percentage: data.percentage + '%'
    }
  },


  testing: function(){
    console.log(data);
  }
};

})();




// uI controller
 const uiController = (function(){
// get all the strings in the dom
   let domStrings = {
     inputTypes:'.add__type',
     inputDescription: '.add__description',
     inputValues: '.add__value',
     inputBtn: '.add__btn',
     incomeContainer: '.income__list',
     expenseContainer: '.expenses__list',
     budgetLabel : '.budget__value',
     incomeLabel : '.budget__income--value',
     expenseLabel: '.budget__expenses--value',
     percentageLabel:'.budget__expenses--percentage',
     container: '.container'
   }

   return{
     // return inputs from the dom fields
     getInput: function(){
       return{
         type: document.querySelector(domStrings.inputTypes).value,
         description : document.querySelector(domStrings.inputDescription).value,
         value :parseFloat(document.querySelector(domStrings.inputValues).value)
       };
     },

     addListItem: function(obj, type){
       var html, newHtml, element;
       //create html strings with placeholder text
       if(type === 'inc'){
         element = domStrings.incomeContainer;
    html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

  }else if(type ==='exp'){
    element = domStrings.expenseContainer;

    html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
}

       //replace the placeholder text with some actual data
newHtml = html.replace('%id%',obj.id);
newHtml = newHtml.replace('%description%',obj.description);
newHtml = newHtml.replace('%value%', obj.value);

       // Insert the html into the dom
 document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
     },

clearFields: function(){
  let fields, fieldsarray;
  fields =document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValues);

  fieldsarray = Array.prototype.slice.call(fields);
  fieldsarray.forEach((currentvalue, index, array)=>{
    currentvalue.value = '';
   });
   fieldsarray[0].focus();
},

displayBudget: function(obj){
  document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
  document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
  document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp;


  switch (obj) {
    case 'obj.percentage > 0':
    document.querySelector(domStrings.percentageLabel).textContent = obj.percentage;
    default:document.querySelector(domStrings.percentageLabel).textContent = '---';

  }

},

     //export the domStrings to the public
 getDomstrings: function(){
       return domStrings;
     }

   };
 })();


// Global App Controller

const controller =(function(budgetCtrl, UiCtrl){
  // set up all event listeners
  let setupEventListeners = function(){
    // assign the domStrings method to the Dom variable
      let Dom = UiCtrl.getDomstrings();

    document.querySelector(Dom.inputBtn).addEventListener('click',ctrlAddItem );

    document.addEventListener('keypress',function(e){
      if(event.keycode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });

    document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);
  };

let updateBudget = function(){
  // 1. Calculate the budget__
budgetCtrl.calculateBudget();
  // 2. Return the budget
  let budget = budgetCtrl.getBudget();

  // 3. Display the budget on the Ui
  UiCtrl.displayBudget(budget);
};






  //add items to the dom or console
  let ctrlAddItem = function(){
    let input, newItem;
    //1. Get the field input data
    input = UiCtrl.getInput();
    if(input.description !== '' && !isNaN(input.value) && input.value > 0){
      // 2. add the item to the budget Controller
          newItem=budgetCtrl.addItem(input.type, input.description, input.value);

          // 3. add the item to the Ui
          UiCtrl.addListItem(newItem, input.type);

          // 4. clear the fieldsarray
          UiCtrl.clearFields();
          // 5. Calculate and updateBudget
      updateBudget();
    }

  };
let ctrlDeleteItem = function(event){
  let itemID;
  itemID =event.target.parentNode.parentNode.parentNode.parentNode.id;
}

// Initialize the app & export it to the public.
  return{
    init: function(){
      console.log('Application has started');
        UiCtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: 0 + '%'
        });
      setupEventListeners();
    }
  }
})(budgetController,uiController);

controller.init();
