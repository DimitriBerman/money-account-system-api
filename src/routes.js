import { Router } from 'express';

const routes = Router();

const TRANSACTION_URI = '/transactions';

routes.get('/', (req, res) => {
  let balanceResponse = {
    balance: getBalance(transactionHistory_State)
  };
  res.json(balanceResponse);
});


routes.get(TRANSACTION_URI, (req,res) => {
  res.json(transactionHistory_State);
});

routes.post(TRANSACTION_URI, (req,res) => {
  console.info("req.body", req.body);

  let parsedAmount = parseFloat(req.body.amount);
  let type = req.body.type;

  console.info("parsedAmount", parsedAmount);

  if(!req.body ||
    parsedAmount < 0 ||
    !isTypeValid(type)){
    res.status(400).send('ERROR: Invalid Transaction.');
  }

  let newTransaction = new Transaction(
    getNewId(),
    type,
    parsedAmount,
    getCurrentDate()
  );

  var newState = insert(newTransaction);

  if(!newState) {
    res.status(400).send('ERROR: Invalid Transaction.');
    return;
  }

  console.info("newState", newState);

  transactionHistory_State = newState;

  res.json(newTransaction);
});

const operations = {
  CREDIT: 'credit',
  DEBIT: 'debit'
};

class Transaction {
  id;
  type;
  amount;
  effectiveDate;

  constructor(id, type, amount, effectiveDate) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.effectiveDate = effectiveDate;
  }
}

let getNewId = () => Math.random().toString(32).slice(2);

let getCurrentDate = () => new Date().toISOString();

let isTypeValid = (type) => type === operations.DEBIT || type === operations.CREDIT;

let transactionHistory_State = [
  new Transaction(getNewId(), operations.CREDIT, 100, getCurrentDate())
];

let insert = (t) => {
  console.log("insert");

  let newTransactionHistoryState = [...transactionHistory_State, t];

  let valid = validateState(newTransactionHistoryState);

  if(!valid){
    return false;
  }

  return newTransactionHistoryState;
};

let validateState = (transactionHistoryToValidate) => {
  console.log("validateState");

  console.info("transactionHistoryToValidate", transactionHistoryToValidate);

  let balance = getBalance(transactionHistoryToValidate);

  console.info("balance", balance);

  return balance >= 0;
}

let getBalance = (transactions) => {
  console.log("getBalance");

  let balance = transactions.reduce((previous, current) => {
    console.info("current",current);

    if(current.type === operations.CREDIT){
      return previous + current.amount;
    }

    if(current.type === operations.DEBIT){
      return previous - current.amount;
    }

  }, 0);

  return balance;
};

export default routes;
